// app/routes/dashboard.tsx
import React from "react";
import PostFeed from "../components/PostFeed";

const DUCK_ICON = `${import.meta.env.BASE_URL}DuckIcon.svg`;

export default function Dashboard() {
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

            <a
              href="/login"
              className="rounded-2xl bg-brand-card-soft px-3 py-2 text-xs font-medium text-brand-muted hover:bg-brand-card hover:text-brand-text"
            >
              Log out
            </a>
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
              <a
                href="/dashboard"
                className="block w-full text-left font-medium text-brand-text"
              >
                Home
              </a>

              <a
                href="/dashboard"
                className="block w-full text-left hover:text-brand-text"
              >
                Explore
              </a>

              <a
                href="/following"
                className="block w-full text-left hover:text-brand-text"
              >
                Following
              </a>

              <a
                href="/profile"
                className="block w-full text-left hover:text-brand-text"
              >
                Profile
              </a>

              <a
                href="/settings"
                className="block w-full text-left text-xs text-brand-muted/80 hover:text-brand-text"
              >
                Settings
              </a>
            </nav>
          </div>

          {/* Profile summary */}
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

          {/* Who to follow */}
          <div className="rounded-3xl border border-brand-stroke bg-brand-card-soft px-5 py-4 text-sm shadow-[0_18px_35px_rgba(0,0,0,0.6)]">
            <h2 className="mb-3 text-sm font-semibold text-brand-text">
              Who to follow
            </h2>
            <ul className="space-y-3">
              <li className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-brand-text">
                    Frontend Duck
                  </div>
                  <div className="text-xs text-brand-muted">@ux_duck</div>
                </div>
                <button className="rounded-2xl bg-brand-card px-3 py-1 text-xs font-medium text-brand-text hover:bg-brand-card-soft">
                  Follow
                </button>
              </li>

              <li className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-brand-text">
                    Backend Goose
                  </div>
                  <div className="text-xs text-brand-muted">@api_goose</div>
                </div>
                <button className="rounded-2xl bg-brand-card px-3 py-1 text-xs font-medium text-brand-text hover:bg-brand-card-soft">
                  Follow
                </button>
              </li>
            </ul>
          </div>

          {/* Footer */}
          <div className="rounded-3xl border border-brand-stroke bg-brand-card-soft px-5 py-4 text-xs text-brand-muted shadow-[0_18px_35px_rgba(0,0,0,0.6)]">
            FakeTwitwer · {new Date().getFullYear()}
            <br />
            Built with React, TypeScript & Tailwind.
          </div>
        </aside>

        {/* CENTER (Post Composer + Feed) */}
        <PostFeed />
      </main>
    </>
  );
}
