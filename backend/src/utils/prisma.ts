import { PrismaClient } from '../generated/prisma/index.js';

// Create a single Prisma Client instance
// Use a global variable to prevent multiple instances in development with hot reload
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
