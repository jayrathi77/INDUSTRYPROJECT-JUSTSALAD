import mongoose, { Schema } from 'mongoose';
const reviewSchema = new Schema({ customer: { type: Schema.Types.ObjectId, ref: 'User', required: true }, product: { type: Schema.Types.ObjectId, ref: 'Product' }, order: { type: Schema.Types.ObjectId, ref: 'Order' }, rating: { type: Number, min: 1, max: 5, required: true }, text: { type: String, maxlength: 2000 }, moderationStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' } }, { timestamps: true });
export const Review = mongoose.model('Review', reviewSchema);
