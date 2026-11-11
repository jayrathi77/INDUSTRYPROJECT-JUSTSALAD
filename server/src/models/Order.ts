import mongoose, { Schema } from 'mongoose';
const orderSchema = new Schema({
  customer: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  items: [{ product: { type: Schema.Types.ObjectId, ref: 'Product' }, productId: String, name: String, category: String, quantity: { type: Number, min: 1 }, unitPrice: Number, options: { type: Schema.Types.Mixed, default: {} } }],
  subtotal: { type: Number, required: true }, deliveryFee: { type: Number, default: 0 }, tax: { type: Number, default: 0 }, total: { type: Number, required: true },
  currency: { type: String, default: 'INR' }, paymentStatus: { type: String, enum: ['pending', 'authorized', 'paid', 'failed', 'refunded'], default: 'pending' },
  status: { type: String, enum: ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'], default: 'pending' },
  fulfilmentMethod: { type: String, enum: ['pickup', 'delivery'], required: true }, address: { type: Schema.Types.Mixed }, externalOrderReference: String
}, { timestamps: true });
export const Order = mongoose.model('Order', orderSchema);
