import { Request, Response } from "express";
import crypto from "crypto";
import sgMail from "@sendgrid/mail";
import * as jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
const rawSendgrid = (process.env.SENDGRID_API_KEY || '').trim();
const SENDGRID_API_KEY = rawSendgrid.replace(/^["'](.*)["']$/, '$1');
sgMail.setApiKey(SENDGRID_API_KEY);


const FROM_EMAIL = "mo212125@ucf.edu";
const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${3000}`;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const JWT_SECRET = process.env.JWT_SECRET || "change_this";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 7; // 7 days


export async function register(req: Request, res: Response) {
  try {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
      return res.status(400).json({ error: "All fields required" });
    }

    console.log("USER INFORMATION FOR REGISTER:", email, username, password);

    const existingUser = await User.findOne({ username });


    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h

    const newUser = new User({
      email,
      username,
      password: password,
      verificationToken: token,
      verificationTokenExpires: expires,
      isVerified: false,
    });

    await newUser.save();

    const verifyUrl = `${BACKEND_URL}/auth/verify?token=${token}`;

    const msg = {
      to: email,
      from: FROM_EMAIL,
      subject: "Verify your account",
      html: `
        <p>Hi ${username},</p>
        <p>Click the link below to verify your account:</p>
        <a href="${verifyUrl}">Verify account</a>
        <p>This link expires in 24 hours.</p>
      `,
    };

    await sgMail.send(msg);

    res.status(201).json({ message: "User registered. Check your email to verify the account." });
  } catch (error) {
    console.error("HEREHRHERHE", error);
    res.status(500).json({ error: "Server error" });
  }
}

export async function verify(req: Request, res: Response) {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).send("Missing token");

    const user = await User.findOne({
      verificationToken: String(token),
      verificationTokenExpires: { $gt: new Date() },
    });

    if (!user) return res.status(400).send("Invalid or expired token");

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    const payload = { id: user._id.toString(), username: user.username };
    const signed = jwt.sign(
      payload as Record<string, unknown>,
      JWT_SECRET as jwt.Secret,
      { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
    );

    // set httpOnly cookie for web
    res.cookie('token', signed, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
    });

    // redirect to frontend home (cookie will be sent by browser)
    const url = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, '');
    return res.redirect(url);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
}

// Login — only allow if verified
export async function login(req: Request, res: Response) {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Missing credentials" });

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    if (!user.isVerified) return res.status(403).json({ error: "Email not verified" });

    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const payload = { id: user._id.toString(), username: user.username };
    const token = jwt.sign(
      payload as Record<string, unknown>,
      JWT_SECRET as jwt.Secret,
      { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
    );

    // set cookie 
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
    });

    return res.json({ message: "Logged in" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

export async function logout(req: Request, res: Response) {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  return res.json({ message: "Logged out" });
}

