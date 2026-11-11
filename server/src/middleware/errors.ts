import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
export function notFound(_req: Request, res: Response) { res.status(404).json({ error: 'Not found' }); }
export function errorHandler(error: Error & { status?: number; code?: number }, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof ZodError) return res.status(400).json({ error: 'Invalid request', details: error.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message })) });
  if (error.code === 11000) return res.status(409).json({ error: 'A record with that value already exists' });
  const status = error.status || (error.name === 'ValidationError' || error.name === 'CastError' ? 400 : 500);
  if (status >= 500) console.error(error);
  res.status(status).json({ error: status >= 500 ? 'Internal server error' : error.message });
}
