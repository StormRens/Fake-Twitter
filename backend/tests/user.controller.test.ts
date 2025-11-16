/// <reference types="jest" />

import { Request, Response } from "express";

const findMock = jest.fn();
const findOneMock = jest.fn();
const findByIdAndUpdateMock = jest.fn();
const findByIdAndDeleteMock = jest.fn();
const findOneAndDeleteMock = jest.fn();
const deleteOneMock = jest.fn();
const updateManyMock = jest.fn();

jest.mock("../src/models/user.model", () => ({
  User: {
    find: findMock,
    findOne: findOneMock,
    findByIdAndUpdate: findByIdAndUpdateMock,
    findByIdAndDelete: findByIdAndDeleteMock,
    findOneAndDelete: findOneAndDeleteMock,
    deleteOne: deleteOneMock,
    updateMany: updateManyMock,
  },
}));

const postFindMock = jest.fn();
jest.mock("../src/models/post.model", () => ({
  Post: {
    find: postFindMock,
  },
}));

const { User } = require("../src/models/user.model");
const { Post } = require("../src/models/post.model");

import * as controllers from "../src/controllers/user.controllers";
import { AuthRequest } from "../src/middlewares/auth.middlewares";

function mockRes(): Response {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res as Response;
}

/**
 * Chainable helper to mock mongoose query chains used by controllers:
 * supports .select().populate().sort().limit().lean() etc.
 */
function chainableResolve(value: any) {
  const leaf = {
    lean: () => Promise.resolve(value),
  };
  const populated = {
    lean: () => Promise.resolve(value),
  };
  const selected = {
    populate: () => populated,
    lean: () => Promise.resolve(value),
  };
  return {
    select: () => selected,
    populate: () => populated,
    lean: () => Promise.resolve(value),
    sort: () => leaf,
    limit: () => leaf,
    skip: () => leaf,
  };
}

describe("user.controllers (unit)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("fetchAllUsers returns list", async () => {
    findMock.mockImplementation(() => chainableResolve([{ _id: "u1", username: "alice" }]));

    const req = {} as unknown as Request;
    const res = mockRes();

    await controllers.fetchAllUsers(req, res);

    expect(findMock).toHaveBeenCalled();
    const out = (res.json as jest.Mock).mock.calls[0][0];
    expect(out).toHaveProperty("users");
    expect(out.users[0].username).toBe("alice");
  });

  test("getUserProfile returns counts, posts, username and isFollowing", async () => {
    const profileUser = { _id: "u1", username: "alice", followers: ["f1"], following: ["g1"] };
    findOneMock.mockImplementation(() => chainableResolve(profileUser));
    postFindMock.mockImplementation(() => chainableResolve([{ _id: "p1", userId: "u1", title: "hello" }]));

    const req = { params: { username: "alice" }, user: { id: "f1", username: "f1" } } as unknown as AuthRequest;
    const res = mockRes();

    await controllers.getUserProfile(req as AuthRequest, res);

    const out = (res.json as jest.Mock).mock.calls[0][0];
    expect(out.username).toBe("alice");
    expect(out.followersCount).toBe(1);
    expect(out.followingCount).toBe(1);
    expect(Array.isArray(out.posts)).toBe(true);
    expect(out.isFollowing).toBe(true);
  });

  test("followUser adds follower and returns message", async () => {
    const targetId = "target1";
    // User.findOne(...).select("_id").lean()
    findOneMock.mockImplementation(() => chainableResolve({ _id: targetId }));
    findByIdAndUpdateMock.mockResolvedValue({});
    updateManyMock.mockResolvedValue({}); // in case controller calls updateMany

    const req = { params: { username: "bob" }, user: { id: "follower1", username: "follower" } } as unknown as AuthRequest;
    const res = mockRes();

    await controllers.followUser(req as AuthRequest, res);

    expect(findOneMock).toHaveBeenCalledWith({ username: "bob" });
    expect(findByIdAndUpdateMock).toHaveBeenCalled();
    expect((res.json as jest.Mock).mock.calls[0][0]).toHaveProperty("message");
  });

  test("unfollowUser removes follower and returns message", async () => {
    const targetId = "target1";
    findOneMock.mockImplementation(() => chainableResolve({ _id: targetId }));
    findByIdAndUpdateMock.mockResolvedValue({});
    updateManyMock.mockResolvedValue({}); // in case controller calls updateMany

    const req = { params: { username: "bob" }, user: { id: "follower1", username: "follower" } } as unknown as AuthRequest;
    const res = mockRes();

    await controllers.unfollowUser(req as AuthRequest, res);

    expect(findByIdAndUpdateMock).toHaveBeenCalled();
    expect((res.json as jest.Mock).mock.calls[0][0]).toHaveProperty("message");
  });

  test("getFollowers returns populated follower list", async () => {
    findOneMock.mockImplementation(() =>
      chainableResolve({ followers: [{ _id: "f1", username: "follower" }] })
    );

    const req = { params: { username: "bob" } } as unknown as Request;
    const res = mockRes();

    await controllers.getFollowers(req as AuthRequest, res);

    const out = (res.json as jest.Mock).mock.calls[0][0];
    expect(out).toHaveProperty("followers");
    expect(out.followers[0].username).toBe("follower");
  });

  test("getFollowing returns populated following list", async () => {
    findOneMock.mockImplementation(() =>
      chainableResolve({ following: [{ _id: "g1", username: "g1" }] })
    );

    const req = { params: { username: "alice" } } as unknown as Request;
    const res = mockRes();

    await controllers.getFollowing(req as AuthRequest, res);

    const out = (res.json as jest.Mock).mock.calls[0][0];
    expect(out).toHaveProperty("following");
    expect(out.following[0].username).toBe("g1");
  });

});