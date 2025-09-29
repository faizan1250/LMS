// backend/models/Rating.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const RatingSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, default: null }
  },
  { timestamps: true }
);

RatingSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export default mongoose.models.Rating || mongoose.model('Rating', RatingSchema);
