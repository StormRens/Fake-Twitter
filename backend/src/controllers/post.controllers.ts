import { Request, Response } from "express";
import mongoose from "mongoose";
import { Post } from "../models/post.model";
import { User } from "../models/user.model";
import { AuthRequest } from "../middlewares/auth.middlewares";

export async function fetchAll(req: Request, res: Response) {
  try {
    const posts = await Post.find().sort({ date: -1 }).lean();
    return res.json({ posts });
  } catch (err) {
    console.error("fetchAll posts error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

export async function fetchUserPosts(req: Request, res: Response) {
  const { userId } = req.params;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid user id" });
  }

  try {
    const posts = await Post.find({ userId }).sort({ date: -1 }).lean();

    return res.json({ posts });
  } catch (err) {
    console.error("fetchUserPosts error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

export async function createPost(req: AuthRequest, res: Response) {
  const { title, description } = req.body;
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  if (!title) {
    return res.status(400).json({ error: "userId and title are required" });
  }
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid userId" });
  }

  try {
    const post = new Post({
      userId,
      title,
      description: description || "",
      date: new Date(),
      comments: [],
    });

    await post.save();

    // add post id to user's posts array
    await User.findByIdAndUpdate(userId, { $addToSet: { posts: post._id } });

    return res.status(201).json({ post });
  } catch (err) {
    console.error("createPost error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

export async function deletePost(req: AuthRequest, res: Response) {
  const { id } = req.params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid post id" });
  }

  try {
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const requesterId = req.user?.id;
    if (!requesterId) return res.status(401).json({ error: "Unauthorized" });
    if (post.userId.toString() !== requesterId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await Post.findByIdAndDelete(id);

    // remove post id from user's posts array
    await User.findByIdAndUpdate(post.userId, { $pull: { posts: post._id } });

    return res.status(204).send();
  } catch (err) {
    console.error("deletePost error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

export async function fetchFollowingPosts(req: Request, res: Response) {
  const { userId } = req.params;
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid user id" });
  }

  try {
    const user = await User.findById(userId).select("following").lean();
    if (!user) return res.status(404).json({ error: "User not found" });

    // all people following
    const following = (user.following || []) as (
      | string
      | mongoose.Types.ObjectId
    )[];
    if (following.length === 0) return res.json({ posts: [] });

    const posts = await Post.find({ userId: { $in: following } })
      .sort({ date: -1 })
      .lean();
    return res.json({ posts });
  } catch (err) {
    console.error("fetchFollowingPosts error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

export async function editPost(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const { title, description } = req.body;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid post id" });
  }
  if (title === undefined && description === undefined) {
    return res.status(400).json({ error: "Nothing to update" });
  }

  try {
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    // If request is authenticated, require ownership
    if (req.user && post.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    if (title !== undefined) post.title = title;
    if (description !== undefined) post.description = description;

    await post.save();

    return res.json({ post });
  } catch (err) {
    console.error("editPost error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
