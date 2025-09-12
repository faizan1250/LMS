// backend/models/Course.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const LessonSchema = new Schema({
  title: { type: String, required: true },
  content: { type: Schema.Types.Mixed, default: '' },
  order: { type: Number, default: 0 }
}, { _id: true });

const ModuleSchema = new Schema({
  title: { type: String, required: true },
  order: { type: Number, default: 0 },
  lessons: [LessonSchema]
}, { _id: true });

const AssessmentSchema = new Schema({
  type: { type: String, enum: ['quiz', 'project', 'assignment'], default: 'quiz' },
  data: { type: Schema.Types.Mixed, default: {} },
  order: { type: Number, default: 0 }
}, { _id: true });

const CourseSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  modules: [ModuleSchema],
  assessments: [AssessmentSchema],
  aiGenerated: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models.Course || mongoose.model('Course', CourseSchema);
