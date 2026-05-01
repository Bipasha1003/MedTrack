const { PrismaClient } = require('@prisma/client');

// This prevents creating too many connections
const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

module.exports = prisma;