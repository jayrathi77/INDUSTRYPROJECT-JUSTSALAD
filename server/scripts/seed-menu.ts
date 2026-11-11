import mongoose from 'mongoose';
import { config } from '../src/config/env.js';
import { Product } from '../src/models/Product.js';
import { menu } from '../src/data/menu.js';
if (!config.mongoUri) throw new Error('Set MONGODB_URI before seeding the PDF menu.');
await mongoose.connect(config.mongoUri);
try {
  const ops = menu.map((item) => {
    const fields: Record<string, unknown> = { sourceId: item.id, source: 'pdf-menu', name: item.name, description: item.description, category: item.category, price: item.price, image: '/images/menu-placeholder.svg', availability: item.price !== null, options: item.options || [] };
    if (item.nutrition) fields.nutrition = item.nutrition;
    if (item.ambiguity) fields.ambiguity = item.ambiguity;
    return { updateOne: { filter: { sourceId: item.id }, update: { $set: fields }, upsert: true } };
  });
  const result = await Product.bulkWrite(ops as never);
  console.log(`Seeded ${menu.length} PDF menu records. Matched ${result.matchedCount}, inserted ${result.upsertedCount}.`);
} finally { await mongoose.disconnect(); }
