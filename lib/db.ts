import { PrismaClient } from "./generated/prisma";

// Ensure a single PrismaClient instance across hot reloads in dev
const globalRef = global as unknown as { prisma?: PrismaClient };

export const prisma: PrismaClient =
  globalRef.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalRef.prisma = prisma;
}


