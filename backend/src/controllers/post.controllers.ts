import { Request, Response } from "express";

// Keep your existing function too
export async function fetchAll(req: Request, res: Response) {
  console.log("Fetch all posts");
}

export async function fetchUserPosts(req: Request, res: Response) {
    const { userId } = req.params;
}

export async function createPost(req: Request, res: Response) {
    const { userId, title, description } = req.body;
}

export async function deletePost(req: Request, res: Response) {
    const { id } = req.params;

    // return res.status(204).send();
}

export async function fetchFollowingPosts(req: Request, res: Response) {
    const { userId } = req.params;
}