// app/routes/profile.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router";
import PostCard from "../components/PostCard";
import type { Post } from "../types/post";
import UserSearchBar from "../components/UserSearchBar";

const DUCK_ICON = `${import.meta.env.BASE_URL}DuckIcon.svg`;

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const API_USERS_BASE = `${API_BASE_URL}/user`;

type RawPost = {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  date: string;
};

type ProfileResponse = {
  username: string;
  followersCount: number;
  followingCount: number;
  posts: RawPost[];
  isFollowing: boolean;
};

type LocationState = {
  username?: string;        // logged-in user
  profileUsername?: string;  // whose profile we are viewing
};

export default function Profile() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) || {};

  const loggedInUsername = state.username;
  const initialProfileUsername = state.profileUsername || loggedInUsername || null;

  const [profileUsername, setProfileUsername] = useState<string | null>(
    initialProfileUsername
  );
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  const newState = (location.state as LocationState) || {};
  const newProfile =
    newState.profileUsername || newState.username || null;

  setProfileUsername(newProfile);
}, [location.state]);

  const displayName = profileUsername || "You";
  const handle = profileUsername ? `@${profileUsername}` : "@you";

  const pillName = loggedInUsername || "You";
  const pillHandle = loggedInUsername ? `@${loggedInUsername}` : "@you";

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

  async function loadProfile() {
    if (!profileUsername) {
    setError(
      "Missing profile info. Try going back to the dashboard and opening this profile again."
    );
    return;
  }

  setLoading(true);
  setError(null);

  try {
    const res = await axios.get<ProfileResponse>(
      `${API_USERS_BASE}/${profileUsername}/profile`,
      { withCredentials: true }
    );

    const data = res.data;

    setProfileUsername(data.username);
    setFollowersCount(data.followersCount);
    setFollowingCount(data.followingCount);

    const mappedPosts: Post[] = (data.posts || []).map((p) => ({
      _id: p._id,
      userId: p.userId,
      title: p.title,
      description: p.description,
      date: p.date,
      authorUsername: data.username,
    }));

    setPosts(mappedPosts);
  } catch (err: any) {
    console.error("Error loading profile:", err);
    const msg =
      err?.response?.data?.error ||
      err?.message ||
      "Failed to load profile";
    setError(msg);
  } finally {
    setLoading(false);
  }
}

  useEffect(() => {
    void loadProfile();
  }, [profileUsername]);

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
                FakeTwitwer
              </div>
              <p className="text-xs text-brand-muted">
                Where the ducks come to post.
              </p>
            </div>
          </div>

          {/* SEARCH BAR */}
          <UserSearchBar currentUsername={loggedInUsername} />

          {/* USER PILL */}
          <div className="flex items-center gap-3">
            <div className="hidden text-right text-xs sm:block">
              <div className="font-semibold">{pillName}</div>
              <div className="text-brand-muted">{pillHandle}</div>
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
        {/* LEFT COLUMN */}
        <aside className="hidden space-y-4 lg:block">
          {/* Navigation */}
          <div className="rounded-3xl border border-brand-stroke bg-brand-card-soft px-5 py-4 shadow-[0_18px_35px_rgba(0,0,0,0.6)]">
            <h2 className="mb-3 text-sm font-semibold">Navigation</h2>
            <nav className="space-y-2 text-sm text-brand-muted">
              <Link
                to="/dashboard"
                state={{ username: loggedInUsername }}
                className="block w-full text-left hover:text-brand-text"
              >
                Home
              </Link>
              <Link
                to="/dashboard"
                state={{ username: loggedInUsername }}
                className="block w-full text-left hover:text-brand-text"
              >
                Explore
              </Link>
              <Link
                to="/following"
                state={{ username: loggedInUsername }}
                className="block w-full text-left hover:text-brand-text"
              >
                Following
              </Link>
              <span className="block w-full text-left font-medium text-brand-text">
                Profile
              </span>
              <Link
                to="/settings"
                state={{ username: loggedInUsername }}
                className="block w-full text-left text-xs text-brand-muted/80 hover:text-brand-text"
              >
                Settings
              </Link>
            </nav>
          </div>

          {/* Profile summary / stats */}
          <div className="rounded-3xl border border-brand-stroke bg-brand-card-soft px-5 py-4 text-sm text-brand-muted shadow-[0_18px_35px_rgba(0,0,0,0.6)]">
            <h2 className="mb-3 text-sm font-semibold text-brand-text">
              Your profile
            </h2>

            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-card text-sm font-semibold text-brand-text">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-brand-text">
                  {displayName}
                </p>
                <p className="text-xs text-brand-muted">{handle}</p>
              </div>
            </div>

            <p className="text-xs">
              This is your public profile. Your bio, stats and posts are loaded
              from the backend.
            </p>

            <dl className="mt-4 grid grid-cols-3 gap-3 text-center text-xs">
              <div>
                <dt className="text-brand-muted">Posts</dt>
                <dd className="mt-1 text-sm font-semibold text-brand-text">
                  {posts.length}
                </dd>
              </div>
              <div>
                <dt className="text-brand-muted">Followers</dt>
                <dd className="mt-1 text-sm font-semibold text-brand-text">
                  {followersCount}
                </dd>
              </div>
              <div>
                <dt className="text-brand-muted">Following</dt>
                <dd className="mt-1 text-sm font-semibold text-brand-text">
                  {followingCount}
                </dd>
              </div>
            </dl>
          </div>

          {/* Extra info card */}
          <div className="rounded-3xl border border-brand-stroke bg-brand-card-soft px-5 py-4 text-xs text-brand-muted shadow-[0_18px_35px_rgba(0,0,0,0.6)]">
            <p className="mb-1 font-semibold text-brand-text">
              Profile tips
            </p>
            <p>
              As you keep posting on the dashboard, this page will show your
              full timeline and stats pulled from the server.
            </p>
          </div>

          {/* Footer */}
          <div className="rounded-3xl border border-brand-stroke bg-brand-card-soft px-5 py-4 text-xs text-brand-muted shadow-[0_18px_35px_rgba(0,0,0,0.6)]">
            FakeTwitwer · {new Date().getFullYear()}
            <br />
            Built with React, TypeScript &amp; Tailwind.
          </div>
        </aside>

        {/* CENTER + RIGHT – profile header + posts */}
        <section
          className="
            space-y-4 rounded-3xl border border-brand-stroke bg-brand-card-soft
            px-4 py-4 shadow-[0_18px_35px_rgba(0,0,0,0.6)]
            lg:col-span-2
          "
        >
          {/* Profile header */}
          <header className="mb-4 flex flex-col gap-4 border-b border-brand-stroke/60 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-card text-lg font-semibold text-brand-text">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-lg font-semibold text-brand-text">
                  {displayName}
                </h1>
                <p className="text-xs text-brand-muted">{handle}</p>
              </div>
            </div>

            <div className="flex gap-3 text-xs text-brand-muted">
              <div>
                <span className="font-semibold text-brand-text">
                  {posts.length}
                </span>{" "}
                posts
              </div>
              <div>
                <span className="font-semibold text-brand-text">
                  {followersCount}
                </span>{" "}
                followers
              </div>
              <div>
                <span className="font-semibold text-brand-text">
                  {followingCount}
                </span>{" "}
                following
              </div>
            </div>
          </header>

          {/* Errors / loading */}
          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}

          {loading && posts.length === 0 && !error && (
            <p className="text-xs text-brand-muted">Loading profile...</p>
          )}

          {/* Posts list */}
          <div className="divide-y divide-brand-stroke/60">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}

            {!loading && !error && posts.length === 0 && (
              <p className="py-4 text-sm text-brand-muted">
                No posts yet. When you start posting on the dashboard, your
                profile timeline will show them here.
              </p>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
