import React, { useState } from "react";

const DUCK_ICON = `${import.meta.env.BASE_URL}DuckIcon.svg`;

type ProfilePost = {
  id: number;
  content: string;
  createdAt: Date;
};

const INITIAL_POSTS: ProfilePost[] = [
  {
    id: 1,
    content: "First quack from my profile page 🦆",
    createdAt: new Date("2025-11-13T12:00:00"),
  },
  {
    id: 2,
    content: "Can’t wait until the backend is wired so these posts are real.",
    createdAt: new Date("2025-11-13T13:30:00"),
  },
];

const FOLLOWERS = ["Frontend Duck", "Backend Goose", "Security Swan"];
const FOLLOWING = ["Matheus", "Cloud Coder", "YouTube Tutorial Duck"];

function formatDateTime(date: Date) {
  return date.toLocaleString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    month: "short",
    day: "numeric",
  });
}

export default function Profile() {
  const [posts, setPosts] = useState<ProfilePost[]>(INITIAL_POSTS);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState("");

  // ✅ names and usage now match
  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);

  function startEdit(post: ProfilePost) {
    setEditingId(post.id);
    setEditDraft(post.content);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditDraft("");
  }

  function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (editingId === null) return;

    const text = editDraft.trim();
    if (!text) return;

    setPosts((prev) =>
      prev.map((p) =>
        p.id === editingId ? { ...p, content: text } : p
      )
    );
    setEditingId(null);
    setEditDraft("");
  }

  return (
    <>
      {/* MAIN LAYOUT */}
      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">

        {/* PROFILE HEADER CARD */}
        <section className="rounded-3xl border border-brand-stroke bg-brand-card-soft p-5 shadow-[0_18px_35px_rgba(0,0,0,0.6)]">
          <div className="flex items-center gap-4">
            <img
              src={DUCK_ICON}
              alt="Profile avatar"
              className="h-16 w-16 rounded-3xl"
            />
            <div className="space-y-1">
              <h1 className="text-lg font-semibold text-brand-text">
                You
              </h1>
              <p className="text-sm text-brand-muted">@you</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3 text-xs text-brand-muted">
            <button
              onClick={() => setFollowingOpen(true)}
              className="flex items-baseline gap-1 rounded-2xl bg-brand-card px-3 py-1 font-medium text-brand-text hover:bg-brand-card-soft"
            >
              <span className="text-sm font-semibold">
                {FOLLOWING.length}
              </span>
              <span>Following</span>
            </button>

            <button
              onClick={() => setFollowersOpen(true)}
              className="flex items-baseline gap-1 rounded-2xl bg-brand-card px-3 py-1 font-medium text-brand-text hover:bg-brand-card-soft"
            >
              <span className="text-sm font-semibold">
                {FOLLOWERS.length}
              </span>
              <span>Followers</span>
            </button>
          </div>

          <p className="mt-4 text-sm text-brand-text">
            Bio Here
          </p>
        </section>

        {/* POSTS CARD */}
        <section className="rounded-3xl border border-brand-stroke bg-brand-card-soft p-5 shadow-[0_18px_35px_rgba(0,0,0,0.6)]">
          <h2 className="mb-3 text-sm font-semibold text-brand-text">
            Your posts
          </h2>

          {posts.length === 0 && (
            <p className="text-sm text-brand-muted">
              You haven’t posted anything yet from your profile.
            </p>
          )}

          <div className="space-y-4">
            {posts.map((post) => (
              <article
                key={post.id}
                className="rounded-2xl border border-brand-stroke/70 bg-brand-card p-3 text-sm text-brand-text"
              >
                <header className="mb-2 flex items-center justify-between text-xs text-brand-muted">
                  <span>{formatDateTime(post.createdAt)}</span>
                  {editingId !== post.id && (
                    <button
                      onClick={() => startEdit(post)}
                      className="rounded-2xl bg-brand-card-soft px-3 py-1 text-[11px] font-medium text-brand-text hover:bg-brand-card"
                    >
                      Edit
                    </button>
                  )}
                </header>

                {editingId === post.id ? (
                  <form onSubmit={saveEdit} className="space-y-2">
                    <textarea
                      value={editDraft}
                      onChange={(e) => setEditDraft(e.target.value)}
                      rows={3}
                      maxLength={280}
                      className="w-full resize-none rounded-2xl border border-brand-stroke/70 bg-[rgba(8,12,26,0.7)] px-3 py-2 text-sm text-brand-text placeholder:text-brand-muted focus:border-[#7aa7ff] focus:outline-none focus:shadow-[0_0_0_4px_rgba(122,167,255,0.18)]"
                    />
                    <div className="flex justify-end gap-2 text-xs">
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="rounded-2xl border border-brand-stroke px-3 py-1 text-brand-muted hover:bg-brand-card-soft"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="rounded-2xl bg-gradient-to-r from-brand-accent to-brand-accent2 px-4 py-1 text-xs font-semibold text-white shadow-[0_10px_24px_rgba(0,0,0,0.45)] hover:brightness-105 hover:shadow-[0_14px_28px_rgba(0,0,0,0.55)]"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                ) : (
                  <p>{post.content}</p>
                )}
              </article>
            ))}
          </div>
        </section>
      </main>

      {/* FOLLOWERS MODAL */}
      {followersOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-sm rounded-2xl border border-brand-stroke bg-brand-card-soft p-4 text-sm text-brand-text shadow-[0_18px_35px_rgba(0,0,0,0.8)]">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Followers</h3>
              <button
                onClick={() => setFollowersOpen(false)}
                className="text-xs text-brand-muted hover:text-brand-text"
              >
                Close
              </button>
            </div>
            <ul className="space-y-2 text-xs text-brand-muted">
              {FOLLOWERS.map((name) => (
                <li
                  key={name}
                  className="rounded-xl bg-brand-card px-3 py-2"
                >
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* FOLLOWING MODAL */}
      {followingOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-sm rounded-2xl border border-brand-stroke bg-brand-card-soft p-4 text-sm text-brand-text shadow-[0_18px_35px_rgba(0,0,0,0.8)]">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Following</h3>
              <button
                onClick={() => setFollowingOpen(false)}
                className="text-xs text-brand-muted hover:text-brand-text"
              >
                Close
              </button>
            </div>
            <ul className="space-y-2 text-xs text-brand-muted">
              {FOLLOWING.map((name) => (
                <li
                  key={name}
                  className="rounded-xl bg-brand-card px-3 py-2"
                >
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
