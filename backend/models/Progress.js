// backend/models/Progress.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const ProgressSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true, required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', index: true, required: true },

    // lessons
    completedLessonIds: { type: [Schema.Types.ObjectId], default: [] },
    percent: { type: Number, default: 0, min: 0, max: 100 },

    // gating state
    assignmentState: { type: Schema.Types.Mixed, default: {} }, // { [lessonId]: { submitted, graded, passed, payload, submittedAt } }
    quizState: { type: Schema.Types.Mixed, default: {} },       // { [moduleId]: { attempts, lastScore, passed, moduleOrder, updatedAt } }
  },
  { timestamps: true }
);

ProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export default mongoose.models.Progress || mongoose.model('Progress', ProgressSchema);
