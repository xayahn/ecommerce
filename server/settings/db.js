/**
 * db.js
 * Prisma Client singleton.
 * Import `prisma` from here everywhere — never instantiate PrismaClient directly.
 */

import { PrismaClient } from "@prisma/client";
import config from "./config.js";

const globalForPrisma = globalThis;

/** @type {PrismaClient} */
const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: config.server.isDev
      ? ["query", "info", "warn", "error"]
      : ["warn", "error"],
    errorFormat: "pretty",
  });

if (config.server.isDev) {
  globalForPrisma.prisma = prisma;
}

/**
 * Gracefully disconnect Prisma on process exit.
 */
const shutdown = async (signal) => {
  console.log(`\n[db] Received ${signal} — disconnecting Prisma...`);
  await prisma.$disconnect();
  process.exit(0);
};

process.on("SIGINT",  () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

export default prisma;