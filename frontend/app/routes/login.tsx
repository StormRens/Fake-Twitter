import React, { useState } from "react";
import "./login.css";

export default function Login() {
  const [showPw, setShowPw] = useState(false);

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

        <form method="post" className="login-form">
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

          <div className="row">
            <label className="checkbox">
              <input type="checkbox" name="remember" /> <span>Remember me</span>
            </label>
            <a className="link" href="/forgot">Forgot password?</a>
          </div>

          <button type="submit" className="primary-btn">Sign in</button>
        </form>

        <footer className="login-footer">
          <span className="muted">Do not have an account?</span>{" "}
          <a className="link" href="/signup">Create one</a>
        </footer>
      </main>
    </div>
  );
}
