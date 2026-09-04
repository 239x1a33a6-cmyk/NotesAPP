import React from "react";
import { BookOpen, Pin, Archive, Trash2, Tag, LogOut, Sun, Moon, Users } from "lucide-react";

export default function Sidebar({
  user,
  currentView,
  onViewChange,
  notes,
  activeTag,
  onTagSelect,
  onLogout,
  theme,
  onToggleTheme
}) {
  // Extract all unique tags from notes
  const uniqueTags = React.useMemo(() => {
    if (!notes || !Array.isArray(notes)) return [];
    const tagsSet = new Set();
    notes.forEach((note) => {
      if (note.tags && Array.isArray(note.tags)) {
        note.tags.forEach((tag) => {
          const trimmed = tag.trim();
          if (trimmed) tagsSet.add(trimmed);
        });
      }
    });
    return Array.from(tagsSet).sort();
  }, [notes]);

  const handleFolderClick = (view) => {
    onTagSelect(null); // Clear tag filter
    onViewChange(view);
  };

  const handleTagClick = (tag) => {
    onTagSelect(tag === activeTag ? null : tag); // Toggle tag filter
  };

  return (
    <div className="sidebar-panel glass-panel">
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <BookOpen size={24} />
          <span>AuraNotes</span>
        </div>
        <button
          className="theme-toggle-btn"
          onClick={onToggleTheme}
          title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>

      {/* Navigation Folders */}
      <div className="sidebar-nav">
        <div className="sidebar-nav-title">Folders</div>
        <div
          className={`sidebar-nav-item ${currentView === "active" && !activeTag ? "active" : ""}`}
          onClick={() => handleFolderClick("active")}
        >
          <BookOpen size={18} />
          <span>All Notes</span>
        </div>
        <div
          className={`sidebar-nav-item ${currentView === "shared" && !activeTag ? "active" : ""}`}
          onClick={() => handleFolderClick("shared")}
        >
          <Users size={18} />
          <span>Shared With Me</span>
        </div>
        <div
          className={`sidebar-nav-item ${currentView === "pinned" && !activeTag ? "active" : ""}`}
          onClick={() => handleFolderClick("pinned")}
        >
          <Pin size={18} />
          <span>Pinned</span>
        </div>
        <div
          className={`sidebar-nav-item ${currentView === "archived" && !activeTag ? "active" : ""}`}
          onClick={() => handleFolderClick("archived")}
        >
          <Archive size={18} />
          <span>Archived</span>
        </div>
        <div
          className={`sidebar-nav-item ${currentView === "trash" && !activeTag ? "active" : ""}`}
          onClick={() => handleFolderClick("trash")}
        >
          <Trash2 size={18} />
          <span>Trash</span>
        </div>

        {/* Dynamic Tags Filter */}
        {uniqueTags.length > 0 && (
          <>
            <div className="sidebar-nav-title">Tags</div>
            <div className="sidebar-tag-list">
              {uniqueTags.map((tag) => (
                <div
                  key={tag}
                  className={`sidebar-tag-item ${activeTag === tag ? "active" : ""}`}
                  onClick={() => handleTagClick(tag)}
                >
                  <Tag size={14} />
                  <span>{tag}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Sidebar Footer - User Profile & Logout */}
      <div className="sidebar-footer">
        <div className="sidebar-user-info">
          <span className="sidebar-user-name" title={user?.name || "User"}>
            {user?.name || "Aura User"}
          </span>
          <span className="sidebar-user-email" title={user?.email || ""}>
            {user?.email || ""}
          </span>
        </div>
        <button
          className="logout-btn"
          onClick={onLogout}
          title="Sign Out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
}
