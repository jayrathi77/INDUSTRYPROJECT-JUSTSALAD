import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { User } from '../models/User.js';
import { config } from '../config/env.js';
import { requireAuth, type AuthRequest } from '../middleware/auth.js';
export const authRouter = Router();
const registerSchema = z.object({ name: z.string().trim().min(1).max(100), email: z.string().email().max(250), password: z.string().min(10).max(128), phone: z.string().max(30).optional() });
const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1).max(128) });
function setSession(res: import('express').Response, user: { id: string; role: string }) {
  const token = jwt.sign(user, config.jwtSecret, { expiresIn: '2h' });
  res.cookie('session', token, { httpOnly: true, secure: config.cookieSecure, sameSite: 'lax', maxAge: 2 * 60 * 60 * 1000, path: '/' });
}
authRouter.post('/register', async (req, res, next) => {
  try { const input = registerSchema.parse(req.body); const email = input.email.toLowerCase(); if (await User.exists({ email })) return res.status(409).json({ error: 'An account with this email already exists' });
    const user = await User.create({ name: input.name, email, phone: input.phone, passwordHash: await bcrypt.hash(input.password, 12), role: 'customer' });
    setSession(res, { id: user.id, role: user.role }); res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (e) { next(e); }
});
authRouter.post('/login', async (req, res, next) => {
  try { const input = loginSchema.parse(req.body); const user = await User.findOne({ email: input.email.toLowerCase() }).select('+passwordHash');
    if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) return res.status(401).json({ error: 'Email or password is incorrect' });
    setSession(res, { id: user.id, role: user.role }); res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (e) { next(e); }
});
authRouter.post('/logout', (_req, res) => { res.clearCookie('session', { httpOnly: true, secure: config.cookieSecure, sameSite: 'lax', path: '/' }); res.status(204).end(); });
authRouter.get('/me', requireAuth, async (req: AuthRequest, res, next) => { try { const user = await User.findById(req.user!.id).select('name email role phone'); if (!user) return res.status(404).json({ error: 'User not found' }); res.json(user); } catch (e) { next(e); } });
authRouter.patch('/me', requireAuth, async (req: AuthRequest, res, next) => { try { const input = z.object({ name: z.string().trim().min(1).max(100).optional(), phone: z.string().max(30).optional() }).parse(req.body); const user = await User.findByIdAndUpdate(req.user!.id, input, { new: true, runValidators: true }).select('name email role phone'); res.json(user); } catch (e) { next(e); } });
