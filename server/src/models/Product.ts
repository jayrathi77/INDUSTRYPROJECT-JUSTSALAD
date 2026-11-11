import mongoose, { Schema } from 'mongoose';
const productSchema = new Schema({
  sourceId: { type: String, required: true, unique: true, index: true },
  source: { type: String, enum: ['pdf-menu', 'admin'], default: 'pdf-menu' },
  name: { type: String, required: true, trim: true }, description: { type: String, required: true }, category: { type: String, required: true },
  price: { type: Number, min: 0, default: null }, image: { type: String, default: '/images/menu-placeholder.svg' }, availability: { type: Boolean, default: true },
  options: { type: [Schema.Types.Mixed], default: [] }, nutrition: { type: Schema.Types.Mixed }, ambiguity: String
}, { timestamps: true });
export const Product = mongoose.model('Product', productSchema);
