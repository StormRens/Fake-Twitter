import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router";

const DUCK_ICON = `${import.meta.env.BASE_URL}DuckIcon.svg`;
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function Login() {
  const navigate = useNavigate();

  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const username = String(form.get("username") || "").trim();
    const password = String(form.get("password") || "");

    if (!username || !password) {
      setError("Please enter both username and password.");
      setLoading(false);
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/auth/login`,
        { username, password },
        { withCredentials: true } // send/receive auth cookie
      );

      // after successful axios.post(...)
      setSuccess("Login successful. Redirecting to dashboard...");
      setTimeout(() => navigate("/dashboard", { state: { username } }), 800 );
    
    } catch (err: any) {
      console.error("Login error:", err);
      const msg =
        err?.response?.data?.error ||
        "Login failed. Please check your credentials.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

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
      aria-labelledby="loginTitle"
    >
      <header className="mb-6 text-center">
        <img
          src={DUCK_ICON}
          alt="App logo"
          className="mx-auto mb-4 h-20 w-20 rounded-2xl"
        />
        <h1 id="loginTitle" className="text-2xl font-semibold">
          Welcome back
        </h1>
        <p className="mt-1 text-sm text-brand-muted">Sign in to continue</p>
      </header>

      {/* Global messages */}
      {error && (
        <p className="mb-3 text-xs text-red-400" role="alert">
          {error}
        </p>
      )}
      {success && (
        <p className="mb-3 text-xs text-green-400" role="status">
          {success}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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
              border border-[rgba(142,176,255,0.18)]
              bg-[rgba(8,12,26,0.6)]
              px-3 py-3 text-sm text-brand-text
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
              autoComplete="current-password"
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


        {/* 
        Forgot password link (not including now)
        <div className="flex justify-end">
          <span className="text-xs text-brand-muted">
            Forgot password? (still needs implementation)
          </span>
        </div>
        */}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="
            mt-2 w-full rounded-2xl
            bg-gradient-to-r from-[#4f8cff] to-[#8b5dff]
            px-4 py-3
            text-sm font-semibold
            text-white
            shadow-[0_10px_25px_rgba(0,0,0,0.35)]
            transition-transform duration-150
            hover:translate-y-0.5
            disabled:opacity-60 disabled:cursor-not-allowed
          "
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <footer className="mt-6 text-center text-sm text-brand-muted">
        <span>Do not have an account?</span>{" "}
        <Link
          to="/register"
          className="font-medium text-brand-accent hover:text-brand-accent2"
        >
          Create one
        </Link>
      </footer>
    </main>
  );
}
