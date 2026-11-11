import mongoose, { Schema } from 'mongoose';
const corporateEnquirySchema = new Schema({
  contactName: { type: String, required: true, trim: true, maxlength: 100 },
  company: { type: String, required: true, trim: true, maxlength: 150 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
  phone: { type: String, required: true, trim: true, maxlength: 30 },
  people: { type: Number, required: true, min: 1, max: 10000 },
  frequency: { type: String, required: true, maxlength: 50 },
  notes: { type: String, trim: true, maxlength: 3000, default: '' },
  status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' }
}, { timestamps: true });
export const CorporateEnquiry = mongoose.model('CorporateEnquiry', corporateEnquirySchema);
