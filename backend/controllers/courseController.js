// backend/controllers/courseController.js
import Course from '../models/Course.js';
import GeneratedData from '../models/GeneratedData.js';
import mongoose from 'mongoose';
import { callAIGenerate } from '../services/aiService.js';

/**
 * Internal helper: generate course content from AI and persist results.
 * Fire-and-forget from the route handler (we do NOT await this there).
 */
async function generateAndPopulateCourse({ courseId, genId, input }) {
  let genRecord = null;
  try {
    genRecord = await GeneratedData.findById(genId);
    if (!genRecord) {
      throw new Error('GeneratedData record not found');
    }

    genRecord.status = 'pending';
    await genRecord.save();

    // call the ai service (it returns structured result)
    let result;
    try {
      result = await callAIGenerate({
        title: input.title,
        audience: input.audience,
        duration: input.duration,
        format: input.format
      });
    } catch (aiErr) {
      // model/network error: record and return (do not throw)
      console.error('[generateAndPopulateCourse] AI call failed (network/model):', aiErr);
      genRecord.status = 'failed';
      // persist any rawText the AI layer attached (stringify if necessary)
      if (typeof aiErr?.rawText !== 'undefined' && aiErr.rawText !== null) {
        genRecord.rawOutput = typeof aiErr.rawText === 'string' ? aiErr.rawText : JSON.stringify(aiErr.rawText);
      } else {
        genRecord.rawOutput = genRecord.rawOutput || null;
      }
      genRecord.error = aiErr.message || 'ai_call_failed';
      await genRecord.save().catch(() => {});
      return;
    }

    // Log the whole result for debugging (trim long strings if needed)
    console.info('[generateAndPopulateCourse] AI result:', {
      success: !!result?.success,
      hasRawText: typeof result?.rawText !== 'undefined' && result.rawText !== null,
      parseError: result?.parseError || null,
      validationErrorsCount: Array.isArray(result?.validationErrors) ? result.validationErrors.length : 0
    });

    // persist rawOutput even if non-string (stringify) so UI can show something
    if (typeof result?.rawText !== 'undefined' && result.rawText !== null) {
      genRecord.rawOutput = typeof result.rawText === 'string' ? result.rawText : JSON.stringify(result.rawText);
    } else {
      genRecord.rawOutput = genRecord.rawOutput || null;
    }

    if (!result.success) {
      // classification of failure reason
      genRecord.status = 'failed';
      if (Array.isArray(result.validationErrors) && result.validationErrors.length > 0) {
        genRecord.validationErrors = result.validationErrors;
        genRecord.error = genRecord.error || 'validation_failed';
      }
      if (result.parseError) {
        genRecord.parseError = result.parseError;
        genRecord.error = genRecord.error ? `${genRecord.error};parse_failed` : 'parse_failed';
      }
      if (!result.rawText) {
        genRecord.error = genRecord.error || 'no_model_output';
      }
      await genRecord.save();
      return;
    }

    // success: write parsed content into course
    const aiOutput = result.parsed;

    genRecord.status = 'done';
    genRecord.validationErrors = [];
    genRecord.parseError = undefined;
    genRecord.error = undefined;
    await genRecord.save();

    // Map AI output structure into Course document
    const course = await Course.findById(courseId);
    if (!course) throw new Error('Course not found');

    course.modules = (aiOutput.modules || []).map((m, mi) => ({
      title: m.title || '',
      order: typeof m.order === 'number' ? m.order : mi,
      lessons: (m.lessons || []).map((l, li) => ({
        title: l.title || '',
        content: l.content || '',
        order: typeof l.order === 'number' ? l.order : li
      }))
    }));

    course.assessments = (aiOutput.assessments || []).map((a, ai) => ({
      type: a.type || 'quiz',
      data: a.data || {},
      order: typeof a.order === 'number' ? a.order : ai
    }));

    course.description = aiOutput.description || course.description;
    course.aiGenerated = true;

    await course.save();
    return;
  } catch (err) {
    // try to record the error to GeneratedData if possible
    try {
      if (genRecord) {
        genRecord.status = genRecord.status === 'done' ? genRecord.status : 'failed';
        genRecord.error = genRecord.error || (err.message || 'unknown error');
        // also attach parse/rawText if present on the thrown error object
        if (!genRecord.rawOutput && (typeof err?.rawText !== 'undefined' && err.rawText !== null)) {
          genRecord.rawOutput = typeof err.rawText === 'string' ? err.rawText : JSON.stringify(err.rawText);
        }
        await genRecord.save().catch(() => {});
      }
    } catch (e) {
      console.error('Failed to update GeneratedData after generation error', e);
    }
    console.error('generateAndPopulateCourse error:', err);
  }
}


/* ========== Controller exports ========== */

