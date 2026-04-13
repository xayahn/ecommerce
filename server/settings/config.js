/**
 * config.js
 * Centralizes all environment variables.
 * Import this instead of process.env directly anywhere in the app.
 */

import dotenv from "dotenv";
dotenv.config();

const config = {
  server: {
    port: parseInt(process.env.PORT, 10) || 5000,
    nodeEnv: process.env.NODE_ENV || "development",
    isDev: process.env.NODE_ENV === "development",
    isProd: process.env.NODE_ENV === "production",
  },
  client: {
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  },
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET || "fallback_secret_never_use_in_prod",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },
  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 12,
  },
};

// Guard: crash early in production if critical vars are missing
if (config.server.isProd) {
  const required = ["DATABASE_URL", "JWT_SECRET"];
  required.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`❌ Missing required environment variable: ${key}`);
    }
  });
}

export default config;