// backend/controllers/courseController.js
import mongoose from 'mongoose';
import Course from '../models/Course.js';
import GeneratedData from '../models/GeneratedData.js';
import Enrollment from '../models/Enrollment.js'; // { userId, courseId, createdAt } unique(userId,courseId)
import Progress from '../models/Progress.js';     // extend to store assignmentState and quizState (see usage)
import Rating from '../models/Rating.js';
import Bookmark from '../models/Bookmark.js';
import User from '../models/User.js';
import { callAIGenerate } from '../services/aiService.js';

/* ---------- helpers ---------- */
function findLessonIndex(course, lessonId) {
  for (let mi = 0; mi < (course.modules || []).length; mi++) {
    const mod = course.modules[mi];
    const li = (mod.lessons || []).findIndex(l => String(l._id) === String(lessonId));
    if (li !== -1) return { mi, li };
  }
  return null;
}
function getAllLessonIds(course) {
  const ids = [];
  for (const m of course.modules || []) for (const l of m.lessons || []) if (l._id) ids.push(String(l._id));
  return ids;
}
function calcPercent(totalLessons, completedSet) {
  return totalLessons === 0 ? 0 : Math.round((completedSet.size / totalLessons) * 100);
}
function lastPassedModuleIndex(progress) {
  const passed = progress?.quizState || {};
  const indices = Object.values(passed)
    .filter(v => v?.passed)
    .map(v => v.moduleOrder ?? -1)
    .filter(n => n >= 0);
  return indices.length ? Math.max(...indices) : -1;
}

/* ---------- background AI generation (unchanged) ---------- */
async function generateAndPopulateCourse({ courseId, genId, input }) {
  let genRecord = null;
  try {
    genRecord = await GeneratedData.findById(genId);
    if (!genRecord) throw new Error('GeneratedData record not found');
    genRecord.status = 'pending';
    await genRecord.save();

    let result;
    try {
      result = await callAIGenerate({
        title: input.title,
        audience: input.audience,
        duration: input.duration,
        format: input.format
      });
    } catch (aiErr) {
      console.error('[generateAndPopulateCourse] AI call failed:', aiErr);
      genRecord.status = 'failed';
      if (typeof aiErr?.rawText !== 'undefined' && aiErr.rawText !== null) {
        genRecord.rawOutput = typeof aiErr.rawText === 'string' ? aiErr.rawText : JSON.stringify(aiErr.rawText);
      }
      genRecord.error = aiErr.message || 'ai_call_failed';
      await genRecord.save().catch(() => {});
      return;
    }

    if (typeof result?.rawText !== 'undefined' && result.rawText !== null) {
      genRecord.rawOutput = typeof result.rawText === 'string' ? result.rawText : JSON.stringify(result.rawText);
    }

    if (!result?.success) {
      genRecord.status = 'failed';
      if (Array.isArray(result?.validationErrors)) genRecord.validationErrors = result.validationErrors;
      if (result?.parseError) genRecord.parseError = result.parseError;
      genRecord.error = genRecord.error || (!result?.rawText ? 'no_model_output' : 'generation_failed');
      await genRecord.save();
      return;
    }

    genRecord.status = 'done';
    genRecord.validationErrors = [];
    genRecord.parseError = undefined;
    genRecord.error = undefined;
    await genRecord.save();

    const aiOutput = result.parsed;
    const course = await Course.findById(courseId);
    if (!course) throw new Error('Course not found');

    // Map AI output into richer schema; safe defaults
    course.modules = (aiOutput.modules || []).map((m, mi) => ({
      title: m.title || '',
      order: typeof m.order === 'number' ? m.order : mi,
      lessons: (m.lessons || []).map((l, li) => ({
        title: l.title || '',
        description: l.description || '',
        content: l.content || '',
        resources: Array.isArray(l.resources) ? l.resources : (Array.isArray(l.wikipedia) ? l.wikipedia : []).map(url => ({ url, label: 'Wikipedia', source: 'wikipedia' })),
        assignment: l.assignment || { title: 'Assignment', description: '', instructions: '', required: true },
        order: typeof l.order === 'number' ? l.order : li
      })),
      quiz: {
        questions: Array.isArray(m.quiz?.questions) ? m.quiz.questions : [],
        passPercent: Number.isFinite(+m.quiz?.passPercent) ? +m.quiz.passPercent : 75
      }
    }));
    course.assessments = (aiOutput.assessments || []).map((a, ai) => ({
      type: a.type || 'quiz',
      data: a.data || {},
      order: typeof a.order === 'number' ? a.order : ai
    }));
    course.description = aiOutput.description || course.description;
    course.aiGenerated = true;

    await course.save();
  } catch (err) {
    try {
      if (genRecord) {
        genRecord.status = genRecord.status === 'done' ? 'done' : 'failed';
        genRecord.error = genRecord.error || (err.message || 'unknown error');
        if (!genRecord.rawOutput && (typeof err?.rawText !== 'undefined' && err.rawText !== null)) {
          genRecord.rawOutput = typeof err.rawText === 'string' ? err.rawText : JSON.stringify(err.rawText);
        }
        await genRecord.save().catch(() => {});
      }
    } catch {}
    console.error('generateAndPopulateCourse error:', err);
  }
}

