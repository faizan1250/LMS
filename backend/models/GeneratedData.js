// backend/models/GeneratedData.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const GeneratedDataSchema = new Schema({
  courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
  input: { type: Schema.Types.Mixed },
  rawOutput: { type: Schema.Types.Mixed },
  status: { type: String, enum: ['pending', 'done', 'failed'], default: 'pending' },
  error: { type: String },                 // general error message
  parseError: { type: String },            // JSON.parse error message if parse failed
  validationErrors: { type: Array, default: [] } // AJV errors array
}, { timestamps: true });

export default mongoose.models.GeneratedData || mongoose.model('GeneratedData', GeneratedDataSchema);
