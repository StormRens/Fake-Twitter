// app/components/FollowButton.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

type FollowButtonProps = {
  targetUsername: string;
  /** value coming from parent (profile / postcard) based on API */
  initialFollowing?: boolean;
  /** optional callback so parent can update counts etc. */
  onChanged?: (nowFollowing: boolean) => void;
};

export default function FollowButton({
  targetUsername,
  initialFollowing = false,
  onChanged,
}: FollowButtonProps) {
  // Local state for what this button *thinks* the current status is
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // IMPORTANT FIX:
  // Whenever the parent changes `initialFollowing` (e.g. after reload +
  // API response), we sync our local state to match it.
  useEffect(() => {
    setIsFollowing(initialFollowing);
  }, [initialFollowing]);

  async function doFollow() {
    setLoading(true);
    setError(null);
    try {
      await axios.post(
        `${API_BASE_URL}/user/${targetUsername}/follow`,
        null,
        { withCredentials: true }
      );
      setIsFollowing(true);
      onChanged?.(true);
    } catch (err: any) {
      console.error("Follow error:", err);
      setError(err?.response?.data?.error || "Failed to follow");
    } finally {
      setLoading(false);
    }
  }

  async function doUnfollow() {
    setLoading(true);
    setError(null);
    try {
      await axios.post(
        `${API_BASE_URL}/user/${targetUsername}/unfollow`,
        null,
        { withCredentials: true }
      );
      setIsFollowing(false);
      onChanged?.(false);
    } catch (err: any) {
      console.error("Unfollow error:", err);
      setError(err?.response?.data?.error || "Failed to unfollow");
    } finally {
      setLoading(false);
    }
  }

  function handleClick() {
    if (loading) return;
    if (isFollowing) {
      void doUnfollow();
    } else {
      void doFollow();
    }
  }

  const label = loading
    ? isFollowing
      ? "Unfollowing..."
      : "Following..."
    : isFollowing
    ? "Following"
    : "Follow";

  return (
    <div className="flex flex-col items-end">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={`
          rounded-2xl px-3 py-1 text-xs font-medium
          transition-all duration-150
          ${
            isFollowing
              ? "bg-brand-card-soft text-brand-muted hover:bg-brand-card"
              : "bg-brand-card text-brand-text hover:bg-brand-card-soft"
          }
          disabled:opacity-60 disabled:cursor-not-allowed
        `}
      >
        {label}
      </button>

      {error && (
        <p className="mt-1 text-[10px] text-red-400">{error}</p>
      )}
    </div>
  );
}
