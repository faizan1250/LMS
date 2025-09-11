// backend/models/RefreshToken.js
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const RefreshTokenSchema = new Schema({
  token: { type: String, required: true, unique: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  expiresAt: { type: Date, required: true },
  createdByIp: { type: String },
  revokedAt: { type: Date },
  revokedByIp: { type: String },
  replacedByToken: { type: String }
}, { timestamps: true });

RefreshTokenSchema.virtual('isExpired').get(function () {
  return Date.now() >= this.expiresAt.getTime();
});

RefreshTokenSchema.virtual('isActive').get(function () {
  return !this.revokedAt && !this.isExpired;
});

export default model('RefreshToken', RefreshTokenSchema);