/* ========== controllers ========== */

export async function createCourse(req, res, next) {
  try {
    const { title, audience, duration, format } = req.body;
    if (!title || typeof title !== 'string' || title.trim().length < 3) {
      return res.status(400).json({ error: 'title is required (min 3 chars)' });
    }

    const course = await Course.create({
      title: title.trim(),
      description: '',
      status: 'draft',
      createdBy: req.user.id,
      modules: [],
      assessments: [],
      aiGenerated: false,
      audience: audience || null,
      format: format || null,
      duration: duration || null
    });

    const genRecord = await GeneratedData.create({
      courseId: course._id,
      input: { title: course.title, audience, duration, format },
      rawOutput: null,
      status: 'pending',
      validationErrors: []
    });

    setImmediate(() =>
      generateAndPopulateCourse({
        courseId: course._id.toString(),
        genId: genRecord._id.toString(),
        input: { title: course.title, audience, duration, format }
      })
    );

    return res.status(201).json({
      courseId: course._id,
      message: 'Course created. AI generation started (background).'
    });
  } catch (err) {
    next(err);
  }
}

export async function getCourse(req, res, next) {
  try {
    const course = await Course.findById(req.params.id).populate('createdBy', 'name email role');
    if (!course) return res.status(404).json({ error: 'Course not found' });

    // access policy
    if (req.user.role === 'teacher' && course.createdBy._id.toString() !== req.user.id && course.status !== 'published' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    if (req.user.role === 'student' && course.status !== 'published') {
      return res.status(403).json({ error: 'Forbidden: course not published' });
    }

    const [gen, enrolled, bookmarked, myRating, stats] = await Promise.all([
      GeneratedData.findOne({ courseId: course._id }).sort({ createdAt: -1 }).lean(),
      Enrollment.findOne({ userId: req.user.id, courseId: course._id }).lean(),
      Bookmark.findOne({ userId: req.user.id, courseId: course._id }).lean(),
      Rating.findOne({ userId: req.user.id, courseId: course._id }).lean(),
      Rating.aggregate([
        { $match: { courseId: course._id } },
        { $group: { _id: '$courseId', avg: { $avg: '$rating' }, count: { $sum: 1 } } }
      ])
    ]);

    const ratingSummary = stats[0] ? { average: Number(stats[0].avg.toFixed(2)), count: stats[0].count } : { average: 0, count: 0 };

    res.json({
      course,
      generated: gen
        ? {
            status: gen.status,
            rawOutput: gen.rawOutput,
            parseError: gen.parseError || null,
            validationErrors: gen.validationErrors || [],
            error: gen.error || null,
            createdAt: gen.createdAt,
            updatedAt: gen.updatedAt
          }
        : null,
      meta: {
        enrolled: !!enrolled,
        bookmarked: !!bookmarked,
        myRating: myRating ? { rating: myRating.rating, review: myRating.review } : null,
        ratingSummary
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function updateCourse(req, res, next) {
  try {
    const payload = req.body;
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    if (course.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const updatable = ['title', 'description', 'modules', 'assessments', 'status', 'audience', 'format', 'duration'];
    let touchedModulesOrAssessments = false;

    for (const k of updatable) {
      if (payload[k] !== undefined) {
        if (k === 'modules') {
          if (!Array.isArray(payload.modules)) return res.status(400).json({ error: 'modules must be an array' });
          touchedModulesOrAssessments = true;
          course.modules = payload.modules;
        } else if (k === 'assessments') {
          if (!Array.isArray(payload.assessments)) return res.status(400).json({ error: 'assessments must be an array' });
          touchedModulesOrAssessments = true;
          course.assessments = payload.assessments;
        } else if (k === 'status') {
          if (payload.status === 'published') return res.status(400).json({ error: 'Use /:id/publish to publish' });
          if (payload.status && !['draft', 'published'].includes(payload.status)) {
            return res.status(400).json({ error: 'invalid status value' });
          }
          course.status = payload.status;
        } else {
          course[k] = payload[k];
        }
      }
    }

    if (touchedModulesOrAssessments) course.aiGenerated = false;

    await course.save();
    res.json({ ok: true, course });
  } catch (err) {
    next(err);
  }
}

export async function publishCourse(req, res, next) {
  try {
    const courseId = req.params.id;
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });

    const course = await Course.findById(courseId).exec();
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const ownerId = course.createdBy ? course.createdBy.toString() : null;
    const currentUserId = req.user.id ? req.user.id.toString() : null;
    const userRole = req.user.role || 'unknown';

    if (userRole === 'admin') {
      // ok
    } else if (userRole === 'teacher') {
      if (!ownerId || ownerId !== currentUserId) {
        return res.status(403).json({ error: 'Forbidden: teachers may only publish courses they created' });
      }
    } else {
      return res.status(403).json({ error: 'Forbidden: only teachers or admins may publish courses' });
    }

    // Validate structure
    if (!Array.isArray(course.modules) || course.modules.length === 0) {
      return res.status(400).json({ error: 'Cannot publish an empty course. Add modules & lessons.' });
    }

    for (const [i, m] of course.modules.entries()) {
      if (!Array.isArray(m.lessons) || m.lessons.length < 5) {
        return res.status(400).json({ error: `Module ${i + 1} must have at least 5 lessons` });
      }
      for (const [j, l] of m.lessons.entries()) {
        if (!l.description || !l.description.trim()) {
          return res.status(400).json({ error: `Lesson ${j + 1} in Module ${i + 1} must have a description` });
        }
        if (!Array.isArray(l.resources) || l.resources.length === 0) {
          return res.status(400).json({ error: `Lesson ${j + 1} in Module ${i + 1} must have at least one resource link` });
        }
        if (!l.assignment || l.assignment.required !== true) {
          return res.status(400).json({ error: `Lesson ${j + 1} in Module ${i + 1} must include a required assignment` });
        }
      }
      if (!m.quiz || !Array.isArray(m.quiz.questions) || m.quiz.questions.length < 10) {
        return res.status(400).json({ error: `Module ${i + 1} must include a quiz with at least 10 questions` });
      }
      if (!(m.quiz.passPercent >= 50 && m.quiz.passPercent <= 100)) {
        return res.status(400).json({ error: `Module ${i + 1} quiz passPercent must be between 50 and 100` });
      }
    }

    course.status = 'published';
    await course.save();
    return res.json({ ok: true, course });
  } catch (err) {
    console.error('[publishCourse] error', err);
    next(err);
  }
}

export async function deleteCourse(req, res, next) {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    if (course.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    try {
      await GeneratedData.deleteMany({ courseId: course._id });
      await Enrollment.deleteMany({ courseId: course._id });
      await Progress.deleteMany({ courseId: course._id });
      await Rating.deleteMany({ courseId: course._id });
      await Bookmark.deleteMany({ courseId: course._id });
    } catch (e) {
      console.error('Cleanup error for course', course._id.toString(), e);
    }

    try {
      await course.deleteOne();
    } catch (e) {
      await Course.deleteOne({ _id: course._id });
    }

    return res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

/* ========== Search, filters, mine listing ========== */

function parseBool(val) {
  if (typeof val === 'boolean') return val;
  if (!val) return false;
  return String(val).toLowerCase() === 'true' || String(val) === '1';
}

export async function listCourses(req, res, next) {
  try {
    const mine = parseBool(req.query.mine);
    const q = (req.query.q || '').trim();
    const audience = (req.query.audience || '').trim();
    const format = (req.query.format || '').trim();
    const durationMin = Number.isFinite(+req.query.durationMin) ? +req.query.durationMin : undefined;
    const durationMax = Number.isFinite(+req.query.durationMax) ? +req.query.durationMax : undefined;
    const sort = (req.query.sort || 'newest'); // newest | rating | popular

    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.min(100, parseInt(req.query.limit || '20', 10));
    const skip = (page - 1) * limit;

    if (mine) {
      if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
      if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden: mine is for teachers/admins' });
      }
      const courses = await Course.find({ createdBy: req.user.id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
      return res.json({ courses, page, limit });
    }

    const match = { status: 'published' };
    if (q) {
      match.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }
    if (audience) match.audience = audience;
    if (format) match.format = format;
    if (durationMin !== undefined || durationMax !== undefined) {
      match.duration = {};
      if (durationMin !== undefined) match.duration.$gte = durationMin;
      if (durationMax !== undefined) match.duration.$lte = durationMax;
    }

    const sortStage =
      sort === 'rating'
        ? { 'rating.avg': -1, createdAt: -1 }
        : sort === 'popular'
        ? { 'stats.enrollCount': -1, createdAt: -1 }
        : { createdAt: -1 };

    const pipeline = [
      { $match: match },
      {
        $lookup: {
          from: 'ratings',
          localField: '_id',
          foreignField: 'courseId',
          as: 'ratingDocs'
        }
      },
      {
        $lookup: {
          from: 'enrollments',
          localField: '_id',
          foreignField: 'courseId',
          as: 'enrollDocs'
        }
      },
      {
        $addFields: {
          rating: {
            avg: { $ifNull: [{ $avg: '$ratingDocs.rating' }, 0] },
            count: { $size: '$ratingDocs' }
          },
          stats: {
            enrollCount: { $size: '$enrollDocs' }
          }
        }
      },
      { $project: { ratingDocs: 0, enrollDocs: 0 } },
      { $sort: sortStage },
      { $skip: skip },
      { $limit: limit }
    ];

    const courses = await Course.aggregate(pipeline);
    return res.json({ courses, page, limit });
  } catch (err) {
    next(err);
  }
}

/* ========== Student features ========== */

// Enroll
export async function enrollInCourse(req, res, next) {
  try {
    const course = await Course.findById(req.params.id).lean();
    if (!course) return res.status(404).json({ error: 'Course not found' });
    if (course.status !== 'published') return res.status(400).json({ error: 'Course not published' });

    const doc = await Enrollment.findOneAndUpdate(
      { userId: req.user.id, courseId: course._id },
      { $setOnInsert: { userId: req.user.id, courseId: course._id, createdAt: new Date() } },
      { upsert: true, new: true }
    );
    return res.json({ ok: true, enrollmentId: doc._id });
  } catch (err) {
    next(err);
  }
}

export async function unenrollFromCourse(req, res, next) {
  try {
    const result = await Enrollment.deleteOne({ userId: req.user.id, courseId: req.params.id });
    await Progress.deleteOne({ userId: req.user.id, courseId: req.params.id });
    return res.json({ ok: true, deleted: result.deletedCount });
  } catch (err) {
    next(err);
  }
}

export async function myEnrollments(req, res, next) {
  try {
    const enrolls = await Enrollment.find({ userId: req.user.id }).lean();
    const courseIds = enrolls.map(e => e.courseId);
    const courses = await Course.find({ _id: { $in: courseIds } }).lean();
    return res.json({ courses });
  } catch (err) {
    next(err);
  }
}

// Progress gating + updates
export async function updateProgress(req, res, next) {
  try {
    const { lessonId, completed } = req.body; // completed:boolean
    if (!lessonId) return res.status(400).json({ error: 'lessonId required' });

    const course = await Course.findById(req.params.id).lean();
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const enroll = await Enrollment.findOne({ userId: req.user.id, courseId: course._id }).lean();
    if (!enroll) return res.status(403).json({ error: 'Enroll first' });

    const loc = findLessonIndex(course, lessonId); // { mi, li }
    if (!loc) return res.status(400).json({ error: 'Invalid lessonId' });

    // progress doc
    const prog = await Progress.findOne({ userId: req.user.id, courseId: course._id });
    const assignmentState = prog?.assignmentState || {}; // { [lessonId]: { submitted:true } }
    const quizState = prog?.quizState || {};             // { [moduleId]: { passed:true, ... } }

    // Gate 1: assignment must be submitted before marking complete
    const assign = assignmentState[String(lessonId)];
    if (completed === true && !(assign && assign.submitted === true)) {
      return res.status(400).json({ error: 'Submit assignment before marking lesson complete' });
    }

    // Gate 2: for modules after the first, previous module quiz must be passed.
    const moduleIndex = loc.mi; // use positional index, not `order`
    if (completed === true && moduleIndex > 0) {
      const prevModule = course.modules[moduleIndex - 1];
      const prevModuleId = String(prevModule?._id || '');
      const prevQuizRequired =
        Array.isArray(prevModule?.quiz?.questions) && prevModule.quiz.questions.length >= 1;
      const prevPassed = prevModuleId && quizState[prevModuleId]?.passed === true;

      if (prevQuizRequired && !prevPassed) {
        return res.status(400).json({ error: 'Pass previous module quiz to continue' });
      }
      // if no quiz in previous module, do not block
    }

    // update completion
    const allLessonIds = getAllLessonIds(course); // array of string ids
    const currentCompleted = new Set((prog?.completedLessonIds || []).map(String));
    if (completed === true) currentCompleted.add(String(lessonId));
    if (completed === false) currentCompleted.delete(String(lessonId));

    const percent =
      allLessonIds.length === 0 ? 0 : Math.round((currentCompleted.size / allLessonIds.length) * 100);

    const updated = await Progress.findOneAndUpdate(
      { userId: req.user.id, courseId: course._id },
      {
        $set: {
          completedLessonIds: Array.from(currentCompleted),
          assignmentState,
          quizState,
          percent,
          updatedAt: new Date()
        }
      },
      { upsert: true, new: true }
    );

    return res.json({ ok: true, progress: { percent: updated.percent, completedCount: currentCompleted.size } });
  } catch (err) {
    next(err);
  }
}

export async function getProgress(req, res, next) {
  try {
    const courseId = req.params.id;

    // allow teacher owner or admin to view any student's progress via ?userId=
    const viewingUserId = req.query.userId;
    if (viewingUserId && (req.user.role === 'admin' || req.user.role === 'teacher')) {
      const course = await Course.findById(courseId).lean();
      if (!course) return res.status(404).json({ error: 'Course not found' });
      if (req.user.role === 'teacher' && String(course.createdBy) !== req.user.id) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      const p = await Progress.findOne({ courseId, userId: viewingUserId }).lean();
      return res.json({ progress: p || null });
    }

    const prog = await Progress.findOne({ courseId, userId: req.user.id }).lean();
    return res.json({ progress: prog || null });
  } catch (err) {
    next(err);
  }
}

/* ========== Bookmarks, Ratings (unchanged) ========== */
export async function addBookmark(req, res, next) {
  try {
    const course = await Course.findById(req.params.id).lean();
    if (!course) return res.status(404).json({ error: 'Course not found' });
    if (course.status !== 'published') return res.status(400).json({ error: 'Only published courses can be bookmarked' });

    await Bookmark.findOneAndUpdate(
      { userId: req.user.id, courseId: course._id },
      { $setOnInsert: { userId: req.user.id, courseId: course._id, createdAt: new Date() } },
      { upsert: true }
    );
    return res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

export async function removeBookmark(req, res, next) {
  try {
    const result = await Bookmark.deleteOne({ userId: req.user.id, courseId: req.params.id });
    return res.json({ ok: true, deleted: result.deletedCount });
  } catch (err) {
    next(err);
  }
}

export async function myBookmarks(req, res, next) {
  try {
    const items = await Bookmark.find({ userId: req.user.id }).lean();
    const courseIds = items.map(b => b.courseId);
    const courses = await Course.find({ _id: { $in: courseIds }, status: 'published' }).lean();
    return res.json({ courses });
  } catch (err) {
    next(err);
  }
}

export async function rateCourse(req, res, next) {
  try {
    const { rating, review } = req.body;
    const r = Number(rating);
    if (!Number.isFinite(r) || r < 1 || r > 5) return res.status(400).json({ error: 'rating 1..5 required' });

    const course = await Course.findById(req.params.id).lean();
    if (!course) return res.status(404).json({ error: 'Course not found' });
    if (course.status !== 'published') return res.status(400).json({ error: 'Course not published' });

    const enroll = await Enrollment.findOne({ userId: req.user.id, courseId: course._id }).lean();
    if (!enroll) return res.status(403).json({ error: 'Enroll first' });

    const doc = await Rating.findOneAndUpdate(
      { userId: req.user.id, courseId: course._id },
      { rating: r, review: review || null, updatedAt: new Date(), $setOnInsert: { createdAt: new Date() } },
      { upsert: true, new: true }
    );

    return res.json({ ok: true, rating: { rating: doc.rating, review: doc.review } });
  } catch (err) {
    next(err);
  }
}

export async function listRatings(req, res, next) {
  try {
    const courseId = req.params.id;
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.min(100, parseInt(req.query.limit || '20', 10));
    const skip = (page - 1) * limit;

    const [items, summary] = await Promise.all([
      Rating.find({ courseId }).sort({ updatedAt: -1 }).skip(skip).limit(limit).populate('userId', 'name').lean(),
      Rating.aggregate([
        { $match: { courseId: new mongoose.Types.ObjectId(courseId) } },
        { $group: { _id: '$courseId', avg: { $avg: '$rating' }, count: { $sum: 1 } } }
      ])
    ]);

    const ratingSummary = summary[0] ? { average: Number(summary[0].avg.toFixed(2)), count: summary[0].count } : { average: 0, count: 0 };

    return res.json({ ratings: items, summary: ratingSummary, page, limit });
  } catch (err) {
    next(err);
  }
}

/* ========== Teacher views ========== */
export async function listEnrolledStudents(req, res) {
  const { id: courseId } = req.params;

  const course = await Course.findById(courseId).lean();
  if (!course) return res.status(404).json({ error: 'Course not found' });

  const callerId = String(req.user?.id || req.user?._id || '');
  const ownerCandidates = [
    course.teacherId,
    course.teacher,
    course.ownerId,
    course.createdBy,
    ...(Array.isArray(course.instructors) ? course.instructors : []),
  ]
  .map(v => {
    if (!v) return null;
    if (typeof v === 'string') return v;
    if (v._id) return String(v._id);
    try { return String(v); } catch { return null; }
  })
  .filter(Boolean);

  const isOwner = ownerCandidates.some(id => id === callerId);
  const isAdmin = req.user?.role === 'admin';

  if (!(isOwner || isAdmin)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const enrolls = await Enrollment.find({ courseId }).lean();
  const userIds = enrolls.map(e => e.userId);
  const progresses = await Progress.find({ courseId, userId: { $in: userIds } }).lean();
  const progMap = new Map(progresses.map(p => [String(p.userId), p]));

  const students = enrolls.map(e => ({
    userId: e.userId,
    enrolledAt: e.createdAt,
    progressPercent: progMap.get(String(e.userId))?.percent ?? 0,
    completedCount: progMap.get(String(e.userId))?.completedLessonIds?.length ?? 0,
  }));

  return res.json({ students });
}

/* ========== New: assignment + quiz endpoints ========== */

export async function submitAssignment(req, res, next) {
  try {
    const { id: courseId, lessonId } = req.params;
    const payload = req.body?.payload ?? {}; // optional, store as-is if needed

    const course = await Course.findById(courseId).lean();
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const enroll = await Enrollment.findOne({ userId: req.user.id, courseId }).lean();
    if (!enroll) return res.status(403).json({ error: 'Enroll first' });

    const loc = findLessonIndex(course, lessonId);
    if (!loc) return res.status(400).json({ error: 'Invalid lessonId' });

    // simple acceptance: mark as submitted
    const prog = await Progress.findOne({ userId: req.user.id, courseId }) || new Progress({ userId: req.user.id, courseId });
    const assignmentState = prog.assignmentState || {};
    assignmentState[String(lessonId)] = {
      submitted: true,
      graded: false,
      passed: true, // keep boolean for future rubric; true unblocks progress
      payload,
      submittedAt: new Date()
    };

    await Progress.updateOne(
      { userId: req.user.id, courseId },
      { $set: { assignmentState, updatedAt: new Date() } },
      { upsert: true }
    );

    return res.json({ ok: true, assignment: { lessonId, submitted: true } });
  } catch (err) {
    next(err);
  }
}

// controllers/courseController.js

// helper: get module by :moduleId param
function findModuleById(course, moduleId) {
  if (!course || !Array.isArray(course.modules)) return null;
  const id = String(moduleId);
  for (let i = 0; i < course.modules.length; i++) {
    const m = course.modules[i];
    if (String(m?._id) === id) {
      return { module: m, index: i };
    }
  }
  return null;
}

// helper: get canonical correct index from a question
function getCorrectIndex(q) {
  // support several shapes: answerIndex | correctIndex | correct | correct_option
  if (Number.isInteger(q?.answerIndex)) return q.answerIndex;
  if (Number.isInteger(q?.correctIndex)) return q.correctIndex;
  if (typeof q?.correct === 'number') return q.correct;
  if (typeof q?.correct_option === 'number') return q.correct_option;
  return null; // unknown -> treat as incorrect
}

// ---- FIXED: grade + persist quiz result ----
export async function attemptModuleQuiz(req, res, next) {
  try {
    const { id: courseId, moduleId } = req.params;
    let { answers } = req.body; // array of indexes or objects

    if (!Array.isArray(answers)) {
      return res.status(400).json({ error: 'answers array is required' });
    }

    const course = await Course.findById(courseId).lean();
    if (!course) return res.status(404).json({ error: 'Course not found' });

    // must be enrolled
    const enroll = await Enrollment.findOne({ userId: req.user.id, courseId: course._id }).lean();
    if (!enroll) return res.status(403).json({ error: 'Enroll first' });

    const modLoc = findModuleById(course, moduleId);
    if (!modLoc) return res.status(404).json({ error: 'Module not found' });
    const mod = modLoc.module;

    const questions = Array.isArray(mod?.quiz?.questions) ? mod.quiz.questions : [];
    if (questions.length === 0) {
      return res.status(400).json({ error: 'No quiz configured for this module' });
    }

    // normalize incoming answers to integers (index per question)
    // allow [2,1,3,...] or [{answerIndex:2}, {answerIndex:"1"} ...]
    const normAnswers = answers.map((a) => {
      if (a == null) return null;
      if (typeof a === 'number') return Number.isFinite(a) ? a : null;
      if (typeof a === 'string') {
        const n = parseInt(a, 10);
        return Number.isFinite(n) ? n : null;
      }
      if (typeof a === 'object') {
        const v =
          Number.isFinite(a.answerIndex) ? a.answerIndex :
          Number.isFinite(a.index) ? a.index :
          Number.isFinite(a.value) ? a.value :
          (typeof a.answerIndex === 'string' ? parseInt(a.answerIndex, 10) : null);
        return Number.isFinite(v) ? v : null;
      }
      return null;
    });

    // grade
    let correctCount = 0;
    const total = questions.length;

    for (let i = 0; i < total; i++) {
      const q = questions[i] || {};
      const correctIdx = getCorrectIndex(q);
      const userIdx = normAnswers[i];
      if (Number.isInteger(correctIdx) && Number.isInteger(userIdx) && userIdx === correctIdx) {
        correctCount++;
      }
    }

    const scorePercent = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const passNeeded = Number.isFinite(mod?.quiz?.passPercent) ? mod.quiz.passPercent : 75;
    const passed = scorePercent >= passNeeded;

    // persist quiz state on Progress
    const prog = await Progress.findOne({ userId: req.user.id, courseId: course._id });
    const quizState = prog?.quizState || {};
    const key = String(mod._id);
    const prev = quizState[key] || {};
    quizState[key] = {
      ...prev,
      attempts: (prev.attempts || 0) + 1,
      lastScore: scorePercent,
      passed,
      totalQuestions: total,
      correctCount,
      // store pass bar used
      passPercent: passNeeded,
      updatedAt: new Date(),
    };

    // keep other fields intact
    const updated = await Progress.findOneAndUpdate(
      { userId: req.user.id, courseId: course._id },
      {
        $set: {
          quizState,
          updatedAt: new Date(),
        }
      },
      { upsert: true, new: true }
    );

    return res.json({
      ok: true,
      passed,
      scorePercent,
      correctCount,
      total,
      attempts: quizState[key].attempts,
      passPercent: passNeeded,
    });
  } catch (err) {
    next(err);
  }
}


export async function getModuleStatus(req, res, next) {
  try {
    const { id: courseId, moduleId } = req.params;

    const course = await Course.findById(courseId).lean();
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const mod = (course.modules || []).find(m => String(m._id) === String(moduleId));
    if (!mod) return res.status(404).json({ error: 'Module not found' });

    const prog = await Progress.findOne({ userId: req.user.id, courseId }).lean();
    const quizState = prog?.quizState?.[String(moduleId)] || { attempts: 0, lastScore: null, passed: false };

    // lessons completion snapshot
    const lessonIds = (mod.lessons || []).map(l => String(l._id));
    const completedSet = new Set((prog?.completedLessonIds || []).map(String));
    const completedLessons = lessonIds.filter(id => completedSet.has(id));

    return res.json({
      module: { id: moduleId, title: mod.title, order: mod.order ?? 0 },
      quiz: quizState,
      lessons: { total: lessonIds.length, completed: completedLessons.length }
    });
  } catch (err) {
    next(err);
  }
}

// helper: flatten modules/lessons to find titles quickly
function indexCourseLessons(course) {
  const idx = new Map(); // lessonId -> { moduleTitle, moduleOrder, lessonTitle }
  (course.modules || []).forEach((m, mi) => {
    (m.lessons || []).forEach((l, li) => {
      if (!l?._id) return;
      idx.set(String(l._id), {
        moduleTitle: m.title || `Module ${mi+1}`,
        moduleOrder: m.order ?? mi,
        lessonTitle: l.title || `Lesson ${li+1}`,
      });
    });
  });
  return idx;
}

/**
 * GET /courses/:id/assignments/submissions
 * Returns all submitted assignments (any lesson) for this course,
 * with optional grading info if already graded.
 */
export async function listAssignmentSubmissions(req, res) {
  const { id: courseId } = req.params;

  const course = await Course.findById(courseId).lean();
  if (!course) return res.status(404).json({ error: 'Course not found' });

  // Same ownership rule as listEnrolledStudents
  const callerId = String(req.user?.id || req.user?._id || '');
  const ownerCandidates = [
    course.teacherId,
    course.teacher,
    course.ownerId,
    course.createdBy,
    ...(Array.isArray(course.instructors) ? course.instructors : []),
  ].map(v => (v?._id ? String(v._id) : (v ? String(v) : null))).filter(Boolean);

  const isOwner = ownerCandidates.some(id => id === callerId);
  const isAdmin = req.user?.role === 'admin';
  if (!(isOwner || isAdmin)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // Pull all progress docs that have any assignmentState
  const progresses = await Progress.find({ courseId }).lean();
  const lessonIdx = indexCourseLessons(course);

  // Build rows from submitted assignments
  const rows = [];
  for (const p of progresses) {
    const state = p.assignmentState || {};
    for (const [lessonId, a] of Object.entries(state)) {
      if (!a || a.submitted !== true) continue;
      const meta = lessonIdx.get(String(lessonId)) || {};
      rows.push({
        courseId,
        userId: String(p.userId),
        lessonId: String(lessonId),
        moduleTitle: meta.moduleTitle || null,
        lessonTitle: meta.lessonTitle || null,
        payload: a.payload || null,
        submittedAt: a.submittedAt || p.updatedAt || null,
        grade: typeof a.grade === 'number' ? a.grade : null,
        feedback: a.feedback || null,
        gradedAt: a.gradedAt || null,
      });
    }
  }

  // hydrate basic student info
  const userIds = Array.from(new Set(rows.map(r => r.userId)));
  const users = await User.find({ _id: { $in: userIds } }).select('name email').lean();
  const userMap = new Map(users.map(u => [String(u._id), { name: u.name, email: u.email }]));
  rows.forEach(r => { r.student = userMap.get(r.userId) || null; });

  return res.json({ submissions: rows });
}

/**
 * POST /courses/:id/lessons/:lessonId/assignment/grade
 * body: { userId, grade, feedback }
 */
export async function gradeAssignment(req, res) {
  const { id: courseId, lessonId } = req.params;
  const { userId, grade, feedback } = req.body || {};

  if (!userId) return res.status(400).json({ error: 'userId required' });

  const course = await Course.findById(courseId).lean();
  if (!course) return res.status(404).json({ error: 'Course not found' });

  // owner/admin check
  const callerId = String(req.user?.id || req.user?._id || '');
  const ownerCandidates = [
    course.teacherId,
    course.teacher,
    course.ownerId,
    course.createdBy,
    ...(Array.isArray(course.instructors) ? course.instructors : []),
  ].map(v => (v?._id ? String(v._id) : (v ? String(v) : null))).filter(Boolean);
  const isOwner = ownerCandidates.some(id => id === callerId);
  const isAdmin = req.user?.role === 'admin';
  if (!(isOwner || isAdmin)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // ensure the lesson exists in this course
  const lessonExists = (course.modules || []).some(m =>
    (m.lessons || []).some(l => String(l._id) === String(lessonId))
  );
  if (!lessonExists) return res.status(400).json({ error: 'Invalid lessonId for this course' });

  // find progress for that student
  const prog = await Progress.findOne({ courseId, userId }).exec();
  if (!prog) return res.status(404).json({ error: 'No progress found for this student' });

  const aState = prog.assignmentState || {};
  const entry = aState[String(lessonId)];
  if (!entry || entry.submitted !== true) {
    return res.status(400).json({ error: 'No submitted assignment to grade for this lesson' });
  }

  // apply grade
  const n = Number(grade);
  if (!Number.isFinite(n) || n < 0 || n > 100) {
    return res.status(400).json({ error: 'grade must be 0..100' });
  }

  aState[String(lessonId)] = {
    ...entry,
    grade: Math.round(n),
    feedback: feedback || entry.feedback || null,
    gradedAt: new Date(),
    gradedBy: req.user.id,
  };

  prog.assignmentState = aState;
  await prog.save();

  return res.json({
    ok: true,
    updated: {
      userId,
      lessonId: String(lessonId),
      grade: aState[String(lessonId)].grade,
      feedback: aState[String(lessonId)].feedback,
      gradedAt: aState[String(lessonId)].gradedAt,
    },
  });
}
