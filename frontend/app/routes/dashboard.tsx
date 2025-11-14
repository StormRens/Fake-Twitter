// src/routes/dashboard.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router";

const DUCK_ICON = `${import.meta.env.BASE_URL}DuckIcon.svg`;

type Post = {
  id: number;
  author: string;
  handle: string;
  time: string;
  content: string;
};

type SuggestedUser = {
  id: number;
  name: string;
  handle: string;
};

const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    author: "Duck Dev",
    handle: "@duckdev",
    time: "2m",
    content:
      "Just deployed a new feature on FakeTwitwer 🦆✨ Can’t wait to see what you all post!",
  },
  {
    id: 2,
    author: "Matheus",
    handle: "@mat",
    time: "25m",
    content:
      "In the process of building the FakeTwitwer project. React + TypeScript + Tailwind is starting to hit.",
  },
  {
    id: 3,
    author: "Cloud Coder",
    handle: "@cloudy",
    time: "1h",
    content:
      "Remember: write small commits, and never `git push --force` on main without talking to your team first. 😅",
  },
];

const SUGGESTED_USERS: SuggestedUser[] = [
  { id: 1, name: "Frontend Duck", handle: "@ux_duck" },
  { id: 2, name: "Backend Goose", handle: "@api_goose" },
  { id: 3, name: "Security Swan", handle: "@sec_swan" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [draft, setDraft] = useState("");

  function handleCreatePost(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;

    const newPost: Post = {
      id: Date.now(),
      author: "You",
      handle: "@you",
      time: "now",
      content: text,
    };

    setPosts((prev) => [newPost, ...prev]);
    setDraft("");
  }

  function handleLogout() {
    navigate("/login");
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
                FakeTwitwer
              </div>
              <p className="text-xs text-brand-muted">
                Where the ducks come to post.
              </p>
            </div>
          </div>

          {/* SEARCH BAR */}
          <div className="hidden flex-1 max-w-md items-center rounded-2xl border border-brand-stroke bg-brand-card-soft px-3 py-2 text-sm text-brand-muted sm:flex">
            <input
              type="search"
              placeholder="Search FakeTwitwer"
              className="w-full bg-transparent text-xs text-brand-text placeholder:text-brand-muted focus:outline-none"
            />
          </div>

          {/* USER PILL */}
          <div className="flex items-center gap-3">
            <div className="hidden text-right text-xs sm:block">
              <div className="font-semibold">You</div>
              <div className="text-brand-muted">@you</div>
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
      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)_280px]">
        {/* LEFT SIDEBAR */}
        <aside className="hidden space-y-4 lg:block">
          <div className="rounded-3xl border border-brand-stroke bg-brand-card-soft px-5 py-4 shadow-[0_18px_35px_rgba(0,0,0,0.6)]">
            <h2 className="mb-3 text-sm font-semibold">Navigation</h2>

            <nav className="space-y-2 text-sm text-brand-muted">
              <button className="block w-full text-left font-medium text-brand-text">
                Home
              </button>
              <button className="block w-full text-left hover:text-brand-text">
                Explore
              </button>
              <button className="block w-full text-left hover:text-brand-text">
                Following
              </button>
              <button className="block w-full text-left hover:text-brand-text">
                Profile
              </button>

              <button className="block w-full text-left text-xs text-brand-muted/80 hover:text-brand-text">
                Settings
              </button>
            </nav>
          </div>

          <div className="rounded-3xl border border-brand-stroke bg-brand-card-soft px-5 py-4 text-sm text-brand-muted shadow-[0_18px_35px_rgba(0,0,0,0.6)]">
            <h2 className="mb-2 text-sm font-semibold text-brand-text">
              Your profile
            </h2>
            <p className="text-sm font-medium text-brand-text">You</p>
            <p className="text-xs text-brand-muted">@you</p>
            <p className="mt-3 text-xs">
              This is your public timeline. Once the backend is hooked up, your
              real posts will appear here.
            </p>
          </div>
        </aside>

        {/* FEED */}
        <section className="space-y-4 rounded-3xl border border-brand-stroke bg-brand-card-soft px-4 py-4 shadow-[0_18px_35px_rgba(0,0,0,0.6)]">
          {/* POST COMPOSER */}
          <form onSubmit={handleCreatePost} className="rounded-2xl bg-brand-card/70 p-3">
            <label className="mb-2 block text-sm font-medium">What’s happening?</label>

            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={3}
              maxLength={280}
              placeholder="Share your thoughts with the pond..."
              className="w-full resize-none rounded-2xl border border-brand-stroke/70 bg-[rgba(8,12,26,0.7)] px-3 py-2 text-sm text-brand-text placeholder:text-brand-muted focus:border-[#7aa7ff] focus:outline-none focus:shadow-[0_0_0_4px_rgba(122,167,255,0.18)]"
            />

            <div className="mt-3 flex items-center justify-between text-xs text-brand-muted">
              <span>{280 - draft.length} characters left</span>
              <button
                type="submit"
                disabled={!draft.trim()}
                className="rounded-2xl bg-gradient-to-r from-brand-accent to-brand-accent2 px-4 py-2 text-xs font-semibold text-white shadow-[0_10px_24px_rgba(0,0,0,0.45)] disabled:cursor-not-allowed disabled:opacity-60 hover:brightness-105 hover:shadow-[0_14px_28px_rgba(0,0,0,0.55)]"
              >
                Post
              </button>
            </div>
          </form>

          {/* FEED LIST */}
          <div className="divide-y divide-brand-stroke/60">
            {posts.map((post) => (
              <article key={post.id} className="py-4">
                <header className="mb-1">
                  <div className="text-sm font-semibold">{post.author}</div>
                  <div className="text-xs text-brand-muted">
                    {post.handle} · {post.time}
                  </div>
                </header>
                <p className="text-sm text-brand-text">{post.content}</p>
              </article>
            ))}
          </div>
        </section>

        {/* RIGHT SIDEBAR */}
        <aside className="space-y-4">
          <div className="rounded-3xl border border-brand-stroke bg-brand-card-soft px-5 py-4 text-sm shadow-[0_18px_35px_rgba(0,0,0,0.6)]">
            <h2 className="mb-3 text-sm font-semibold text-brand-text">
              Who to follow
            </h2>

            <ul className="space-y-3">
              {SUGGESTED_USERS.map((user) => (
                <li key={user.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-brand-text">
                      {user.name}
                    </div>
                    <div className="text-xs text-brand-muted">
                      {user.handle}
                    </div>
                  </div>

                  <button className="rounded-2xl bg-brand-card px-3 py-1 text-xs font-medium text-brand-text hover:bg-brand-card-soft">
                    Follow
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-brand-stroke bg-brand-card-soft px-5 py-4 text-xs text-brand-muted shadow-[0_18px_35px_rgba(0,0,0,0.6)]">
            FakeTwitwer · {new Date().getFullYear()}
            <br />
            Built with React, TypeScript & Tailwind.
          </div>
        </aside>
      </main>
    </>
  );
}
