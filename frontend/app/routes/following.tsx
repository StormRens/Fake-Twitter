// app/routes/following.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router";
import PostCard from "../components/PostCard";
import type { Post } from "../types/post";
import UserSearchBar from "../components/UserSearchBar";
import FollowButton from "../components/FollowButton";


const DUCK_ICON = `${import.meta.env.BASE_URL}DuckIcon.svg`;

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

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

type LocationState = {
  username?: string;
};

export default function Following() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) || {};

  const usernameFromState = state.username;

  const displayName = usernameFromState || "You";
  const handle = usernameFromState ? `@${usernameFromState}` : "@you";

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogout() {
    try {
      await axios.post(
        `${API_BASE_URL}/auth/logout`,
        null,
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      navigate("/login");
    }
  }

  async function loadFollowingPosts() {
    if (!usernameFromState) {
      setError("Missing user info. Try going back to the dashboard and coming here again.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1) Get all users so we can:
      //    - find the current user's _id
      //    - map post.userId -> username for display
      const usersRes = await axios.get<UsersResponse>(`${API_USERS_BASE}/all`);
      const allUsers = usersRes.data.users || [];

      const me = allUsers.find((u) => u.username === usernameFromState);
      if (!me) {
        setError("Could not find the current user in /user/all.");
        setLoading(false);
        return;
      }

      const viewerId = me._id;

      // 2) Get posts from people I follow
      const postsRes = await axios.get<PostsResponse>(
        `${API_POSTS_BASE}/${viewerId}/following`,
        { withCredentials: true }
      );

      const rawPosts = postsRes.data.posts || [];

      // 3) Map each post's userId -> username
      const userMap = new Map<string, string>();
      for (const u of allUsers) {
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
    } catch (err: any) {
      console.error("Error loading following posts:", err);
      const msg =
        err?.response?.data?.error || err?.message || "Failed to load posts";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadFollowingPosts();
  }, [usernameFromState]);

  const hasPosts = posts.length > 0;

  return (
    <>
      {/* TOP NAVBAR */}
      <header className="border-b border-brand-stroke/60 bg-brand-card/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <img
              src={DUCK_ICON}
              alt="FakeTwitwer logo"
              className="h-10 w-10 rounded-2xl"
            />
            <div>
              <div className="text-sm font-semibold tracking-wide">
                Ducky
              </div>
              <p className="text-xs text-brand-muted">
                Where the ducks come to post.
              </p>
            </div>
          </div>

          {/* SEARCH BAR */}
          <UserSearchBar currentUsername={state.username} />

          {/* USER PILL */}
          <div className="flex items-center gap-3">
            <div className="hidden text-right text-xs sm:block">
              <div className="font-semibold">{displayName}</div>
              <div className="text-brand-muted">{handle}</div>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-2xl bg-brand-card-soft px-3 py-2 text-xs font-medium text-brand-muted hover:bg-brand-card hover:text-brand-text"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main
        className="
          mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6
          lg:grid-cols-[260px_minmax(0,1fr)_minmax(0,1fr)]
        "
      >
        {/* LEFT COLUMN – nav + info + footer */}
        <aside className="hidden space-y-4 lg:block">
          {/* Navigation */}
          <div className="rounded-3xl border border-brand-stroke bg-brand-card-soft px-5 py-4 shadow-[0_18px_35px_rgba(0,0,0,0.6)]">
            <h2 className="mb-3 text-sm font-semibold text-blue-400">Navigation</h2>
            <nav className="space-y-2 text-sm text-brand-muted">
              <Link
                to="/dashboard"
                state={{ username: usernameFromState }}
                className="block w-full text-left hover:text-brand-text"
              >
                Home
              </Link>
              {/*
              <Link
                to="/dashboard"
                state={{ username: usernameFromState }}
                className="block w-full text-left hover:text-brand-text"
              >
                Explore
              </Link>
              */}
              <span className="block w-full text-left font-semibold text-brand-text">
                Following
              </span>
              <Link
                to="/profile"
                state={{ username: usernameFromState }}
                className="block w-full text-left hover:text-brand-text"
              >
                Profile
              </Link>
              {/*
              <Link
                to="/settings"
                state={{ username: usernameFromState }}
                className="block w-full text-left text-xs text-brand-muted/80 hover:text-brand-text"
              >
                Settings
              </Link>
              */}
            </nav>
          </div>

          {/* Small summary card */}
          <div className="rounded-3xl border border-brand-stroke bg-brand-card-soft px-5 py-4 text-sm text-brand-muted shadow-[0_18px_35px_rgba(0,0,0,0.6)]">
            <h2 className="mb-2 text-sm font-semibold text-blue-400">
              Following feed
            </h2>
            <p className="text-xs">
              This page shows quacks only from ducks you follow.
            </p>
          </div>

          {/* Footer */}
          <div className="rounded-3xl border border-brand-stroke bg-brand-card-soft px-5 py-4 text-xs text-brand-muted shadow-[0_18px_35px_rgba(0,0,0,0.6)]">
            Ducky · {new Date().getFullYear()}
            <br />
            Built with React, TypeScript &amp; Tailwind.
          </div>
        </aside>

        {/* CENTER + RIGHT – posts from people you follow */}
        <section
          className="
            space-y-4 rounded-3xl border border-brand-stroke bg-brand-card-soft
            px-4 py-4 shadow-[0_18px_35px_rgba(0,0,0,0.6)]
            lg:col-span-2
          "
        >
          <div className="mb-2 flex items-center justify-between">
            <h1 className="text-lg font-semibold text-brand-text">
              Posts from people you follow
            </h1>
          </div>

          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}

          {loading && posts.length === 0 && !error && (
            <p className="text-xs text-brand-muted">Loading posts...</p>
          )}

          <div className="divide-y divide-brand-stroke/60">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}

            {!loading && !error && !hasPosts && (
              <p className="py-4 text-sm text-brand-muted">
                No posts yet from people you follow. Once they start posting,
                their posts will show up here.
              </p>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
