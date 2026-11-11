import mongoose, { Schema } from 'mongoose';
const userSchema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  phone: { type: String, trim: true, maxlength: 30 }
}, { timestamps: true });
export const User = mongoose.model('User', userSchema);
