import mongoose from 'mongoose';
import { config } from 'dotenv';

// Load env vars
config();

// MongoDB connection URI from .env
const MONGO_URI = process.env.MONGO_URI;

export const connectDB = async () => {
  if (!MONGO_URI) {
    console.error('❌ MONGO_URI not found in environment variables');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI,{
      dbName: 'excusely', // ✅ This line ensures you always use the correct DB
    });
    console.log('🟢 MongoDB connected');
  } catch (error) {
    console.error('🔴 MongoDB connection error:', error);
    process.exit(1);
  }
};
