import React from "react";
import { BookOpen, Bell, Sun, Moon, LogOut, Search, X } from "lucide-react";

export default function TopNav({
  user,
  currentView,
  onViewChange,
  requestCount,
  onLogout,
  theme,
  onToggleTheme,
  searchQuery,
  onSearchChange,
}) {
  const tabs = [
    { id: "active", label: "My Notes" },
    { id: "explore", label: "Explore" },
    { id: "shared", label: "Shared" },
    { id: "pinned", label: "Pinned" },
    { id: "archived", label: "Archived" },
    { id: "trash", label: "Trash" },
  ];

  return (
    <nav className="topnav">
      <div className="topnav-inner">
        {/* Logo */}
        <div className="topnav-logo">
          <BookOpen size={20} />
          <span>NoteFlow</span>
        </div>

        {/* Tabs */}
        <div className="topnav-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`topnav-tab ${currentView === tab.id ? "active" : ""}`}
              onClick={() => onViewChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right Actions */}
        <div className="topnav-right">
          {/* Search bar */}
          <div className="topnav-search">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              placeholder="Search notes…"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="topnav-search-input"
            />
            {searchQuery && (
              <button
                className="search-clear"
                onClick={() => onSearchChange("")}
                title="Clear search"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Bell — requests inbox */}
          <button
            className={`nav-icon-btn ${currentView === "requests" ? "active" : ""}`}
            onClick={() => onViewChange("requests")}
            title="Access Requests"
          >
            <Bell size={18} />
            {requestCount > 0 && (
              <span className="nav-badge">{requestCount}</span>
            )}
          </button>

          {/* Theme toggle */}
          <button
            className="nav-icon-btn"
            onClick={onToggleTheme}
            title={theme === "light" ? "Dark mode" : "Light mode"}
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* User avatar */}
          <div className="nav-avatar" title={user?.name || "User"}>
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>

          {/* Logout */}
          <button
            className="nav-icon-btn nav-logout"
            onClick={onLogout}
            title="Sign Out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
}
