/// <reference types="jest" />

jest.mock("../src/middlewares/auth.middlewares", () => ({
  requireAuth: (req: any, res: any, next: any) => next(),
}));

// Mock controllers so tests only validate routing and basic responses
jest.mock("../src/controllers/post.controllers", () => ({
  fetchAll: (_req: any, res: any) => res.json({ posts: [{ _id: "p1", title: "t1" }] }),
  fetchUserPosts: (_req: any, res: any) => res.json({ posts: [{ _id: "up1", title: "user post" }] }),
  fetchFollowingPosts: (_req: any, res: any) => res.json({ posts: [{ _id: "f1", title: "followed post" }] }),
  createPost: (_req: any, res: any) => res.status(201).json({ post: { _id: "created", title: _req.body.title } }),
  editPost: (req: any, res: any) => res.json({ post: { _id: req.params.id, title: req.body.title } }),
  deletePost: (_req: any, res: any) => res.status(204).send(),
}));

import request from "supertest";
import createApp from "./setupApp";

describe("Post routes wiring", () => {
  const app = createApp();

  test("GET /post -> fetchAll", async () => {
    const res = await request(app).get("/post");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.posts)).toBe(true);
    expect(res.body.posts[0]._id).toBe("p1");
  });

  test("GET /post/:userId -> fetchUserPosts", async () => {
    const res = await request(app).get("/post/12345");
    expect(res.status).toBe(200);
    expect(res.body.posts[0].title).toBe("user post");
  });

  test("GET /post/:userId/following -> fetchFollowingPosts", async () => {
    const res = await request(app).get("/post/12345/following");
    expect(res.status).toBe(200);
    expect(res.body.posts[0].title).toBe("followed post");
  });

  test("POST /post/create -> createPost", async () => {
    const payload = { title: "hello" };
    const res = await request(app).post("/post/create").send(payload);
    expect(res.status).toBe(201);
    expect(res.body.post._id).toBe("created");
    expect(res.body.post.title).toBe("hello");
  });

  test("PUT /post/:id -> editPost", async () => {
    const res = await request(app).put("/post/abc123").send({ title: "edited" });
    expect(res.status).toBe(200);
    expect(res.body.post._id).toBe("abc123");
    expect(res.body.post.title).toBe("edited");
  });

  test("DELETE /post/:id -> deletePost", async () => {
    const res = await request(app).delete("/post/abc123");
    expect(res.status).toBe(204);
  });
});