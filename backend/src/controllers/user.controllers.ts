import { Request, Response } from "express";
import { User } from "../models/user.model";
import { Post } from "../models/post.model";
import mongoose from "mongoose";
import { AuthRequest } from "../middlewares/auth.middlewares";


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

export async function followUser(req: AuthRequest, res: Response) {
  const targetUsername = req.params.username;
  const followerId = req.user?.id;
  if (!followerId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const target = await User.findOne({ username: targetUsername }).select("_id").lean();
    if (!target) return res.status(404).json({ error: "User not found" });

    if (String(target._id) === followerId) return res.status(400).json({ error: "Cannot follow yourself" });

    // add followerId to target.followers and target._id to follower.following
    await Promise.all([
      User.findByIdAndUpdate(target._id, { $addToSet: { followers: followerId } }),
      User.findByIdAndUpdate(followerId, { $addToSet: { following: target._id } }),
    ]);

    return res.json({ message: "Followed" });
  } catch (err) {
    console.error("followUser error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

export async function unfollowUser(req: AuthRequest, res: Response) {
  const targetUsername = req.params.username;
  const followerId = req.user?.id;
  if (!followerId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const target = await User.findOne({ username: targetUsername }).select("_id").lean();
    if (!target) return res.status(404).json({ error: "User not found" });

    await Promise.all([
      User.findByIdAndUpdate(target._id, { $pull: { followers: followerId } }),
      User.findByIdAndUpdate(followerId, { $pull: { following: target._id } }),
    ]);

    return res.json({ message: "Unfollowed" });
  } catch (err) {
    console.error("unfollowUser error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

export async function getFollowers(req: Request, res: Response) {
  const username = req.params.username;
  try {
    const user = await User.findOne({ username }).select("followers").populate("followers", "username").lean();
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json({ followers: user.followers });
  } catch (err) {
    console.error("getFollowers error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

export async function getFollowing(req: Request, res: Response) {
  const username = req.params.username;
  try {
    const user = await User.findOne({ username }).select("following").populate("following", "username").lean();
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json({ following: user.following });
  } catch (err) {
    console.error("getFollowing error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

export async function getUserProfile(req: AuthRequest, res: Response) {
  const username = req.params.username;
  if (!username) return res.status(400).json({ error: "username is required" });

  try {
    const user = await User.findOne({ username }).select("username followers following _id").lean();
    if (!user) return res.status(404).json({ error: "User not found" });

    // load posts authored by this user
    const posts = await Post.find({ userId: user._id }).sort({ date: -1 }).lean();

    const followersCount = Array.isArray(user.followers) ? user.followers.length : 0;
    const followingCount = Array.isArray(user.following) ? user.following.length : 0;

    // determine if the requester follows this user (req.user exists because route will be protected)
    const requesterId = req.user?.id;
    const isFollowing = requesterId ? (Array.isArray(user.followers) && user.followers.some((f: any) => String(f) === requesterId)) : false;

    return res.json({
      username: user.username,
      followersCount,
      followingCount,
      posts,
      isFollowing, // frontend will check if true to show 'following' button instead of 'follow' button
    });
  } catch (err) {
    console.error("getUserProfile error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}