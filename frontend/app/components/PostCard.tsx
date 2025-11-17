// app/components/PostCard.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router"; // NEW
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

  // allow hiding the follow button for some contexts (like profile page)
  showFollowButton?: boolean;

  // NEW: callbacks for edit/delete
  onDelete?: (postId: string) => Promise<void> | void;
  onEdit?: (postId: string, newTitle: string) => Promise<void> | void;
};

export default function PostCard({
  post,
  loggedInUsername,
  knownFollowStatus,
  onFollowStatusChange,
  showFollowButton = true,
  onDelete,
  onEdit,
}: PostCardProps) {
  const navigate = useNavigate(); // 👈 NEW

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

  // NEW: menu & edit state
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(post.title);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // keep local follow state in sync with parent
  useEffect(() => {
    if (typeof knownFollowStatus === "boolean") {
      setIsFollowingAuthor(knownFollowStatus);
    }
  }, [knownFollowStatus]);

  // keep edit text synced if parent updates title
  useEffect(() => {
    setEditText(post.title);
  }, [post.title]);

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

  //  open this author's profile when clicking avatar/name
  function openProfile() {
    if (!username || username === "Unknown duck") return;

    navigate("/profile", {
      state: {
        // who is logged in
        username: loggedInUsername,
        // whose profile we want to view
        profileUsername: username,
      },
    });
  }

  //  handle delete click from the menu
  async function handleDeleteClick() {
    if (!onDelete || !post._id) return;

    const confirmed = window.confirm(
      "Delete this post? This action cannot be undone."
    );
    if (!confirmed) return;

    setDeleteError(null);
    try {
      await onDelete(post._id);
    } catch (err: any) {
      console.error("Delete post error:", err);
      setDeleteError(
        err?.response?.data?.error || err?.message || "Failed to delete post"
      );
    } finally {
      setMenuOpen(false);
    }
  }

  // handle saving an edit
  async function handleSaveEdit() {
    if (!onEdit || !post._id) {
      setIsEditing(false);
      return;
    }

    const trimmed = editText.trim();
    if (!trimmed) {
      // don't send empty posts
      return;
    }

    setSavingEdit(true);
    setEditError(null);

    try {
      await onEdit(post._id, trimmed);
      setIsEditing(false);
    } catch (err: any) {
      console.error("Edit post error:", err);
      setEditError(
        err?.response?.data?.error || err?.message || "Failed to edit post"
      );
    } finally {
      setSavingEdit(false);
    }
  }

  function handleCancelEdit() {
    setIsEditing(false);
    setEditText(post.title);
    setEditError(null);
  }

  return (
    <article className="flex gap-3 px-3 py-4 text-sm hover:bg-brand-card-soft/70">
      {/* Avatar (clickable) */}
      <button
        type="button"
        onClick={openProfile}
        className="
          flex h-9 w-9 items-center justify-center rounded-full
          bg-gradient-to-br from-brand-accent to-brand-accent2
          text-xs font-semibold text-white shadow-[0_4px_12px_rgba(0,0,0,0.45)]
          cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-accent
        "
      >
        {initial}
      </button>

      {/* Main content */}
      <div className="min-w-0 flex-1">
        {/* Header row */}
        <header className="flex items-start gap-2">
          {/* Name + handle (also clickable) */}
          <button
            type="button"
            onClick={openProfile}
            className="min-w-0 text-left cursor-pointer"
          >
            <span className="block truncate text-sm font-semibold text-blue-300 hover:underline">
              {username}
            </span>
            <span className="block truncate text-xs text-brand-muted hover:underline">
              {handle}
            </span>
          </button>

          <div className="ml-auto flex items-center gap-2">
            {/* Other people's posts → follow button */}
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

            {/* Own posts → 3-dots menu */}
            {isOwnPost && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen((open) => !open)}
                  className="
                    flex h-7 w-7 items-center justify-center rounded-full
                    bg-brand-card-soft text-brand-muted
                    hover:bg-brand-card hover:text-brand-text
                    focus:outline-none focus:ring-2 focus:ring-brand-accent
                  "
                >
                  <span className="sr-only">Post options</span>
                  {/* simple three-dot icon */}
                  <span className="text-lg leading-none">⋯</span>
                </button>

                {menuOpen && (
                  <div
                    className="
                      absolute right-0 z-20 mt-2 w-32 rounded-xl
                      border border-brand-stroke 
                      bg-[#14274e]
                      text-xs text-brand-text
                      shadow-[0_14px_30px_rgba(0,0,0,0.75)]
                    "
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(true);
                        setMenuOpen(false);
                      }}
                      className="
                        block w-full px-3 py-2 text-left hover:bg-brand-card
                      "
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteClick}
                      className="
                        block w-full px-3 py-2 text-left text-red-400
                        hover:bg-red-500/10
                      "
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}

            {timeAgo && (
              <span className="whitespace-nowrap text-xs text-brand-muted">
                · {timeAgo}
              </span>
            )}
          </div>
        </header>

        {/* Body: either edit mode or display mode */}
        <div className="mt-1 whitespace-pre-wrap break-words text-[0.9rem] text-brand-text">
          {isEditing ? (
            <div>
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={3}
                maxLength={300}
                className="
                  w-full resize-none rounded-2xl border border-brand-stroke/70
                  bg-[rgba(8,12,26,0.7)] px-3 py-2 text-sm text-brand-text
                  placeholder:text-brand-muted focus:border-[#7aa7ff]
                  focus:outline-none focus:shadow-[0_0_0_4px_rgba(122,167,255,0.18)]
                "
              />

              <div className="mt-2 flex gap-2 text-xs">
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  disabled={savingEdit || !editText.trim()}
                  className="
                    rounded-2xl bg-brand-card px-3 py-1 font-semibold
                    text-brand-text hover:bg-brand-card-soft
                    disabled:cursor-not-allowed disabled:opacity-60
                  "
                >
                  {savingEdit ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="
                    rounded-2xl border border-brand-stroke px-3 py-1
                    text-brand-muted hover:bg-brand-card-soft
                  "
                >
                  Cancel
                </button>
              </div>

              {editError && (
                <p className="mt-1 text-[10px] text-red-400">{editError}</p>
              )}
            </div>
          ) : (
            <>
              <p>{post.title}</p>
              {post.description &&
                post.description.trim() !== post.title.trim() && (
                  <p className="mt-1 text-xs text-brand-muted">
                    {post.description}
                  </p>
                )}
            </>
          )}

          {deleteError && (
            <p className="mt-2 text-[10px] text-red-400">{deleteError}</p>
          )}
        </div>
      </div>
    </article>
  );
}
