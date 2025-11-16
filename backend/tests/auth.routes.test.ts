/// <reference types="jest" />

import request from "supertest";
import createApp from "./setupApp";

// mock controllers so tests exercise routing only
jest.mock("../src/controllers/auth.controllers", () => ({
  login: (req: any, res: any) => res.status(200).json({ message: "login ok" }),
  register: (req: any, res: any) => res.status(201).json({ message: "registered" }),
  verify: (req: any, res: any) => res.status(200).send("verified"),
  logout: (req: any, res: any) => res.status(200).json({ message: "logged out" }),
  loginMobile: (req: any, res: any) => res.status(200).json({ token: "mobile" }),
  verifyMobile: (req: any, res: any) => res.status(200).json({ token: "mobile-verify" }),
  registerMobile: (req: any, res: any) => res.status(201).json({ message: "mobile registered" }),
}));

describe("Auth routes wiring", () => {
  const app = createApp();

  test("POST /auth/register -> 201", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ email: "a@a.com", username: "bob", password: "pw" });
    expect(res.status).toBe(201);
    expect(res.body.message).toBe("registered");
  });

  test("POST /auth/login -> 200", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ username: "bob", password: "pw" });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("login ok");
  });

  test("GET /auth/verify -> 200", async () => {
    const res = await request(app).get("/auth/verify").query({ token: "t" });
    expect(res.status).toBe(200);
    expect(res.text).toBe("verified");
  });

  test("POST /auth/logout -> 200", async () => {
    const res = await request(app).post("/auth/logout");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("logged out");
  });
});