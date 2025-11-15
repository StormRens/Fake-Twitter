// app/types/post.ts

// This matches your backend Post model shape as used in post.controllers.ts
// Assumptions:
// - `date` is an ISO string from Mongo
// - `description` is optional in some posts
// - `authorUsername` is added on the frontend by looking up the user from /users/all

export interface Post {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  date: string;
  authorUsername?: string; // filled in by frontend from /users/all
}
