import { Request, Response } from "express";
import { User } from "../models/user.model";

// Register controller
export async function register(req: Request, res: Response) {
  try {
    const { email, username, password } = req.body;

    // Validation
    if (!email || !username || !password) {
      return res.status(400).json({ error: "All fields required" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password

    // Create user
    const newUser = new User({
      email,
      username,
      password: password,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
}

// Keep your existing function too
export async function userExample(req: Request, res: Response) {
  console.log("Example user controller");
}