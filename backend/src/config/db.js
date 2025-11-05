const { PrismaClient } = require('@prisma/client');
const mongoose = require('mongoose');

// Initialize Prisma client
const prisma = new PrismaClient();

// Connect to MongoDB using Mongoose (as a backup or for non-Prisma operations)
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = {
  prisma,
  connectDB,
};
