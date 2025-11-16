/// <reference types="jest" />

jest.mock("../src/middlewares/auth.middlewares", () => ({
  requireAuth: (req: any, res: any, next: any) => next(),
}));

// Mock user controllers
jest.mock("../src/controllers/user.controllers", () => ({
  fetchAllUsers: (_req: any, res: any) => res.json({ users: [{ _id: "u1", username: "alice" }] }),
  deleteUserByUsername: (_req: any, res: any) => res.status(204).send(),
  followUser: (_req: any, res: any) => res.json({ message: "Followed" }),
  unfollowUser: (_req: any, res: any) => res.json({ message: "Unfollowed" }),
  getFollowers: (_req: any, res: any) => res.json({ followers: [{ _id: "f1", username: "follower" }] }),
  getFollowing: (_req: any, res: any) => res.json({ following: [{ _id: "g1", username: "followed" }] }),
  getUserProfile: (_req: any, res: any) =>
    res.json({
      username: "alice",
      followersCount: 5,
      followingCount: 3,
      posts: [{ _id: "p1", title: "post" }],
      isFollowing: false,
    }),
}));

import request from "supertest";
import createApp from "./setupApp";

describe("User routes wiring", () => {
  const app = createApp();

  test("GET /user/all -> fetchAllUsers", async () => {
    const res = await request(app).get("/user/all");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.users)).toBe(true);
    expect(res.body.users[0].username).toBe("alice");
  });

  test("POST /user/:username/follow -> followUser", async () => {
    const res = await request(app).post("/user/alice/follow");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Followed");
  });

  test("POST /user/:username/unfollow -> unfollowUser", async () => {
    const res = await request(app).post("/user/alice/unfollow");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Unfollowed");
  });

  test("GET /user/:username/followers -> getFollowers", async () => {
    const res = await request(app).get("/user/alice/followers");
    expect(res.status).toBe(200);
    expect(res.body.followers[0].username).toBe("follower");
  });

  test("GET /user/:username/following -> getFollowing", async () => {
    const res = await request(app).get("/user/alice/following");
    expect(res.status).toBe(200);
    expect(res.body.following[0].username).toBe("followed");
  });

  test("GET /user/:username/profile -> getUserProfile", async () => {
    const res = await request(app).get("/user/alice/profile");
    expect(res.status).toBe(200);
    expect(res.body.username).toBe("alice");
    expect(res.body.posts).toBeDefined();
  });

  test("DELETE /user/:username -> deleteUserByUsername", async () => {
    const res = await request(app).delete("/user/alice");
    expect(res.status).toBe(204);
  });
});