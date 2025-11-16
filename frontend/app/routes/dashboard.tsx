// app/routes/dashboard.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router";
import PostFeed from "../components/PostFeed";
import UserSearchBar from "../components/UserSearchBar";
import FollowButton from "../components/FollowButton";

const DUCK_ICON = `${import.meta.env.BASE_URL}DuckIcon.svg`;
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const API_USERS_BASE = `${API_BASE_URL}/user`;

type ProfileResponse = {
  username: string;
  followersCount: number;
  followingCount: number;
  posts: any[];
  isFollowing: boolean;
};

type LocationState = {
  username?: string;
};

type UserSummary = {
  _id: string;
  username: string;
  email?: string;
};

type UsersResponse = {
  users: UserSummary[];
};

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) || {};

  // If login passed a username, use it; otherwise fall back to generic.
  const username = state.username || "You";
  const handle = state.username ? `@${state.username}` : "@you";

  const [loggingOut, setLoggingOut] = useState(false);
  const [suggestedUsers, setSuggestedUsers] = useState<UserSummary[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [suggestionsError, setSuggestionsError] = useState<string | null>(null);

  async function loadWhoToFollow() {
    if (!state.username) return;

    setSuggestionsLoading(true);
    setSuggestionsError(null);

    try {
      // 1) Get all users
      const res = await axios.get<UsersResponse>(
        `${API_USERS_BASE}/all`,
        { withCredentials: true }
      );

      // NOTE: we treat the items as "any" so we can look for following[]
      const allUsers: any[] = res.data.users || [];

      // 2) Find "me"
      const me = allUsers.find((u) => u.username === state.username);

      // 3) Build a set of IDs/usernames that I already follow
      const followingSet = new Set<string>();

      if (me && Array.isArray(me.following)) {
        for (const f of me.following) {
          if (!f) continue;

          // could be an id string
          if (typeof f === "string") {
            followingSet.add(f);
          } else if (typeof f === "object") {
            // or an embedded user object
            if (f._id) followingSet.add(f._id as string);
            if (f.username) followingSet.add(f.username as string);
          }
        }
      }

      // 4) Candidates: everyone except me, and not already followed
      const candidates = allUsers.filter((u) => {
        if (u.username === state.username) return false;

        // If we don't have any following info, show them (not following anyone)
        if (followingSet.size === 0) return true;

        const id = String(u._id);
        const uname = String(u.username);

        return !followingSet.has(id) && !followingSet.has(uname);
      });

      // 5) Limit how many we show
      setSuggestedUsers(candidates.slice(0, 5));
    } catch (err: any) {
      console.error("Error loading who to follow:", err);
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        "Failed to load suggestions";
      setSuggestionsError(msg);
    } finally {
      setSuggestionsLoading(false);
    }
  }

  function handleGlobalFollowChange(
    targetUsername: string,
    nowFollowing: boolean
  ) {
    setSuggestedUsers((prev) => {
      if (nowFollowing) {
        // Just followed this user → remove from suggestions
        return prev.filter((u) => u.username !== targetUsername);
      } else {
        // For unfollow, don't touch the local list here.
        // We'll re-fetch from the backend so the sidebar stays correct.
        return prev;
      }
    });

    if (!nowFollowing) {
      // Just UNfollowed someone → refresh "Who to follow" from /user/all
      void loadWhoToFollow();
    }
  }


  async function handleLogout() {
    setLoggingOut(true);
    try {
      await axios.post(
        `${API_BASE_URL}/auth/logout`,
        null,
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Logout error:", err);
      // Even if logout fails, we still send user back to login.
    } finally {
      setLoggingOut(false);
      navigate("/login");
    }
  }

  useEffect(() => {
    void loadWhoToFollow();
  }, [state.username]);

  return (
    <>
      {/* TOP NAVBAR */}
      <header className="border-b border-brand-stroke/60 bg-brand-card">
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
          <UserSearchBar currentUsername={state.username} />

          {/* USER PILL */}
          <div className="flex items-center gap-3">
            <div className="hidden text-right text-xs sm:block">
              <div className="font-semibold">{username}</div>
              <div className="text-brand-muted">{handle}</div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="rounded-2xl bg-brand-card-soft px-3 py-2 text-xs font-medium text-brand-muted hover:bg-brand-card hover:text-brand-text disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loggingOut ? "Logging out..." : "Log out"}
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
        {/* LEFT SIDEBAR */}
        <aside className="hidden space-y-4 lg:block">
          {/* Navigation */}
          <div className="rounded-3xl border border-brand-stroke bg-brand-card-soft px-5 py-4 shadow-[0_18px_35px_rgba(0,0,0,0.6)]">
            <h2 className="mb-3 text-sm font-semibold">Navigation</h2>

            <nav className="space-y-2 text-sm text-brand-muted">
              <Link
                to="/dashboard"
                state={{ username: state.username }}
                className="block w-full text-left font-medium text-brand-text"
              >
                Home
              </Link>

              {/* These can be wired later when pages exist */}
              <Link
                to="/dashboard"
                state={{ username: state.username }}
                className="block w-full text-left hover:text-brand-text"
              >
                Explore
              </Link>

              <Link
                to="/following"
                state={{ username: state.username }}
                className="block w-full text-left hover:text-brand-text"
              >
                Following
              </Link>

              <Link
                to="/profile"
                state={{ username: state.username }}
                className="block w-full text-left hover:text-brand-text"
              >
                Profile
              </Link>

              <Link
                to="/settings"
                state={{ username: state.username }}
                className="block w-full text-left text-xs text-brand-muted/80 hover:text-brand-text"
              >
                Settings
              </Link>
            </nav>
          </div>

          {/* Profile summary */}
          <div className="rounded-3xl border border-brand-stroke bg-brand-card-soft px-5 py-4 text-sm text-brand-muted shadow-[0_18px_35px_rgba(0,0,0,0.6)]">
            <h2 className="mb-2 text-sm font-semibold text-brand-text">
              Your profile
            </h2>
            <p className="text-sm font-medium text-brand-text">{username}</p>
            <p className="text-xs text-brand-muted">{handle}</p>
            <p className="mt-3 text-xs">
              This is your public timeline. Once the backend is hooked up, your
              real posts will appear here.
            </p>
          </div>

          {/* Who to follow */}
          <div className="rounded-3xl border border-brand-stroke bg-brand-card-soft px-5 py-4 text-sm shadow-[0_18px_35px_rgba(0,0,0,0.6)]">
            <h2 className="mb-3 text-sm font-semibold text-brand-text">
              Who to follow
            </h2>

            {suggestionsError && (
              <p className="mb-2 text-xs text-red-400">{suggestionsError}</p>
            )}

            {suggestionsLoading && !suggestionsError && (
              <p className="mb-2 text-xs text-brand-muted">
                Loading suggestions...
              </p>
            )}

            <ul className="space-y-3">
              {suggestedUsers.map((user) => (
                <li
                  key={user._id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium text-brand-text">
                      {user.username}
                    </div>
                    <div className="text-xs text-brand-muted">
                      @{user.username}
                    </div>
                  </div>

                  <FollowButton
                    targetUsername={user.username}
                    onChanged={(nowFollowing) =>
                      handleGlobalFollowChange(user.username, nowFollowing)
                    }
                  />
                </li>
              ))}

              {!suggestionsLoading &&
                !suggestionsError &&
                suggestedUsers.length === 0 && (
                  <li className="text-xs text-brand-muted">
                    No suggestions right now.
                  </li>
                )}
            </ul>
          </div>

          {/* Footer */}
          <div className="rounded-3xl border border-brand-stroke bg-brand-card-soft px-5 py-4 text-xs text-brand-muted shadow-[0_18px_35px_rgba(0,0,0,0.6)]">
            FakeTwitwer · {new Date().getFullYear()}
            <br />
            Built with React, TypeScript &amp; Tailwind.
          </div>
        </aside>

        {/* CENTER (Post Composer + Feed) */}
        <PostFeed
          loggedInUsername={state.username}
          onFollowChange={handleGlobalFollowChange}
        />
      </main>
    </>
  );
}
