/**
 * server.js
 * Express entry point — fully wired with all middleware and routes.
 */

import express        from "express";
import cors           from "cors";
import helmet         from "helmet";
import dotenv         from "dotenv";
import path           from "path";
import { fileURLToPath } from "url";

import { requestLogger } from "./middleware/logger.js";
import { errorHandler  } from "./middleware/errorHandler.js";
import apiRouter         from "./api/v1/index.js";
import config            from "./settings/config.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();

// ─── Security ────────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin:         config.client.origin,
  methods:        ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-cart-token"],
  credentials:    true,
}));

// ─── Parsing ──────────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ─── Logging ──────────────────────────────────────────────────────────────────
app.use(requestLogger);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.status(200).json({
    status:      "ok",
    environment: config.server.nodeEnv,
    timestamp:   new Date().toISOString(),
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/v1", apiRouter);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ status: "error", message: "Route not found" });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(config.server.port, () => {
  console.log(`\n🚀 Server running in [${config.server.nodeEnv}] on port ${config.server.port}`);
  console.log(`   Health  → http://localhost:${config.server.port}/health`);
  console.log(`   API v1  → http://localhost:${config.server.port}/api/v1/ping\n`);
});

export default app;