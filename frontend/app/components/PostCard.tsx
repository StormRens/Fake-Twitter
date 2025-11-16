// app/components/PostCard.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import type { Post } from "../types/post";
import FollowButton from "./FollowButton";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const API_USERS_BASE = `${API_BASE_URL}/user`;

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "";

  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin}m`;
  if (diffHour < 24) return `${diffHour}h`;
  if (diffDay === 1) return "1d";
  return `${diffDay}d`;
}

type AuthorProfileResponse = {
  isFollowing: boolean;
};

type PostCardProps = {
  post: Post;
  loggedInUsername?: string;

  // shared follow status from parent (PostFeed, etc.)
  knownFollowStatus?: boolean;
  onFollowStatusChange?: (username: string, nowFollowing: boolean) => void;

  // 👇 NEW: allow hiding the follow button for some contexts (like profile page)
  showFollowButton?: boolean;
};

export default function PostCard({
  post,
  loggedInUsername,
  knownFollowStatus,
  onFollowStatusChange,
  showFollowButton = true, // default: show it
}: PostCardProps) {
  const username = post.authorUsername ?? "Unknown duck";
  const handle = `@${username}`;
  const timeAgo = post.date ? formatTimeAgo(post.date) : "";

  const initial = username.charAt(0).toUpperCase() || "D";

  const isOwnPost =
    loggedInUsername != null &&
    username != null &&
    loggedInUsername === username;

  const [isFollowingAuthor, setIsFollowingAuthor] = useState(
    knownFollowStatus ?? false
  );

  // keep local state in sync with parent
  useEffect(() => {
    if (typeof knownFollowStatus === "boolean") {
      setIsFollowingAuthor(knownFollowStatus);
    }
  }, [knownFollowStatus]);

  // fetch follow status if parent doesn't already know
  useEffect(() => {
    if (!username || isOwnPost) return;

    let cancelled = false;

    const fetchFollowStatus = async () => {
      try {
        const res = await axios.get<AuthorProfileResponse>(
          `${API_USERS_BASE}/${username}/profile`,
          { withCredentials: true }
        );

        if (!cancelled) {
          setIsFollowingAuthor(res.data.isFollowing);
          onFollowStatusChange?.(username, res.data.isFollowing);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Error fetching follow status for", username, err);
        }
      }
    };

    if (typeof knownFollowStatus !== "boolean") {
      void fetchFollowStatus();
    }

    return () => {
      cancelled = true;
    };
  }, [username, isOwnPost, knownFollowStatus, onFollowStatusChange]);

  return (
    <article className="flex gap-3 px-3 py-4 text-sm hover:bg-brand-card-soft/70">
      {/* Avatar */}
      <div
        className="
          flex h-9 w-9 items-center justify-center rounded-full
          bg-gradient-to-br from-brand-accent to-brand-accent2
          text-xs font-semibold text-white shadow-[0_4px_12px_rgba(0,0,0,0.45)]
        "
      >
        {initial}
      </div>

      {/* Main content */}
      <div className="min-w-0 flex-1">
        {/* Header row */}
        <header className="flex items-start gap-2">
          <div className="min-w-0">
            <span className="block truncate text-sm font-semibold text-brand-text">
              {username}
            </span>
            <span className="block truncate text-xs text-brand-muted">
              {handle}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* 👇 only show follow button when:
                 - this is not your own post
                 - AND the parent allowed it via showFollowButton */}
            {showFollowButton && !isOwnPost && (
              <FollowButton
                targetUsername={username}
                initialFollowing={isFollowingAuthor}
                onChanged={(nowFollowing) => {
                  setIsFollowingAuthor(nowFollowing);
                  onFollowStatusChange?.(username, nowFollowing);
                }}
              />
            )}

            {timeAgo && (
              <span className="whitespace-nowrap text-xs text-brand-muted">
                · {timeAgo}
              </span>
            )}
          </div>
        </header>

        <div className="mt-1 whitespace-pre-wrap break-words text-[0.9rem] text-brand-text">
          <p>{post.title}</p>
          {post.description &&
            post.description.trim() !== post.title.trim() && (
              <p className="mt-1 text-xs text-brand-muted">
                {post.description}
              </p>
            )}
        </div>
      </div>
    </article>
  );
}
