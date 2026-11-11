import { Router } from 'express';
import { SubscriptionPlan } from '../models/SubscriptionPlan.js';
export const subscriptionRouter = Router();
subscriptionRouter.get('/plans', async (_req, res, next) => {
  try { res.json(await SubscriptionPlan.find({ active: true }).select('name description duration price benefits').sort({ createdAt: 1 }).lean()); }
  catch (error) { next(error); }
});
