// backend/models/Enrollment.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const EnrollmentSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true }
  },
  { timestamps: true }
);

EnrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export default mongoose.models.Enrollment || mongoose.model('Enrollment', EnrollmentSchema);
