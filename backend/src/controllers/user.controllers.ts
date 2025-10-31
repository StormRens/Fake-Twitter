import { Request, Response } from "express";
import { User } from "../models/user.model";
import { Post } from "../models/post.model";
import mongoose from "mongoose";

export async function fetchAllUsers(req: Request, res: Response) {
  try {
    const users = await User.find()
      .select("-password -verificationToken -verificationTokenExpires -__v")
      .lean();
    return res.json({ users });
  } catch (err) {
    console.error("fetchAllUsers error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

export async function deleteUserByUsername(req: Request, res: Response) {
  const { username } = req.params;
  if (!username) return res.status(400).json({ error: "username is required" });

  try {
    const user = await User.findOne({ username }).select("_id").lean();
    if (!user) return res.status(404).json({ error: "User not found" });

    const userId = user._id as mongoose.Types.ObjectId;

    // delete user document
    await User.deleteOne({ _id: userId });

    // remove userId from other users' followers/following/posts arrays
    await User.updateMany(
      {},
      { $pull: { followers: userId, following: userId, posts: userId } }
    );

    // delete posts authored by this user
    await Post.deleteMany({ userId });

    return res.json({ message: "User and related data deleted" });
  } catch (err) {
    console.error("deleteUserByUsername error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}