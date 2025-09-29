// backend/models/Course.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const ResourceLinkSchema = new Schema(
  {
    label: { type: String, default: '' },
    url: { type: String, required: true },
    source: { type: String, enum: ['wikipedia', 'web', 'other'], default: 'wikipedia' }
  },
  { _id: false }
);

const AssignmentSchema = new Schema(
  {
    title: { type: String, default: 'Assignment' },
    description: { type: String, default: '' },
    instructions: { type: String, default: '' },
    required: { type: Boolean, default: true }
  },
  { _id: false }
);

const LessonSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' }, // short summary
    content: { type: Schema.Types.Mixed, default: '' }, // long form
    resources: { type: [ResourceLinkSchema], default: [] }, // include Wikipedia links
    assignment: { type: AssignmentSchema, default: () => ({}) }, // every lesson has one
    order: { type: Number, default: 0 }
  },
  { _id: true }
);

const QuizOptionSchema = new Schema(
  {
    text: { type: String, required: true }
  },
  { _id: false }
);

const QuizQuestionSchema = new Schema(
  {
    prompt: { type: String, required: true },
    options: { type: [QuizOptionSchema], default: [] }, // 4–6 options typical
    correctIndex: { type: Number, required: true } // 0-based
  },
  { _id: false }
);

const ModuleQuizSchema = new Schema(
  {
    questions: { type: [QuizQuestionSchema], default: [] }, // must be ≥10 when publishing
    passPercent: { type: Number, default: 75 } // module completion threshold
  },
  { _id: false }
);

const ModuleSchema = new Schema(
  {
    title: { type: String, required: true },
    order: { type: Number, default: 0 },
    lessons: { type: [LessonSchema], default: [] },
    quiz: { type: ModuleQuizSchema, default: () => ({}) }
  },
  { _id: true }
);

const AssessmentSchema = new Schema(
  {
    type: { type: String, enum: ['quiz', 'project', 'assignment'], default: 'quiz' },
    data: { type: Schema.Types.Mixed, default: {} },
    order: { type: Number, default: 0 }
  },
  { _id: true }
);

const CourseSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    modules: { type: [ModuleSchema], default: [] },
    assessments: { type: [AssessmentSchema], default: [] },
    aiGenerated: { type: Boolean, default: false },
    audience: { type: String, default: null },
    format: { type: String, default: null },
    duration: { type: Number, default: null } // minutes/hours as you prefer
  },
  { timestamps: true }
);

export default mongoose.models.Course || mongoose.model('Course', CourseSchema);
