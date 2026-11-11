import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, type AuthRequest } from '../middleware/auth.js';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { menu } from '../data/menu.js';
export const orderRouter = Router();
const createOrder = z.object({ fulfilmentMethod: z.enum(['delivery', 'pickup']), address: z.object({ line1: z.string().min(1), city: z.string().min(1), postalCode: z.string().min(1) }).optional(), items: z.array(z.object({ productId: z.string().min(1), quantity: z.number().int().min(1).max(50), options: z.record(z.string(), z.string()).optional() })).min(1).max(40) });
orderRouter.use(requireAuth);
orderRouter.post('/', async (req: AuthRequest, res, next) => {
  try {
    const input = createOrder.parse(req.body);
    if (input.fulfilmentMethod === 'delivery' && !input.address) return res.status(400).json({ error: 'A delivery address is required' });
    const ids = new Set(input.items.map((item) => item.productId));
    const dbProducts = await Product.find({ sourceId: { $in: [...ids] } });
    const dbMap = new Map(dbProducts.map((p) => [p.sourceId, p]));
    const priceMap = new Map(dbProducts.filter((p) => p.availability && p.price !== null && p.price !== undefined).map((p) => [p.sourceId, { name: p.name, category: p.category, price: p.price as number }]));
    for (const item of input.items) if (dbMap.has(item.productId) && !dbMap.get(item.productId)!.availability) return res.status(409).json({ error: `Item is currently unavailable: ${item.productId}` });
    for (const item of input.items) if (!priceMap.has(item.productId)) {
      if (dbMap.has(item.productId)) return res.status(409).json({ error: `Item has no confirmed price: ${item.productId}` });
      const source = menu.find((p) => p.id === item.productId);
      if (!source || source.price === null) return res.status(409).json({ error: `Item unavailable or has no confirmed price: ${item.productId}` });
      priceMap.set(item.productId, { name: source.name, category: source.category, price: source.price });
    }
    for (const item of input.items) {
      const source = menu.find((p) => p.id === item.productId);
      const storedProduct = dbMap.get(item.productId);
      const supported = (storedProduct?.options || source?.options || []) as { name: string; choices: string[] }[];
      const selected = item.options || {};
      if (Object.keys(selected).length !== supported.length || supported.some((option) => !option.choices.includes(selected[option.name]))) return res.status(400).json({ error: `Select valid options for ${priceMap.get(item.productId)?.name || item.productId}` });
    }
    const snapshots = input.items.map((item) => { const p = priceMap.get(item.productId)!; return { productId: item.productId, name: p.name, category: p.category, quantity: item.quantity, unitPrice: p.price, options: item.options || {} }; });
    const subtotal = snapshots.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    // Fees and taxes are intentionally zero until the restaurant supplies real configuration.
    const order = await Order.create({ customer: req.user!.id, items: snapshots, subtotal, deliveryFee: 0, tax: 0, total: subtotal, fulfilmentMethod: input.fulfilmentMethod, address: input.address });
    res.status(201).json({ order, payment: { enabled: false, reason: 'No payment provider is configured. This order is unpaid.' } });
  } catch (e) { next(e); }
});
orderRouter.get('/mine', async (req: AuthRequest, res, next) => { try { res.json(await Order.find({ customer: req.user!.id }).sort({ createdAt: -1 })); } catch (e) { next(e); } });
