import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
export type AuthRequest = Request & { user?: { id: string; role: string } };
export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.session || req.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return res.status(401).json({ error: 'Authentication required' });
  try { req.user = jwt.verify(token, config.jwtSecret) as { id: string; role: string }; next(); }
  catch { return res.status(401).json({ error: 'Invalid or expired session' }); }
}
export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Administrator access required' });
  next();
}
