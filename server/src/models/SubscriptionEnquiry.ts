import mongoose, { Schema } from 'mongoose';
const subscriptionEnquirySchema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
  phone: { type: String, required: true, trim: true, maxlength: 30 },
  plan: { type: String, trim: true, maxlength: 100, default: '' },
  notes: { type: String, trim: true, maxlength: 2000, default: '' },
  status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' }
}, { timestamps: true });
export const SubscriptionEnquiry = mongoose.model('SubscriptionEnquiry', subscriptionEnquirySchema);
