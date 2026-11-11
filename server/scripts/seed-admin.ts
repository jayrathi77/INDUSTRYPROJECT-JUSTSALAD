import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from '../src/config/env.js';
import { User } from '../src/models/User.js';

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;
if (!config.mongoUri) throw new Error('Set MONGODB_URI before provisioning an administrator.');
if (!email || !password || password.length < 12) throw new Error('Set ADMIN_EMAIL and an ADMIN_PASSWORD of at least 12 characters.');
await mongoose.connect(config.mongoUri);
try {
  if (await User.exists({ email })) throw new Error('That account already exists. Admin provisioning only creates a new account; it never upgrades or resets an existing user.');
  const user = await User.create({ name: 'Just Salad Admin', email, passwordHash: await bcrypt.hash(password, 12), role: 'admin' });
  console.log(`Provisioned administrator ${user.email}. Remove ADMIN_PASSWORD from the environment after use.`);
} finally { await mongoose.disconnect(); }
