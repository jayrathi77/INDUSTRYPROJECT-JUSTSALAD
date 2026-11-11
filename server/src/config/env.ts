import 'dotenv/config';
const production = process.env.NODE_ENV === 'production';
if (production && (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32)) throw new Error('JWT_SECRET must contain at least 32 characters in production');
export const config = {
  port: Number(process.env.PORT || 4000),
  mongoUri: process.env.MONGODB_URI || '',
  jwtSecret: process.env.JWT_SECRET || 'local-development-secret-change-this-before-deploying',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  swiggyListingUrl: process.env.SWIGGY_LISTING_URL || '',
  cookieSecure: production
};
