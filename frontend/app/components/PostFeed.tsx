// app/components/PostFeed.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "./PostCard";
import CreatePost from "./CreatePost";
import type { Post } from "../types/post";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

//post / user, not posts / users
const API_POSTS_BASE = `${API_BASE_URL}/post`;
const API_USERS_BASE = `${API_BASE_URL}/user`;

type RawPost = {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  date: string;
};

type RawUser = {
  _id: string;
  username: string;
};

type PostsResponse = {
  posts: RawPost[];
};

type UsersResponse = {
  users: RawUser[];
};

export default function PostFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [visibleCount, setVisibleCount] = useState(15);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  async function loadAllPosts() {
    setLoadingPosts(true);
    setLoadError(null);

    try {
      const [postsRes, usersRes] = await Promise.all([
        axios.get<PostsResponse>(`${API_POSTS_BASE}/`, {
          withCredentials: true, // required by requireAuth on /post/
        }),
        axios.get<UsersResponse>(`${API_USERS_BASE}/all`),
      ]);

      const rawPosts = postsRes.data.posts || [];
      const rawUsers = usersRes.data.users || [];

      const userMap = new Map<string, string>();
      for (const u of rawUsers) {
        userMap.set(u._id, u.username);
      }

      const enriched: Post[] = rawPosts.map((p) => ({
        _id: p._id,
        userId: p.userId,
        title: p.title,
        description: p.description,
        date: p.date,
        authorUsername: userMap.get(p.userId),
      }));

      setPosts(enriched);
      setVisibleCount(Math.min(15, enriched.length));
    } catch (err: any) {
      console.error("Error loading posts:", err);
      const msg =
        err?.response?.data?.error || err?.message || "Failed to load posts";
      setLoadError(msg);
    } finally {
      setLoadingPosts(false);
    }
  }

  useEffect(() => {
    void loadAllPosts();
  }, []);

  function handleLoadMore() {
    setVisibleCount((prev) => Math.min(prev + 15, posts.length));
  }

  const visiblePosts = posts.slice(0, visibleCount);
  const hasMore = visibleCount < posts.length;

  return (
    <section
      className="
        space-y-4 rounded-3xl border border-brand-stroke bg-brand-card-soft
        px-4 py-4 shadow-[0_18px_35px_rgba(0,0,0,0.6)]
        lg:col-span-2
      "
    >
      {/* Composer */}
      <CreatePost onPostCreated={loadAllPosts} />

      {/* Errors / loading */}
      {loadError && (
        <p className="text-xs text-red-400">{loadError}</p>
      )}

      {loadingPosts && posts.length === 0 && !loadError && (
        <p className="text-xs text-brand-muted">Loading posts...</p>
      )}

      {/* Posts list */}
      <div className="divide-y divide-brand-stroke/60">
        {visiblePosts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}

        {!loadingPosts && visiblePosts.length === 0 && !loadError && (
          <p className="py-4 text-sm text-brand-muted">
            No posts yet. Be the first to post something!
          </p>
        )}
      </div>

      {/* Load more / end-of-feed */}
      {posts.length > 0 && (
        <div className="mt-3 flex justify-center">
          {hasMore ? (
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={loadingPosts}
              className="
                rounded-2xl border border-brand-stroke bg-brand-card px-4 py-2
                text-xs font-medium text-brand-text hover:bg-brand-card-soft
                disabled:cursor-not-allowed disabled:opacity-60
              "
            >
              {loadingPosts ? "Loading..." : "Load more"}
            </button>
          ) : (
            <p className="text-xs text-brand-muted">
              You’re all caught up.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
