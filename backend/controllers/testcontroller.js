// backend/controllers/testController.js
import Test from '../models/Test.js';
import TestAttempt from '../models/TestAttempt.js';
import Course from '../models/Course.js';
import { generateTestContent } from '../services/testAiService.js';

// TEACHER: create + kick off AI
export async function createTest(req, res, next) {
  try {
    const { title, courseId, description, difficulty='medium', type='quiz', numQuestions=10, startAt=null, dueAt=null, durationMins=30 } = req.body;

    if (!title || !courseId) return res.status(400).json({ error: 'title and courseId required' });
    const course = await Course.findById(courseId).lean();
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const test = await Test.create({
      title: title.trim(),
      courseId,
      createdBy: req.user.id,
      description: description || '',
      difficulty,
      type,
      numQuestions: Math.max(1, Math.min(Number(numQuestions)||10, 100)),
      startAt, dueAt,
      durationMins: Math.max(5, Math.min(Number(durationMins)||30, 600)),
      status: 'generating',
      ai: { startedAt: new Date() }
    });

    // async AI generation
    setImmediate(async () => {
      try {
        const ai = await generateTestContent({
          title: test.title,
          courseTitle: course.title,
          description: test.description,
          difficulty: test.difficulty,
          type: test.type,
          numQuestions: test.numQuestions
        });
        if (ai.ok) {
          await Test.findByIdAndUpdate(test._id, {
            $set: {
              questions: ai.questions,
              status: 'ready',
              ai: { rawOutput: ai.rawOutput, completedAt: new Date(), parseError: null, validationErrors: [] }
            }
          });
        } else {
          await Test.findByIdAndUpdate(test._id, {
            $set: {
              status: 'failed',
              ai: { rawOutput: ai.rawOutput ?? null, completedAt: new Date(), parseError: ai.parseError ?? null, validationErrors: ai.validationErrors ?? [] }
            }
          });
        }
      } catch (e) {
        await Test.findByIdAndUpdate(test._id, { $set: { status: 'failed', ai: { parseError: e.message, completedAt: new Date() } } });
      }
    });

    return res.status(201).json({ testId: test._id, status: test.status });
  } catch (e) { next(e); }
}

// TEACHER: list tests
export async function listTests(req, res, next) {
  try {
    const { mine, courseId, status } = req.query;
    const q = {};
    if (mine) q.createdBy = req.user.id;
    if (courseId) q.courseId = courseId;
    if (status) q.status = status;
    const rows = await Test.find(q).sort({ createdAt: -1 }).lean();
    res.json({ tests: rows });
  } catch (e) { next(e); }
}

// TEACHER: get single
export async function getTest(req, res, next) {
  try {
    const test = await Test.findById(req.params.id).lean();
    if (!test) return res.status(404).json({ error: 'Not found' });
    res.json({ test });
  } catch (e) { next(e); }
}

// TEACHER: update (edit questions/metadata while draft/ready)
export async function updateTest(req, res, next) {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) return res.status(404).json({ error: 'Not found' });
    if (!['draft','ready','failed'].includes(test.status))
      return res.status(400).json({ error: 'Cannot edit after publish' });

    const patch = (({ title, description, difficulty, type, startAt, dueAt, durationMins, questions }) =>
      ({ title, description, difficulty, type, startAt, dueAt, durationMins, questions }))(req.body);

    Object.keys(patch).forEach(k => patch[k] === undefined && delete patch[k]);

    const updated = await Test.findByIdAndUpdate(test._id, { $set: patch }, { new: true }).lean();
    res.json({ test: updated });
  } catch (e) { next(e); }
}

// TEACHER: publish
export async function publishTest(req, res, next) {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) return res.status(404).json({ error: 'Not found' });
    if (!['ready','draft'].includes(test.status))
      return res.status(400).json({ error: 'Only ready/draft can be published' });
    if (!test.questions?.length) return res.status(400).json({ error: 'No questions' });

    test.status = 'published';
    await test.save();
    res.json({ ok: true, status: test.status });
  } catch (e) { next(e); }
}

