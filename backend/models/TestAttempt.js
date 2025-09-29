// backend/models/TestAttempt.js
import mongoose from 'mongoose';

const AnswerSchema = new mongoose.Schema({
  qOrder: { type: Number, required: true },
  answerIndex: { type: Number, required: true }
}, { _id: false });

const PerQuestionSchema = new mongoose.Schema({
  qOrder: Number,
  correct: Boolean,
  points: Number,
  earned: Number
}, { _id: false });

const TestAttemptSchema = new mongoose.Schema({
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true, index: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

  startedAt: { type: Date, default: Date.now },
  submittedAt: { type: Date, default: null },
  durationSec: { type: Number, default: 0 },

  answers: [AnswerSchema],
  correctCount: { type: Number, default: 0 },
  totalPoints: { type: Number, default: 0 },
  earnedPoints: { type: Number, default: 0 },
  percent: { type: Number, default: 0 },

  perQuestion: [PerQuestionSchema]
}, { timestamps: true });

TestAttemptSchema.index({ testId: 1, userId: 1 }, { unique: true });

export default mongoose.model('TestAttempt', TestAttemptSchema);
