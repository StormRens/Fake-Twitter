// app/routes/profile.tsx
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
  username?: string;         // logged-in user
  profileUsername?: string;  // whose profile we are viewing
};

type UserSummary = {
  _id: string;
  username: string;
};

type UsersResponse = {
  users: any[]; // we treat them as any because following[] can be mixed
};

export default function Profile() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) || {};

  const loggedInUsername = state.username;
  const initialProfileUsername =
    state.profileUsername || loggedInUsername || null;

  const [profileUsername, setProfileUsername] = useState<string | null>(
    initialProfileUsername
  );
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false); // <-- needed for button

  const [followListKind, setFollowListKind] = useState<null | "followers" | "following">(null);
  const [followListUsers, setFollowListUsers] = useState<UserSummary[]>([]);
  const [followListLoading, setFollowListLoading] = useState(false);
  const [followListError, setFollowListError] = useState<string | null>(null);

  // If location.state changes (e.g., navigating to another profile),
  // update which profile we are viewing.
  useEffect(() => {
    const newState = (location.state as LocationState) || {};
    const newProfile =
      newState.profileUsername || newState.username || null;

    setProfileUsername(newProfile);
  }, [location.state]);

  const displayName = profileUsername || "You";
  const handle = profileUsername ? `@${profileUsername}` : "@you";

  // pill info for the logged-in user on the top right
  const pillName = loggedInUsername || "You";
  const pillHandle = loggedInUsername ? `@${loggedInUsername}` : "@you";

  const viewingOwnProfile =
    loggedInUsername != null && profileUsername === loggedInUsername;

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
      setIsFollowing(data.isFollowing); // <-- sync from backend

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

  async function openFollowList(kind: "followers" | "following") {
    if (!profileUsername) return;

    setFollowListKind(kind);
    setFollowListLoading(true);
    setFollowListError(null);

    try {
      // 1) load all users (same endpoint you use in dashboard.tsx)
      const res = await axios.get<UsersResponse>(`${API_USERS_BASE}/all`, {
        withCredentials: true,
      });

      const allUsers = res.data.users || [];

      // 2) find the user whose profile we are viewing
      const profileUser = allUsers.find(
        (u: any) => u.username === profileUsername
      );

      if (!profileUser) {
        setFollowListError("Could not find this user.");
        setFollowListLoading(false);
        return;
      }

      const profileId = String(profileUser._id);

      // maps for quick lookup
      const userById = new Map<string, any>();
      const userByUsername = new Map<string, any>();

      for (const u of allUsers) {
        userById.set(String(u._id), u);
        userByUsername.set(String(u.username), u);
      }

      let resultUsers: any[] = [];

      if (kind === "following") {
        // --- who THIS user is following ---
        const rawFollowing = Array.isArray(profileUser.following)
          ? profileUser.following
          : [];

        resultUsers = rawFollowing
          .map((f: any) => {
            if (!f) return null;

            // could be id string
            if (typeof f === "string") {
              return userById.get(f) || userByUsername.get(f) || null;
            }

            // or an embedded user object
            if (typeof f === "object") {
              if (f._id && userById.get(String(f._id))) {
                return userById.get(String(f._id));
              }
              if (f.username && userByUsername.get(String(f.username))) {
                return userByUsername.get(String(f.username));
              }
              return f;
            }

            return null;
          })
          .filter(Boolean);
      } else {
        // --- followers: anyone whose "following" includes this user ---
        const followers: any[] = [];

        for (const u of allUsers) {
          const arr = Array.isArray(u.following) ? u.following : [];

          const followsProfile = arr.some((f: any) => {
            if (!f) return false;

            if (typeof f === "string") {
              return f === profileId || f === profileUsername;
            }

            if (typeof f === "object") {
              return (
                String(f._id) === profileId ||
                String(f.username) === profileUsername
              );
            }

            return false;
          });

          if (followsProfile) {
            followers.push(u);
          }
        }

        resultUsers = followers;
      }

      // 3) store a clean list with just _id + username for the UI
      const cleaned: UserSummary[] = resultUsers.map((u: any) => ({
        _id: String(u._id),
        username: String(u.username),
      }));

      setFollowListUsers(cleaned);
    } catch (err: any) {
      console.error("Error loading follow list:", err);
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        "Failed to load follow list";
      setFollowListError(msg);
    } finally {
      setFollowListLoading(false);
    }
  }

  function closeFollowList() {
    setFollowListKind(null);
    setFollowListUsers([]);
    setFollowListError(null);
  }

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
            <h2 className="mb-3 text-sm font-semibold text-blue-400">Navigation</h2>
            <nav className="space-y-2 text-sm text-brand-muted">
              <Link
                to="/dashboard"
                state={{ username: loggedInUsername }}
                className="block w-full text-left hover:text-brand-text"
              >
                Home
              </Link>
              {/*
              <Link
                to="/dashboard"
                state={{ username: loggedInUsername }}
                className="block w-full text-left hover:text-brand-text"
              >
                Explore
              </Link>
              */}
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
              {/*
              <Link
                to="/settings"
                state={{ username: loggedInUsername }}
                className="block w-full text-left text-xs text-brand-muted/80 hover:text-brand-text"
              >
                Settings
              </Link>
              */}
            </nav>
          </div>

          {/* Profile summary / stats */}
          <div className="rounded-3xl border border-brand-stroke bg-brand-card-soft px-5 py-4 text-sm text-brand-muted shadow-[0_18px_35px_rgba(0,0,0,0.6)]">
            <h2 className="mb-3 text-sm font-semibold text-blue-400">
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
              This is your public profile. You can check all the quacks you’ve made, 
              the ducks you follow, and the ducks that follow you.
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
            <p className="mb-1 font-semibold text-blue-400">
              Profile tips
            </p>
            <p>
              As you keep quacking in the pond, this page will display your full timeline, 
              fetched directly from the backend by Ducky.
            </p>
          </div>

          {/* Footer */}
          <div className="rounded-3xl border border-brand-stroke bg-brand-card-soft px-5 py-4 text-xs text-brand-muted shadow-[0_18px_35px_rgba(0,0,0,0.6)]">
            Ducky · {new Date().getFullYear()}
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

            {/* Follow button: ONLY when viewing someone else's profile */}
            {!viewingOwnProfile && profileUsername && (
              <FollowButton
                targetUsername={profileUsername}
                initialFollowing={isFollowing}
                onChanged={(nowFollowing) => {
                  setIsFollowing(nowFollowing);
                  setFollowersCount((prev) =>
                    Math.max(0, prev + (nowFollowing ? 1 : -1))
                  );
                }}
              />
            )}

            <div className="flex items-center gap-4 text-xs text-brand-muted">

              {/* posts – NOT clickable, but padded to match buttons */}
              <span className="flex items-center gap-1 rounded-full px-2 py-1">
                <span className="font-semibold text-brand-text">{posts.length}</span>
                <span>posts</span>
              </span>

              {/* followers – clickable */}
              <button
                type="button"
                onClick={() => openFollowList("followers")}
                className="flex items-center gap-1 rounded-full px-2 py-1 hover:bg-brand-card-soft/80"
              >
                <span className="font-semibold text-brand-text">{followersCount}</span>
                <span>followers</span>
              </button>

              {/* following – clickable */}
              <button
                type="button"
                onClick={() => openFollowList("following")}
                className="flex items-center gap-1 rounded-full px-2 py-1 hover:bg-brand-card-soft/80"
              >
                <span className="font-semibold text-brand-text">{followingCount}</span>
                <span>following</span>
              </button>

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
              <PostCard
                key={post._id}
                post={post}
                loggedInUsername={loggedInUsername}
                // don't show follow button for posts on the profile page
                showFollowButton={false}
              />
            ))}

            {!loading && !error && posts.length === 0 && (
              <p className="py-4 text-sm text-brand-muted">
                No posts yet. When you start posting on the dashboard, your
                profile timeline will show them here.
              </p>
            )}
          </div>

        </section>
        {followListKind && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60">
            <div className="relative z-[10000] w-full max-w-sm rounded-3xl border border-brand-stroke bg-slate-950 p-4 text-sm shadow-[0_18px_35px_rgba(0,0,0,0.9)]">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-base font-semibold text-brand-text">
                  {followListKind === "followers" ? "Followers" : "Following"} ·{" "}
                  {displayName}
                </h2>
                <button
                  type="button"
                  className="text-xs text-brand-muted hover:text-brand-text"
                  onClick={closeFollowList}
                >
                  Close
                </button>
              </div>

              {followListLoading && (
                <p className="text-xs text-brand-muted">Loading…</p>
              )}

              {followListError && (
                <p className="text-xs text-red-400">{followListError}</p>
              )}

              {!followListLoading &&
                !followListError &&
                followListUsers.length === 0 && (
                  <p className="text-xs text-brand-muted">
                    No users in this list yet.
                  </p>
                )}

              <ul className="mt-2 space-y-2">
                {followListUsers.map((u) => (
                  <li
                    key={u._id}
                    className="flex items-center justify-between"
                  >
                    <button
                      type="button"
                      className="flex items-center gap-2 text-left"
                      onClick={() => {
                        closeFollowList();
                        navigate("/profile", {
                          state: {
                            username: loggedInUsername,    // logged-in user
                            profileUsername: u.username,   // profile to view
                          },
                        });
                      }}
                    >
                      {/* Avatar */}
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-card text-xs font-semibold text-brand-text">
                        {u.username.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        {/* Username with its own underline hover */}
                        <div className="text-sm font-medium text-brand-text hover:underline cursor-pointer">
                          {u.username}
                        </div>

                        {/* @handle with its own underline hover */}
                        <div className="text-[10px] text-brand-muted hover:underline cursor-pointer">
                          @{u.username}
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>



            </div>
          </div>
        )}

      </main>
    </>
  );
}
