import React, { useState, useEffect } from "react";
import AuthPage from "./components/AuthPage";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [theme, setTheme] = useState("light"); // Default to light mode

  // Load user session and theme on mount
  useEffect(() => {
    // Check localStorage for saved user
    const savedUser = localStorage.getItem("aura_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("aura_user");
      }
    }

    // Ensure clean light mode is the active theme
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

  // Sync theme changes with DOM and localStorage
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

  // Notification (Toast) trigger
  const showNotification = (message, type = "success") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);

    // Auto-remove notification after 3 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/user/logout", {
        method: "POST"
      });

      if (response.ok) {
        showNotification("Logged out successfully", "success");
      }
    } catch (e) {
      // Offline logout
    } finally {
      setUser(null);
      localStorage.removeItem("aura_user");
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
