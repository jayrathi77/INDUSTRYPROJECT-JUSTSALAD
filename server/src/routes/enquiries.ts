import { Router } from 'express';
import { z } from 'zod';
import { CorporateEnquiry } from '../models/CorporateEnquiry.js';
import { SubscriptionEnquiry } from '../models/SubscriptionEnquiry.js';
export const enquiryRouter = Router();
const inputSchema = z.object({
  contactName: z.string().trim().min(2).max(100),
  company: z.string().trim().min(2).max(150),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(7).max(30),
  people: z.coerce.number().int().min(1).max(10000),
  frequency: z.enum(['One-time', 'Weekly', 'Multiple times per week', 'Monthly', 'To be discussed']),
  notes: z.string().trim().max(3000).optional().default('')
});
enquiryRouter.post('/corporate', async (req, res, next) => {
  try {
    const input = inputSchema.parse(req.body);
    if (!process.env.MONGODB_URI) return res.status(503).json({ error: 'Enquiry service is unavailable until the database is configured. Please contact us directly.' });
    const enquiry = await CorporateEnquiry.create(input);
    res.status(201).json({ id: enquiry.id, message: 'Enquiry received' });
  } catch (error) { next(error); }
});
const subscriptionSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(7).max(30),
  plan: z.string().trim().max(100).optional().default(''),
  notes: z.string().trim().max(2000).optional().default('')
});
enquiryRouter.post('/subscription', async (req, res, next) => {
  try {
    const input = subscriptionSchema.parse(req.body);
    if (!process.env.MONGODB_URI) return res.status(503).json({ error: 'Enquiry service is unavailable until the database is configured. Please contact us directly.' });
    const enquiry = await SubscriptionEnquiry.create(input);
    res.status(201).json({ id: enquiry.id, message: 'Enquiry received' });
  } catch (error) { next(error); }
});
