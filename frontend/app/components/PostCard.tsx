// app/components/PostCard.tsx
import React from "react";
import type { Post } from "../types/post";

function formatTimeAgo(dateStr: string): string {
  // Very simple "time ago" formatter; good for now.
  // Can replace this later with a library like dayjs wanted.
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

type PostCardProps = {
  post: Post;
};

export default function PostCard({ post }: PostCardProps) {
  const username = post.authorUsername ?? "Unknown duck";
  const handle = `@${username}`;
  const timeAgo = post.date ? formatTimeAgo(post.date) : "";

  // Tiny avatar just using the first letter of username
  const initial = username.charAt(0).toUpperCase() || "D";

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
        <header className="flex items-baseline gap-2">
          <span className="truncate text-sm font-semibold text-brand-text">
            {username}
          </span>
          <span className="truncate text-xs text-brand-muted">{handle}</span>
          {timeAgo && (
            <span className="ml-auto whitespace-nowrap text-xs text-brand-muted">
              · {timeAgo}
            </span>
          )}
        </header>

        {/* Body */}
        <div className="mt-1 whitespace-pre-wrap break-words text-[0.9rem] text-brand-text">
          {/* For now we use the title as the main content, and
             description if present as a smaller extra line. */}
          <p>{post.title}</p>
          {post.description && post.description.trim() !== post.title.trim() && (
            <p className="mt-1 text-xs text-brand-muted">
              {post.description}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
