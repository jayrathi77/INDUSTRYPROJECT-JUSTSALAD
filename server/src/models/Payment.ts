import mongoose, { Schema } from 'mongoose';
const paymentSchema = new Schema({ order: { type: Schema.Types.ObjectId, ref: 'Order', required: true, index: true }, provider: { type: String, required: true }, transactionReference: String, amount: { type: Number, required: true }, currency: { type: String, default: 'INR' }, status: { type: String, enum: ['created', 'authorized', 'captured', 'failed', 'refunded'], default: 'created' }, webhookEventId: { type: String, unique: true, sparse: true } }, { timestamps: true });
export const Payment = mongoose.model('Payment', paymentSchema);
