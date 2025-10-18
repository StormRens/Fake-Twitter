import mongoose from 'mongoose';

// update with correct schema

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  displayName: String,
  bio: String,
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);