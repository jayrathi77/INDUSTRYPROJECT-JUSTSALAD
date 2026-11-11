import mongoose, { Schema } from 'mongoose';
const subscriptionPlanSchema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, required: true, trim: true, maxlength: 1000 },
  duration: { type: String, required: true, trim: true, maxlength: 80 },
  price: { type: Number, min: 0, default: null },
  benefits: { type: [String], default: [], validate: (items: string[]) => items.length <= 12 },
  active: { type: Boolean, default: true }
}, { timestamps: true });
export const SubscriptionPlan = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);
