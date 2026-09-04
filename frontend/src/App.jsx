import React, { useState, useEffect } from "react";
import AuthPage from "./components/AuthPage";
import Dashboard from "./components/Dashboard";
import { API_ENDPOINTS, apiFetch } from "./api";

export default function App() {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [theme, setTheme] = useState("light");

  // Load user session and theme on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("aura_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("aura_user");
        localStorage.removeItem("aura_token");
      }
    }

    let initialTheme = localStorage.getItem("aura_theme");
    if (!initialTheme || initialTheme === "dark") {
      initialTheme = "light";
      localStorage.setItem("aura_theme", "light");
    }
    setTheme(initialTheme);
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("aura_theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const showNotification = (message, type = "success") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  // Called by AuthPage on successful login; receives { user, token }
  const handleLoginSuccess = ({ user: userData, token }) => {
    localStorage.setItem("aura_token", token);
    localStorage.setItem("aura_user", JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      // Server logout is stateless — just notify backend (best-effort)
      await apiFetch(API_ENDPOINTS.logout, { method: "POST" });
    } catch {
      // Ignore network errors — still clear local session
    } finally {
      setUser(null);
      localStorage.removeItem("aura_user");
      localStorage.removeItem("aura_token");
      showNotification("Logged out successfully", "success");
    }
  };

  return (
    <>
      {/* Toast Notification Container */}
      <div className="toast-container">
        {notifications.map((toast) => (
          <div key={toast.id} className={`toast-message ${toast.type}`}>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Main Page Routing */}
      {!user ? (
        <AuthPage
          onLoginSuccess={handleLoginSuccess}
          showNotification={showNotification}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      ) : (
        <Dashboard
          user={user}
          showNotification={showNotification}
          onLogout={handleLogout}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}
    </>
  );
}
