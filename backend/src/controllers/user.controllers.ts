import { Request, Response } from "express";
import { User } from "../models/user.model";

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