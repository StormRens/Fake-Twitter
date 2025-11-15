// app/components/CreatePost.tsx
import React, { useState } from "react";
import axios from "axios";

// NOTE: Adjust this when you deploy.
// For local dev, backend is on http://localhost:5000
const API_BASE_URL = "http://localhost:5000";

// ASSUMPTION: In Express you did something like:
//   app.use("/posts", postRoutes);
// so createPost is at POST /posts/create
const API_POSTS_BASE = `${API_BASE_URL}/posts`;

type CreatePostProps = {
  // Parent (PostFeed) passes a function to reload posts after a successful post
  onPostCreated?: () => Promise<void> | void;
};

export default function CreatePost({ onPostCreated }: CreatePostProps) {
  const [draft, setDraft] = useState("");
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const maxChars = 300;
  const charsLeft = maxChars - draft.length;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;

    setLoadingCreate(true);
    setError(null);

    try {
      // NOTE:
      // - Backend expects userId from auth cookie (handled by requireAuth).
      // - We send the full text as "title" and leave description empty.
      //   Change this if you ever split title vs description.
      await axios.post(
        `${API_POSTS_BASE}/create`,
        {
          title: text,
          description: "",
        },
        {
          withCredentials: true, // important for cookies / JWT
        }
      );

      setDraft("");

      // Ask parent to reload posts from backend
      if (onPostCreated) {
        await onPostCreated();
      }
    } catch (err: any) {
      console.error("Error creating post:", err);
      setError(err?.response?.data?.error || "Failed to create post");
    } finally {
      setLoadingCreate(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-brand-card/70 p-3"
    >
      <label className="mb-2 block text-sm font-medium">
        What’s happening?
      </label>

      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        rows={3}
        maxLength={maxChars}
        placeholder="Share your thoughts with the pond..."
        className="
          w-full resize-none rounded-2xl border border-brand-stroke/70
          bg-[rgba(8,12,26,0.7)] px-3 py-2 text-sm text-brand-text
          placeholder:text-brand-muted focus:border-[#7aa7ff]
          focus:outline-none focus:shadow-[0_0_0_4px_rgba(122,167,255,0.18)]
        "
      />

      <div className="mt-3 flex items-center justify-between text-xs text-brand-muted">
        <span>{charsLeft} characters left</span>

        <button
          type="submit"
          disabled={!draft.trim() || loadingCreate}
          className="
            rounded-2xl bg-gradient-to-r from-brand-accent to-brand-accent2
            px-4 py-2 text-xs font-semibold text-white
            shadow-[0_10px_24px_rgba(0,0,0,0.45)]
            disabled:cursor-not-allowed disabled:opacity-60
            hover:brightness-105 hover:shadow-[0_14px_28px_rgba(0,0,0,0.55)]
          "
        >
          {loadingCreate ? "Posting..." : "Post"}
        </button>
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-400">
          {error}
        </p>
      )}
    </form>
  );
}
