import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  isMockFallback?: boolean;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null, isMockFallback: false };
}

export async function connectDB(): Promise<{ isConnected: boolean; isMockFallback: boolean }> {
  // If in Next.js build phase or no active MONGODB_URI configured, use mock fallback immediately
  const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';
  const hasRealUri = Boolean(MONGODB_URI && (MONGODB_URI.startsWith('mongodb+srv://') || MONGODB_URI.includes('@') || MONGODB_URI.includes('localhost') || MONGODB_URI.includes('127.0.0.1')));

  if (isBuildPhase || !hasRealUri) {
    return { isConnected: false, isMockFallback: true };
  }

  if (cached?.conn && !cached.isMockFallback) {
    return { isConnected: true, isMockFallback: false };
  }

  if (!cached?.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 1500, // Fast failover to mock store
    };

    cached!.promise = mongoose.connect(MONGODB_URI, opts)
      .then((m) => {
        console.log('✅ Connected to MongoDB at', MONGODB_URI.split('@').pop());
        cached!.isMockFallback = false;
        return m;
      })
      .catch((err) => {
        console.warn('⚠️ MongoDB connection could not be established:', err.message);
        console.warn('⚡ Using robust in-memory database fallback so the app works seamlessly.');
        cached!.isMockFallback = true;
        return mongoose;
      });
  }

  try {
    cached!.conn = await cached!.promise;
    return { isConnected: !cached!.isMockFallback, isMockFallback: !!cached!.isMockFallback };
  } catch (e) {
    cached!.promise = null;
    cached!.isMockFallback = true;
    return { isConnected: false, isMockFallback: true };
  }
}

export default connectDB;
