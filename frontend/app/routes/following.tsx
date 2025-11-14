// src/routes/following.tsx
import React from "react";
import { useNavigate } from "react-router";

const DUCK_ICON = `${import.meta.env.BASE_URL}DuckIcon.svg`;

type FollowingUser = {
  id: number;
  name: string;
  handle: string;
  bio: string;
};

const FOLLOWING: FollowingUser[] = [
  {
    id: 1,
    name: "Frontend Duck",
    handle: "@ux_duck",
    bio: "Design nerd. Making buttons feel nice since 2020.",
  },
  {
    id: 2,
    name: "Backend Goose",
    handle: "@api_goose",
    bio: "I speak REST, JSON and sometimes gRPC.",
  },
  {
    id: 3,
    name: "Security Swan",
    handle: "@sec_swan",
    bio: "If you store passwords in plain text, we need to talk.",
  },
];

export default function Following() {
  const navigate = useNavigate();

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
      <main
        className="
          mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6
          lg:grid-cols-[260px_minmax(0,1fr)_minmax(0,1fr)]
        "
      >
        {/* LEFT COLUMN – nav + info + suggestions + footer */}
        <aside className="hidden space-y-4 lg:block">
          {/* Navigation */}
          <div className="rounded-3xl border border-brand-stroke bg-brand-card-soft px-5 py-4 shadow-[0_18px_35px_rgba(0,0,0,0.6)]">
            <h2 className="mb-3 text-sm font-semibold">Navigation</h2>
            <nav className="space-y-2 text-sm text-brand-muted">
              <button className="block w-full text-left hover:text-brand-text">
                Home
              </button>
              <button className="block w-full text-left hover:text-brand-text">
                Explore
              </button>
              <button className="block w-full text-left font-semibold text-brand-text">
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

          {/* Following summary */}
          <div className="rounded-3xl border border-brand-stroke bg-brand-card-soft px-5 py-4 text-sm text-brand-muted shadow-[0_18px_35px_rgba(0,0,0,0.6)]">
            <h2 className="mb-2 text-sm font-semibold text-brand-text">
              Following
            </h2>
            <p className="text-xs">
              You’re currently following {FOLLOWING.length} accounts. Their
              posts will appear in your Home feed.
            </p>
          </div>

          {/* Suggestions / info card */}
          <div className="rounded-3xl border border-brand-stroke bg-brand-card-soft px-5 py-4 text-xs text-brand-muted shadow-[0_18px_35px_rgba(0,0,0,0.6)]">
            <p className="mb-1">
              Tip: later you could add a search box here or a “Discover” tab
              that calls a real recommendations API.
            </p>
            <p>For now, this page just uses static example data.</p>
          </div>

          {/* Footer */}
          <div className="rounded-3xl border border-brand-stroke bg-brand-card-soft px-5 py-4 text-xs text-brand-muted shadow-[0_18px_35px_rgba(0,0,0,0.6)]">
            FakeTwitwer · {new Date().getFullYear()}
            <br />
            Built with React, TypeScript & Tailwind.
          </div>
        </aside>

        {/* CENTER + RIGHT – list of people you follow */}
        <section
          className="
            space-y-4 rounded-3xl border border-brand-stroke bg-brand-card-soft
            px-4 py-4 shadow-[0_18px_35px_rgba(0,0,0,0.6)]
            lg:col-span-2
          "
        >
          <div className="mb-2 flex items-center justify-between">
            <h1 className="text-lg font-semibold text-brand-text">
              People you follow
            </h1>
            <p className="text-xs text-brand-muted">
              {FOLLOWING.length} accounts
            </p>
          </div>

          <div className="space-y-3">
            {FOLLOWING.map((user) => (
              <article
                key={user.id}
                className="flex items-start justify-between rounded-2xl bg-brand-card/80 p-3"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-accent to-brand-accent2 text-xs font-semibold">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-brand-text">
                      {user.name}
                    </div>
                    <div className="text-xs text-brand-muted">
                      {user.handle}
                    </div>
                    <p className="mt-1 text-xs text-brand-text/90">
                      {user.bio}
                    </p>
                  </div>
                </div>
                <button className="mt-1 rounded-2xl border border-brand-stroke px-3 py-1 text-xs font-medium text-brand-text hover:bg-brand-card">
                  Following
                </button>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
