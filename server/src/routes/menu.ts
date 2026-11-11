import { Router } from 'express';
import { menu, categories } from '../data/menu.js';
import mongoose from 'mongoose';
import { Product } from '../models/Product.js';
export const menuRouter = Router();
menuRouter.get('/categories', async (_req, res, next) => { try { const stored = mongoose.connection.readyState === 1 ? await Product.distinct('category') : []; res.json({ categories: [...new Set([...categories, ...stored])] }); } catch (e) { next(e); } });
menuRouter.get('/', async (req, res, next) => {
  try {
  const category = typeof req.query.category === 'string' ? req.query.category : '';
  const q = typeof req.query.q === 'string' ? req.query.q.toLowerCase() : '';
  const stored = mongoose.connection.readyState === 1 ? await Product.find().sort({ category: 1, name: 1 }).lean() : [];
  const storedById = new Map(stored.map((item) => [item.sourceId, item]));
  const pdfItems = menu.map((item) => { const record = storedById.get(item.id); return record ? { ...item, ...record, id: item.id, availability: record.availability } : { ...item, availability: item.price !== null }; });
  const customItems = stored.filter((item) => item.source !== 'pdf-menu').map((item) => ({ ...item, id: item.sourceId }));
  const sourceItems = [...pdfItems, ...customItems];
  const results = sourceItems.filter((item) => (!category || item.category === category) && (!q || `${item.name} ${item.description}`.toLowerCase().includes(q)));
  res.json({ items: results, source: 'supplied-pdf', count: results.length });
  } catch (e) { next(e); }
});
menuRouter.get('/:id', async (req, res, next) => { try { if (mongoose.connection.readyState === 1) { const item = await Product.findOne({ sourceId: req.params.id }); if (item) return res.json({ ...item.toObject(), id: item.sourceId }); } const item = menu.find((p) => p.id === req.params.id); item ? res.json({ ...item, availability: item.price !== null }) : res.status(404).json({ error: 'Menu item not found' }); } catch (e) { next(e); } });