// Create course: create draft + generate in background (no Redis)
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
      aiGenerated: false
    });

    const genRecord = await GeneratedData.create({
      courseId: course._id,
      input: { title: course.title, audience, duration, format },
      rawOutput: null,
      status: 'pending',
      validationErrors: []
    });

    // background generation
    setImmediate(() => {
      generateAndPopulateCourse({
        courseId: course._id.toString(),
        genId: genRecord._id.toString(),
        input: { title: course.title, audience, duration, format }
      });
    });

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

    const course = await Course.findById(req.params.id).populate('createdBy', 'name email');

    if (!course) return res.status(404).json({ error: 'Course not found' });

    // teacher: only their own drafts/courses
    if (req.user.role === 'teacher' && course.createdBy._id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // student: only published courses (simple policy; extend with enrollment later)
    if (req.user.role === 'student' && course.status !== 'published') {
      return res.status(403).json({ error: 'Forbidden: course not published' });
    }

    // fetch the latest GeneratedData for this course (most recent)
    const gen = await GeneratedData.findOne({ courseId: course._id }).sort({ createdAt: -1 }).lean();

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
        : null
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/courses/:id
 * - Owner (teacher) or admin only.
 * - If modules/assessments are edited, mark aiGenerated=false to show manual edit.
 */
export async function updateCourse(req, res, next) {
  try {
    const payload = req.body;
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    // only owner or admin
    if (course.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const updatable = ['title', 'description', 'modules', 'assessments', 'status'];
    let touchedModulesOrAssessments = false;

    for (const k of updatable) {
      if (payload[k] !== undefined) {
        // simple validation: modules/assessments must be arrays if provided
        if (k === 'modules') {
          if (!Array.isArray(payload.modules)) {
            return res.status(400).json({ error: 'modules must be an array' });
          }
          touchedModulesOrAssessments = true;
          course.modules = payload.modules;
        } else if (k === 'assessments') {
          if (!Array.isArray(payload.assessments)) {
            return res.status(400).json({ error: 'assessments must be an array' });
          }
          touchedModulesOrAssessments = true;
          course.assessments = payload.assessments;
        } else if (k === 'status') {
          // only allow switching status to 'draft' here; publishing should use the /publish endpoint
          if (payload.status && payload.status !== 'draft' && payload.status !== 'published') {
            return res.status(400).json({ error: 'invalid status value' });
          }
          course.status = payload.status;
        } else {
          course[k] = payload[k];
        }
      }
    }

    // if teacher/admin edits modules/assessments, we consider the course manually edited
    if (touchedModulesOrAssessments) {
      course.aiGenerated = false;
    }

    await course.save();
    res.json({ ok: true, course });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/courses/:id/publish
 * - Owner (teacher) or admin only.
 * - Validate there's at least one module with at least one lesson.
 */
export async function publishCourse(req, res, next) {
  try {
    const courseId = req.params.id;
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const course = await Course.findById(courseId).exec();
    if (!course) return res.status(404).json({ error: 'Course not found' });

    // Make createdBy string for safe equality checks
    const ownerId = course.createdBy ? course.createdBy.toString() : null;
    const currentUserId = req.user.id ? req.user.id.toString() : null;
    const userRole = req.user.role || 'unknown';

    // Debug hint in logs (remove in prod)
    console.info('[publishCourse] user=', { id: currentUserId, role: userRole }, 'owner=', ownerId, 'courseId=', courseId);

    // Permission logic:
    // - admin can publish anything
    // - teacher can publish only their own courses
    if (userRole === 'admin') {
      // allowed
    } else if (userRole === 'teacher') {
      if (!ownerId || ownerId !== currentUserId) {
        return res.status(403).json({
          error: 'Forbidden: teachers may only publish courses they created',
          details: { attemptedBy: currentUserId, owner: ownerId }
        });
      }
    } else {
      return res.status(403).json({ error: 'Forbidden: only teachers or admins may publish courses' });
    }

    // Validation: ensure course has modules & lessons before publishing
    if (!Array.isArray(course.modules) || course.modules.length === 0) {
      return res.status(400).json({ error: 'Cannot publish an empty course. Add modules & lessons.' });
    }

    course.status = 'published';
    await course.save();

    return res.json({ ok: true, course });
  } catch (err) {
    console.error('[publishCourse] error', err);
    next(err);
  }
}

/**
 * DELETE /api/courses/:id
 * - Owner (teacher) or admin only.
 * - Also delete GeneratedData rows related to this course for cleanup.
 */
export async function deleteCourse(req, res, next) {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    // owner or admin only
    if (course.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Remove related GeneratedData records (best-effort)
    try {
      await GeneratedData.deleteMany({ courseId: course._id });
    } catch (e) {
      console.error('Failed to delete GeneratedData for course', course._id.toString(), e);
    }

    // delete the course document (document.deleteOne is supported)
    try {
      await course.deleteOne(); // <- use deleteOne instead of remove()
    } catch (e) {
      // fallback to model-level deletion if document-level fails for some reason
      console.warn('document.deleteOne failed, falling back to model.deleteOne', e);
      await Course.deleteOne({ _id: course._id });
    }

    return res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

function parseBool(val) {
  if (typeof val === 'boolean') return val;
  if (!val) return false;
  return String(val).toLowerCase() === 'true' || String(val) === '1';
}

export async function listCourses(req, res, next) {
  try {
  
    
    const mine = parseBool(req.query.mine);

    // quick pagination (optional)
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.min(100, parseInt(req.query.limit || '20', 10));
    const skip = (page - 1) * limit;

    if (mine) {
     
      
      if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      // make sure id is a string or objectid — mongoose accepts strings, but be explicit
const ownerId = req.user.id;

      const courses = await Course.find({ createdBy: ownerId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
        console.log(courses);
        

      return res.json({ courses, page, limit });
    }
   
    
    // public listing: published courses
    const courses = await Course.find({ status: 'published' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
   
      
    return res.json({ courses, page, limit });
  } catch (err) {
    next(err);
  }
}