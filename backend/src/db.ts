import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || "something";
const DB_NAME = process.env.DB_NAME || 'fake_twitter';

export async function connectDB(): Promise<void> {
    if (mongoose.connection.readyState === 1) {
        console.log(`Already connected to MongoDB: ${DB_NAME}`);
        return;
    }

    try {
        await mongoose.connect(MONGODB_URI, { dbName: DB_NAME });
        console.log(`Connected to MongoDB: ${DB_NAME}`);
    } catch (err) {
        console.error('MongoDB connection error:', err);
        throw err;
    }
}