// TEACHER: stats & leaderboard
export async function testStats(req, res, next) {
  try {
    const testId = req.params.id;
    const rows = await TestAttempt.find({ testId }).lean();
    const attempted = rows.length;
    const avg = attempted ? Math.round(rows.reduce((s, r) => s + (r.percent || 0), 0) / attempted) : 0;
    res.json({ attempted, averagePercent: avg });
  } catch (e) { next(e); }
}

export async function leaderboard(req, res, next) {
  try {
    const testId = req.params.id;
    const rows = await TestAttempt.find({ testId }).populate('userId','name email').sort({ percent: -1, submittedAt: 1 }).limit(100).lean();
    res.json({ leaderboard: rows.map(r => ({
      user: r.userId, percent: r.percent, correct: r.correctCount, earned: r.earnedPoints, total: r.totalPoints, submittedAt: r.submittedAt
    })) });
  } catch (e) { next(e); }
}

// STUDENT: list published tests for a course
export async function listCoursePublished(req, res, next) {
  try {
    const { courseId } = req.params;
    const now = new Date();
    const rows = await Test.find({
      courseId,
      status: 'published',
      $or: [{ startAt: null }, { startAt: { $lte: now } }]
    }).sort({ startAt: 1, dueAt: 1 }).lean();
    res.json({ tests: rows });
  } catch (e) { next(e); }
}

// STUDENT: get test (basic)
export async function getPublishedTest(req, res, next) {
  try {
    const t = await Test.findById(req.params.id).lean();
    if (!t || t.status !== 'published') return res.status(404).json({ error: 'Not available' });
    res.json({ test: t });
  } catch (e) { next(e); }
}

// STUDENT: start or submit attempt (single upsert)
export async function submitAttempt(req, res, next) {
  try {
    const test = await Test.findById(req.params.id).lean();
    if (!test || test.status !== 'published') return res.status(404).json({ error: 'Test not available' });

    const { answers } = req.body; // [{qOrder, answerIndex}]
    if (!Array.isArray(answers)) return res.status(400).json({ error: 'answers array required' });

    // evaluate
    const byOrder = new Map(test.questions.map(q => [q.order, q]));
    let correct = 0, totalPoints = 0, earned = 0;
    const perQuestion = answers.map(a => {
      const q = byOrder.get(a.qOrder);
      if (!q) return { qOrder: a.qOrder, correct: false, points: 0, earned: 0 };
      const ok = Number(a.answerIndex) === Number(q.answerIndex);
      totalPoints += q.points || 1;
      if (ok) { correct += 1; earned += (q.points || 1); }
      return { qOrder: q.order, correct: ok, points: q.points || 1, earned: ok ? (q.points || 1) : 0 };
    });
    const percent = totalPoints ? Math.round((earned / totalPoints) * 100) : 0;

    const up = await TestAttempt.findOneAndUpdate(
      { testId: test._id, userId: req.user.id },
      {
        $set: {
          courseId: test.courseId,
          answers,
          submittedAt: new Date(),
          durationSec: 0,
          correctCount: correct,
          totalPoints,
          earnedPoints: earned,
          percent,
          perQuestion
        },
        $setOnInsert: { startedAt: new Date() }
      },
      { new: true, upsert: true }
    );

    res.json({ ok: true, attempt: { percent, correctCount: correct, totalPoints, earnedPoints: earned, perQuestion } });
  } catch (e) { next(e); }
}

// STUDENT: get my attempts for a test
export async function getMyAttempt(req, res, next) {
  try {
    const testId = req.params.id;
    const attempt = await TestAttempt.findOne({ testId, userId: req.user.id }).lean();
    res.json({ attempt });
  } catch (e) { next(e); }
}

// TEACHER: submissions table
export async function listSubmissions(req, res, next) {
  try {
    const testId = req.params.id;
    const rows = await TestAttempt.find({ testId }).populate('userId','name email').sort({ submittedAt: -1 }).lean();
    res.json({ submissions: rows });
  } catch (e) { next(e); }
}
export async function listTestsByCourse(req, res, next) {
  try {
    const { courseId } = req.params;
    const { publishedOnly } = req.query;

    const query = { courseId };
    if (String(publishedOnly) === 'true') query.status = 'published';

    const tests = await Test.find(query).sort({ dueAt: 1, createdAt: -1 }).lean();
    return res.json({ tests });
  } catch (err) {
    next(err);
  }
}