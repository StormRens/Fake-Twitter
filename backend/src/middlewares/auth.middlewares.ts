import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "change_this";

export interface AuthRequest extends Request {
  user?: { id: string; username: string; };
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    // Accept token from cookie (web) or Authorization header (mobile)
    const cookieToken = (req as any).cookies?.token as string | undefined;
    const authHeader = (req.headers.authorization || "") as string;
    const headerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
    const token = cookieToken || headerToken;

    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const payload = jwt.verify(token, JWT_SECRET as jwt.Secret) as any;

    if (!payload?.id || !payload?.username) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    // attach id and username
    (req as AuthRequest).user = {
      id: String(payload.id),
      username: String(payload.username),
    };

    return next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}