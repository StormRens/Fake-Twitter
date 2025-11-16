/// <reference types="jest" />
import { Request, Response } from "express";
import mongoose from "mongoose";

// stub modules - export Post as a constructor/class so `new Post(...)` in controllers works
jest.mock("../src/models/post.model", () => {
  const findByIdMock = jest.fn();
  const findByIdAndDeleteMock = jest.fn();
  const findMock = jest.fn();

  class Post {
    _id: any;
    userId: any;
    title?: string;
    description?: string;

    constructor(data: any) {
      Object.assign(this, data);
      this._id = data._id ?? new mongoose.Types.ObjectId().toString();
    }

    // instance method delegates to static saveMock so tests can control it
    async save() {
      return (Post as any).saveMock();
    }

    static saveMock = jest.fn();
    static findById = findByIdMock;
    static findByIdAndDelete = findByIdAndDeleteMock;
    static find = findMock;
  }

  return { Post };
});

jest.mock("../src/models/user.model", () => ({
  User: {
    findByIdAndUpdate: jest.fn(),
  },
}));

const { Post } = require("../src/models/post.model");
const { User } = require("../src/models/user.model");

// import controllers under test
import * as controllers from "../src/controllers/post.controllers";
import { AuthRequest } from "../src/middlewares/auth.middlewares";

function mockRes() {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res as Response;
}

describe("post.controllers", () => {
  beforeEach(() => jest.clearAllMocks());

  test("createPost uses authenticated userId and returns 201", async () => {
    const validUserId = new mongoose.Types.ObjectId().toString();
    const req: Partial<AuthRequest> = {
      body: { title: "hello" },
      user: { id: validUserId, username: "bob" },
    };

    // control the static save mock used by instance.save()
    (Post as any).saveMock.mockResolvedValue({
      _id: new mongoose.Types.ObjectId().toString(),
      title: "hello",
      userId: validUserId,
    });

    const res = mockRes();
    await controllers.createPost(req as AuthRequest, res);

    expect((Post as any).saveMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect((res.json as jest.Mock).mock.calls[0][0]).toHaveProperty("post");
  });

  test("deletePost forbids non-owner", async () => {
    const ownerId = new mongoose.Types.ObjectId().toString();
    const otherId = new mongoose.Types.ObjectId().toString();
    const req: Partial<AuthRequest> = { params: { id: "p1" }, user: { id: otherId, username: "alice" } };
    const res = mockRes();
    // Post.findById returns a post owned by someone else (ownerId)
    (Post.findById as jest.Mock).mockResolvedValue({ _id: "p1", userId: ownerId });
    await controllers.deletePost(req as AuthRequest, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

});