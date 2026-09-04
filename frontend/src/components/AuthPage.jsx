import React, { useState } from "react";
import {
  BookOpen,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Users,
  Compass,
  Pin,
  Sun,
  Moon
} from "lucide-react";
import { API_ENDPOINTS, apiFetch } from "../api";

export default function AuthPage({ onLoginSuccess, showNotification, theme, onToggleTheme }) {
  const [authMode, setAuthMode] = useState(null); // 'login', 'signup', or null
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || (authMode === "signup" && !name)) {
      showNotification("Please fill in all required fields", "error");
      return;
    }

    setLoading(true);
    const endpoint = authMode === "login" ? API_ENDPOINTS.login : API_ENDPOINTS.register;
    const payload = authMode === "login" ? { email, password } : { name, email, password };

    try {
      const response = await apiFetch(endpoint, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        showNotification(data.message || "Success!", "success");
        if (authMode === "login") {
          // Pass token + user to App — App stores them in localStorage
          onLoginSuccess({ user: data.user, token: data.token });
          setAuthMode(null);
        } else {
          setAuthMode("login");
          setPassword("");
        }
      } else {
        showNotification(data.message || "An error occurred", "error");
      }
    } catch (error) {
      showNotification("Network error. Please try again later.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <button
        className="auth-theme-btn"
        onClick={onToggleTheme}
        title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
      >
        {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
      </button>

      <div className="auth-container">
        {authMode === null ? (
          <div className="auth-landing">
            <div className="auth-landing-badge">
              <Sparkles size={13} />
              <span>Minimal & Collaborative Notes</span>
            </div>

            <h1 className="auth-landing-title">
              Where Thoughts Align,<br />
              <span className="accent">Ideas Take Shape.</span>
            </h1>

            <p className="auth-landing-sub">
              A distraction-free workspace. Organize thoughts, collaborate with your team, explore public notes, and request access seamlessly.
            </p>

            <div className="auth-landing-btns">
              <button
                className="btn-primary"
                onClick={() => setAuthMode("signup")}
              >
                Get Started
                <ArrowRight size={16} />
              </button>
              <button
                className="btn-secondary"
                onClick={() => setAuthMode("login")}
              >
                Sign In
              </button>
            </div>

            <div className="auth-features">
              <div className="auth-feature">
                <Compass size={18} className="auth-feature-icon" />
                <div>
                  <div className="auth-feature-title">Explore & Discover</div>
                  <div className="auth-feature-desc">Discover notes from others and request access with one click.</div>
                </div>
              </div>

              <div className="auth-feature">
                <Users size={18} className="auth-feature-icon" />
                <div>
                  <div className="auth-feature-title">Team Collaboration</div>
                  <div className="auth-feature-desc">Manage access requests, invite team members, and leave comments.</div>
                </div>
              </div>

              <div className="auth-feature">
                <Pin size={18} className="auth-feature-icon" />
                <div>
                  <div className="auth-feature-title">Pin & Organize</div>
                  <div className="auth-feature-desc">Keep vital ideas at top of your dashboard with instant access.</div>
                </div>
              </div>

              <div className="auth-feature">
                <BookOpen size={18} className="auth-feature-icon" />
                <div>
                  <div className="auth-feature-title">Simple & Focused</div>
                  <div className="auth-feature-desc">Clean single-accent aesthetic designed for high productivity.</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <button
              className="auth-back-btn"
              onClick={() => {
                setAuthMode(null);
                setShowPassword(false);
              }}
            >
              <ArrowLeft size={16} />
              Back
            </button>

            <div className="auth-logo">
              <BookOpen size={24} />
              <span className="auth-logo-name">AuraNotes</span>
            </div>

            <h2 className="auth-title">
              {authMode === "login" ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="auth-subtitle">
              {authMode === "login"
                ? "Enter your credentials to access your notes"
                : "Sign up to start organizing your thoughts"}
            </p>

            <form className="auth-form" onSubmit={handleAuthSubmit}>
              {authMode === "signup" && (
                <div className="auth-field">
                  <label className="auth-label">Full Name</label>
                  <div className="auth-input-wrap">
                    <User size={16} className="auth-input-icon" />
                    <input
                      type="text"
                      className="auth-input"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={authMode === "signup"}
                    />
                  </div>
                </div>
              )}

              <div className="auth-field">
                <label className="auth-label">Email Address</label>
                <div className="auth-input-wrap">
                  <Mail size={16} className="auth-input-icon" />
                  <input
                    type="email"
                    className="auth-input"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-label">Password</label>
                <div className="auth-input-wrap">
                  <Lock size={16} className="auth-input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="auth-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="auth-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="auth-submit"
                disabled={loading}
              >
                {loading ? (
                  "Processing..."
                ) : (
                  <>
                    <span>{authMode === "login" ? "Sign In" : "Register"}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <p className="auth-switch">
              {authMode === "login" ? "New to AuraNotes? " : "Already have an account? "}
              <button
                type="button"
                className="auth-switch-link"
                onClick={() => {
                  setAuthMode(authMode === "login" ? "signup" : "login");
                  setShowPassword(false);
                }}
              >
                {authMode === "login" ? "Create Account" : "Login Here"}
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
