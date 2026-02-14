import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pollachi-grievance-system';

if (!MONGODB_URI) {
    throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local'
    );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    // eslint-disable-next-line no-var
    var _mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = (global as any)._mongooseCache;

if (!cached) {
    cached = (global as any)._mongooseCache = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            serverSelectionTimeoutMS: 5000,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            return mongoose;
        }).catch(err => {
            console.error('[MongoDB] Connection failed:', err.message);
            throw err;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e: any) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default dbConnect;

