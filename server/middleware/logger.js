/**
 * logger.js
 * Request logger middleware.
 * Wraps morgan with a clean timestamped format.
 */

import morgan from "morgan";
import config from "../settings/config.js";

// Custom token: timestamp
morgan.token("timestamp", () => new Date().toISOString());

// Dev format: color-coded, concise
const devFormat = "[:timestamp] :method :url :status :response-time ms";

// Production format: structured for log aggregators
const prodFormat = JSON.stringify({
  timestamp: ":timestamp",
  method:    ":method",
  url:       ":url",
  status:    ":status",
  responseTime: ":response-time ms",
  userAgent: ":user-agent",
});

export const requestLogger = morgan(
  config.server.isDev ? devFormat : prodFormat
);