// backend/models/Bookmark.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const BookmarkSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true }
  },
  { timestamps: true }
);

BookmarkSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export default mongoose.models.Bookmark || mongoose.model('Bookmark', BookmarkSchema);
