// backend/models/Test.js
import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  order: { type: Number, default: 0 },
  text: { type: String, required: true },
  options: [{ type: String, required: true }],
  answerIndex: { type: Number, required: true, min: 0 },
  points: { type: Number, default: 1 }
}, { _id: false });

const TestSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

  description: { type: String, default: '' },
  difficulty: { type: String, enum: ['easy','medium','hard'], default: 'medium' },
  type: { type: String, enum: ['quiz','weekly','final'], default: 'quiz' },
  numQuestions: { type: Number, default: 10, min: 1, max: 100 },

  startAt: { type: Date, default: null },
  dueAt: { type: Date, default: null },
  durationMins: { type: Number, default: 30 },

  status: { type: String, enum: ['draft','generating','ready','published','failed'], default: 'draft', index: true },
  questions: [QuestionSchema],

  // AI generation trace
  ai: {
    rawOutput: { type: mongoose.Schema.Types.Mixed, default: null },
    parseError: { type: String, default: null },
    validationErrors: { type: Array, default: [] },
    startedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null }
  }
}, { timestamps: true });

export default mongoose.model('Test', TestSchema);
