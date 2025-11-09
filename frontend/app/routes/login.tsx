import React, { useState } from "react";
import axios from "axios";
import "./login.css";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const username = String(form.get("username") || "").trim();
    const password = String(form.get("password") || "");

    try {
      // update this to point to actual backend route
      await axios.post(
        "http://localhost:3000/auth/login",
        { username, password },
        { withCredentials: true } // cookies
      );

      // on success, navigate to home
      navigate("/");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err?.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      {/* soft animated background */}
      <div className="bg-orbs">
        <span />
        <span />
        <span />
      </div>

      <main className="login-card" role="main" aria-labelledby="loginTitle">
        <header className="login-header">
          <div className="logo-dot" aria-hidden="true" />
          <h1 id="loginTitle">Welcome back</h1>
          <p className="subtitle">Sign in to continue</p>
        </header>

        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="username">Username</label>
          <div className="input-wrap">
            <input
              id="username"
              name="username"
              type="text"
              placeholder="yourname"
              required
              autoComplete="username"
            />
          </div>

          <label htmlFor="password">Password</label>
          <div className="input-wrap">
            <input
              id="password"
              name="password"
              type={showPw ? "text" : "password"}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              className="ghost-btn"
              onClick={() => setShowPw((v) => !v)}
              aria-label={showPw ? "Hide password" : "Show password"}
            >
              {showPw ? "Hide" : "Show"}
            </button>
          </div>

          {error && <div className="error">{error}</div>}

          <div className="row">
            <a className="link" href="/forgot">Forgot password?</a>
          </div>

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <footer className="login-footer">
          <span className="muted">Don't have an account?</span>{" "}
          <a className="link" href="/signup">Create one</a>
        </footer>
      </main>
    </div>
  );
}