import React, { useState } from "react";
const DUCK_ICON = `${import.meta.env.BASE_URL}DuckIcon.svg`;

export default function Register() {
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);

  return (
    <main
      className="
        w-full rounded-3xl
        border border-brand-stroke
        [background:linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))]
        shadow-[0_20px_50px_rgba(0,0,0,0.55)]
        backdrop-blur-2xl
        px-6 py-8
        sm:px-8
      "
      role="main"
      aria-labelledby="registerTitle"
    >
      <header className="mb-6 text-center">
        <img
          src={DUCK_ICON}
          alt="App logo"
          className="mx-auto mb-4 h-20 w-20 rounded-2xl"
        />
        <h1 id="registerTitle" className="text-2xl font-semibold">
          Create your account
        </h1>
        <p className="mt-1 text-sm text-brand-muted">It’s quick and easy</p>
      </header>

      <form method="post" className="space-y-4">
        {/* Full name */}
        <div>
          <label
            htmlFor="name"
            className="mb-1 block text-sm font-medium text-brand-text"
          >
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Jane Doe"
            autoComplete="name"
            required
            className="
              w-full rounded-2xl
              appearance-none
              px-4 py-3 text-sm
              text-brand-text
              bg-[rgba(8,12,26,0.6)]
              border border-[rgba(142,176,255,0.18)]
              placeholder:text-[#c7cfda88]
              outline-none
              transition-[border,box-shadow,background] duration-150 ease-in-out
              focus:border-[#7aa7ff]
              focus:shadow-[0_0_0_4px_rgba(122,167,255,0.15)]
              focus:bg-[rgba(8,12,26,0.75)]
            "
          />
        </div>

        {/* Username */}
        <div>
          <label
            htmlFor="username"
            className="mb-1 block text-sm font-medium text-brand-text"
          >
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="yourname"
            autoComplete="username"
            required
            className="
              w-full rounded-2xl
              appearance-none
              px-4 py-3 text-sm
              text-brand-text
              bg-[rgba(8,12,26,0.6)]
              border border-[rgba(142,176,255,0.18)]
              placeholder:text-[#c7cfda88]
              outline-none
              transition-[border,box-shadow,background] duration-150 ease-in-out
              focus:border-[#7aa7ff]
              focus:shadow-[0_0_0_4px_rgba(122,167,255,0.15)]
              focus:bg-[rgba(8,12,26,0.75)]
            "
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-brand-text"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
            className="
              w-full rounded-2xl
              appearance-none
              px-4 py-3 text-sm
              text-brand-text
              bg-[rgba(8,12,26,0.6)]
              border border-[rgba(142,176,255,0.18)]
              placeholder:text-[#c7cfda88]
              outline-none
              transition-[border,box-shadow,background] duration-150 ease-in-out
              focus:border-[#7aa7ff]
              focus:shadow-[0_0_0_4px_rgba(122,167,255,0.15)]
              focus:bg-[rgba(8,12,26,0.75)]
            "
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-brand-text"
          >
            Password
          </label>
          <div
            className="
              flex items-center rounded-2xl
              border border-[rgba(142,176,255,0.18)]
              bg-[rgba(8,12,26,0.6)] px-1
              transition-[border,box-shadow,background] duration-150 ease-in-out
              focus-within:border-[#7aa7ff]
              focus-within:shadow-[0_0_0_4px_rgba(122,167,255,0.15)]
              focus-within:bg-[rgba(8,12,26,0.75)]
            "
          >
            <input
              id="password"
              name="password"
              type={showPw ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="new-password"
              minLength={8}
              required
              className="
                w-full border-none bg-transparent
                px-3 py-3 text-sm
                text-brand-text
                placeholder:text-[#c7cfda88]
                focus:outline-none
              "
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="px-3 text-xs font-medium text-[#9fb3d9] hover:text-brand-text"
              aria-label={showPw ? "Hide password" : "Show password"}
            >
              {showPw ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Confirm password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-1 block text-sm font-medium text-brand-text"
          >
            Confirm password
          </label>
          <div
            className="
              flex items-center rounded-2xl
              border border-[rgba(142,176,255,0.18)]
              bg-[rgba(8,12,26,0.6)] px-1
              transition-[border,box-shadow,background] duration-150 ease-in-out
              focus-within:border-[#7aa7ff]
              focus-within:shadow-[0_0_0_4px_rgba(122,167,255,0.15)]
              focus-within:bg-[rgba(8,12,26,0.75)]
            "
          >
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPw2 ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="new-password"
              minLength={8}
              required
              className="
                w-full border-none bg-transparent
                px-3 py-3 text-sm
                text-brand-text
                placeholder:text-[#c7cfda88]
                focus:outline-none
              "
            />
            <button
              type="button"
              onClick={() => setShowPw2((v) => !v)}
              className="px-3 text-xs font-medium text-[#9fb3d9] hover:text-brand-text"
              aria-label={showPw2 ? "Hide password" : "Show password"}
            >
              {showPw2 ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="
            mt-2 w-full rounded-2xl
            bg-gradient-to-r from-brand-accent to-brand-accent2
            px-4 py-3 text-sm font-semibold text-white
            shadow-[0_10px_24px_rgba(0,0,0,0.45)]
            hover:brightness-105 hover:shadow-[0_14px_28px_rgba(0,0,0,0.55)]
            focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent2
            focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-brand-bg)]
          "
        >
          Create account
        </button>
      </form>

      <footer className="mt-6 text-center text-sm text-brand-muted">
        <span>Already have an account?</span>{" "}
        <a href="/login" className="font-medium text-brand-accent hover:text-brand-accent2">
          Sign in
        </a>
      </footer>
    </main>
  );
}
