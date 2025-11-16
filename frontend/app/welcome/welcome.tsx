import React from "react";
import { Link } from "react-router";

const DUCK_ICON = `${import.meta.env.BASE_URL}DuckIcon.svg`;

export function Welcome() {
  return (
    <main
  className="
    min-h-svh
    flex items-center justify-center
    px-4 py-12
    text-brand-text
    bg-[#070d1f] 
  "
>
      <div className="relative w-full max-w-5xl">
        {/* Soft background orbs, lighter than the AuthLayout ones */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="
              absolute -left-40 -top-32 h-72 w-72 rounded-full
              bg-[radial-gradient(circle_at_center,#6b9cff,transparent_60%)]
              opacity-55 blur-3xl
              animate-[orb-float_7s_ease-in-out_infinite]
            "
          />
          <div
            className="
              absolute bottom-[-5rem] right-10 h-64 w-64 rounded-full
              bg-[radial-gradient(circle_at_center,#3dd3b0,transparent_60%)]
              opacity-45 blur-3xl
              animate-[orb-float-2_8s_ease-in-out_infinite]
            "
          />
          <div
            className="
              absolute -right-40 top-[45%] -translate-y-1/2 h-72 w-72 rounded-full
              bg-[radial-gradient(circle_at_center,#9a6bff,transparent_60%)]
              opacity-55 blur-3xl
              animate-[orb-float-3_6s_ease-in-out_infinite]
            "
          />
        </div>

        {/* Main card */}
        <section
          className="
            relative z-10 flex flex-col gap-10
            rounded-3xl border border-brand-stroke
            [background:linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))]
            shadow-[0_24px_60px_rgba(0,0,0,0.6)]
            backdrop-blur-2xl
            px-6 py-8 sm:px-10 sm:py-10
            lg:flex-row lg:items-center
          "
        >
          {/* Left: hero copy */}
          <div className="flex-1">
            <div className="mb-6 flex items-center gap-4">
              <img
                src={DUCK_ICON}
                alt="FakeTwitwer logo"
                className="h-16 w-16 rounded-2xl"
              />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-muted">
                  Welcome to
                </p>
                <h1 className="text-3xl font-semibold sm:text-4xl">
                  Ducky
                </h1>
                <p className="text-xs text-brand-muted">
                  Where the ducks come to Quack.
                </p>
              </div>
            </div>

            <p className="max-w-md text-sm sm:text-base text-brand-muted">
              Share quick thoughts, follow your favorite ducks, and keep your
              pond updated in real time. Minimal, cozy, and built with React,
              TypeScript &amp; Node.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to="/login"
                className="
                  inline-flex items-center justify-center
                  rounded-2xl
                  bg-gradient-to-r from-[#4f8cff] to-[#8b5dff]
                  px-5 py-3 text-sm font-semibold text-white
                  shadow-[0_12px_30px_rgba(0,0,0,0.45)]
                  transition-transform duration-150
                  hover:translate-y-0.5
                "
              >
                Sign in
              </Link>

              <Link
                to="/register"
                className="
                  inline-flex items-center justify-center
                  rounded-2xl border border-[rgba(142,176,255,0.45)]
                  bg-[rgba(8,12,26,0.6)]
                  px-5 py-3 text-sm font-semibold
                  text-brand-text
                  hover:bg-[rgba(8,12,26,0.9)]
                  transition-colors duration-150
                "
              >
                Create account
              </Link>

              <a
                href="https://github.com/StormRens/Fake-Twitter.git"
                target="_blank"
                rel="noreferrer"
                className="
                  inline-flex items-center justify-center gap-2
                  rounded-2xl border border-[rgba(142,176,255,0.28)]
                  bg-[rgba(5,10,25,0.7)]
                  px-4 py-3 text-xs font-medium
                  text-brand-muted hover:text-brand-text
                  hover:border-[rgba(142,176,255,0.6)]
                  transition-colors duration-150
                "
              >
                <span className="h-2 w-2 rounded-full bg-[#4f8cff]" />
                View project on GitHub
              </a>
            </div>

            <p className="mt-4 text-xs text-brand-muted">
              No spam, no drama, just ducks, posts, and a clean timeline.
            </p>
          </div>

          {/* Right: mini dashboard preview */}
          <div className="flex-1">
            <div
              className="
                mx-auto w-full max-w-md
                rounded-3xl border border-[rgba(142,176,255,0.25)]
                bg-[rgba(4,10,30,0.95)]
                p-4 text-xs
                shadow-[0_18px_45px_rgba(0,0,0,0.7)]
              "
            >
              {/* Top bar */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-xl bg-[rgba(22,34,74,0.9)]" />
                  <div>
                    <p className="text-[11px] font-semibold">Ducky</p>
                    <p className="text-[10px] text-brand-muted">
                      @ducky · Home
                    </p>
                  </div>
                </div>
                <div className="h-6 w-24 rounded-full bg-[rgba(14,24,56,0.9)]" />
              </div>

              {/* Composer */}
              <div className="mb-4 rounded-2xl bg-[rgba(8,14,36,0.9)] p-3">
                <p className="mb-2 text-[10px] text-brand-muted">
                  What&apos;s happening in your pond?
                </p>
                <div className="h-8 rounded-xl bg-[rgba(3,8,28,0.9)]" />
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex gap-1">
                    <div className="h-4 w-4 rounded-full bg-[rgba(79,140,255,0.7)]" />
                    <div className="h-4 w-4 rounded-full bg-[rgba(141,93,255,0.7)]" />
                  </div>
                  <div className="h-6 w-16 rounded-full bg-gradient-to-r from-[#4f8cff] to-[#8b5dff]" />
                </div>
              </div>

              {/* Sample posts */}
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="mt-1 h-7 w-7 rounded-full bg-[rgba(22,34,74,0.9)]" />
                  <div className="flex-1 border-b border-[rgba(32,46,92,0.8)] pb-2">
                    <p className="text-[11px] font-semibold">Ducky</p>
                    <p className="text-[10px] text-brand-muted">@ducky · 5m</p>
                    <p className="mt-1 text-[11px] text-brand-muted">
                      &quot;I tried logging in… but you guys forgot to add a button for ducks. Quack discrimination??&quot;
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="mt-1 h-7 w-7 rounded-full bg-[rgba(22,34,74,0.9)]" />
                  <div className="flex-1 border-b border-[rgba(32,46,92,0.8)] pb-2">
                    <p className="text-[11px] font-semibold">Group17</p>
                    <p className="text-[10px] text-brand-muted">@group17 · 1m</p>
                    <p className="mt-1 text-[11px] text-brand-muted">
                      &quot;We’ll add duck-auth in version 1.1. Support for geese coming never&quot;
                    </p>
                  </div>
                </div>

                <p className="pt-1 text-center text-[10px] text-brand-muted">
                  You&apos;re all caught up. 🦆
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
