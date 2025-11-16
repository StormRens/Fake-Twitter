/// <reference types="jest" />
import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

// mock jwt.verify and jwt.decode
jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
  decode: jest.fn(),
}));

const { verify } = jwt as unknown as { verify: jest.Mock };

import { requireAuth } from "../src/middlewares/auth.middlewares";

function mockRes() {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
}

describe("requireAuth middleware", () => {
  beforeEach(() => jest.clearAllMocks());

  test("accepts Authorization header bearer token", () => {
    (verify as jest.Mock).mockReturnValue({ id: "u1", username: "bob" });
    const req = { headers: { authorization: "Bearer tok" }, cookies: {} } as unknown as Request;
    const res = mockRes();
    const next = jest.fn();
    requireAuth(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  
});