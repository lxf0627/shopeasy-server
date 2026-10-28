/**
 * Server configuration.
 * Environment-specific values come from environment variables,
 * with safe development fallbacks so local setup stays zero-config.
 */

const isProduction = process.env.NODE_ENV === 'production';

// JWT secret: must be provided through the environment in production
const jwtSecret = process.env.JWT_SECRET || 'shopeasy-dev-secret-change-me';
if (!process.env.JWT_SECRET) {
  if (isProduction) {
    console.error('[Config] JWT_SECRET environment variable is required in production, exiting.');
    process.exit(1);
  }
  console.warn('[Config] JWT_SECRET not set, using development fallback secret (dev only).');
}

// CORS: only the dev / preview origins are allowed by default
const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map((s) => s.trim()).filter(Boolean)
  : ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:4173', 'http://127.0.0.1:4173'];

module.exports = {
  port: Number(process.env.PORT) || 3000,
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  corsOrigins,
  saltRounds: 10,
};