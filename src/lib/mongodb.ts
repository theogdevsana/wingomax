import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // Increased to 10 seconds to avoid timeout on slow connections
    };

    console.log('Connecting to MongoDB...');
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('MongoDB connected successfully');
      return mongoose;
    }).catch((err) => {
      console.error('MongoDB connection error:', err);
      throw err;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;
