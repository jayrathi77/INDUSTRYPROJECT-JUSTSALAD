import mongoose from 'mongoose';
import { app } from './app.js';
import { config } from './config/env.js';
async function main() {
  if (config.mongoUri) await mongoose.connect(config.mongoUri);
  else console.warn('MONGODB_URI is not set. Read-only PDF menu API is available; accounts, orders, and admin database operations require MongoDB.');
  const server = app.listen(config.port, () => console.log(`Just Salad API listening on ${config.port}`));
  const shutdown = async () => { server.close(); await mongoose.disconnect(); process.exit(0); };
  process.on('SIGTERM', shutdown); process.on('SIGINT', shutdown);
}
main().catch((e) => { console.error(e); process.exit(1); });
