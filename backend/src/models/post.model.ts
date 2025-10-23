import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  commenter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, // links post to user
  title: { type: String, required: true },
  description: { type: String, default: '' },
  date: { type: Date, default: Date.now }, 
  comments: { type: [commentSchema], default: [] },
}, { timestamps: true });

export const Post = mongoose.model('Post', postSchema);