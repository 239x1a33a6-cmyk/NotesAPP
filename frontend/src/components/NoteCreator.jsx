import React, { useState, useRef, useEffect } from "react";
import { Plus, X, Tag } from "lucide-react";

export default function NoteCreator({ onNoteCreate, showNotification }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const containerRef = useRef(null);

  // Collapse the note creator if clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target) &&
        !title.trim() &&
        !content.trim() &&
        tags.length === 0
      ) {
        setIsExpanded(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [title, content, tags]);

  const handleAddTag = (e) => {
    e.preventDefault();
    const cleanTag = tagInput.trim();
    if (!cleanTag) return;

    if (tags.includes(cleanTag)) {
      showNotification("Tag already added", "warning");
      return;
    }

    setTags([...tags, cleanTag]);
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      showNotification("Title and content are required", "error");
      return;
    }

    const success = await onNoteCreate({
      title: title.trim(),
      content: content.trim(),
      tags: tags,
    });

    if (success) {
      // Clear forms
      setTitle("");
      setContent("");
      setTags([]);
      setTagInput("");
      setIsExpanded(false);
    }
  };

  const handleClose = () => {
    setTitle("");
    setContent("");
    setTags([]);
    setTagInput("");
    setIsExpanded(false);
  };

  return (
    <div className="creator-wrapper" ref={containerRef}>
      <div className={`creator-card ${isExpanded ? "expanded" : ""}`}>
        {!isExpanded ? (
          <div className="creator-collapsed" onClick={() => setIsExpanded(true)}>
            <span className="creator-placeholder">Take a note...</span>
            <button className="creator-quick-btn" title="Create Note" type="button">
              <Plus size={18} />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSave} className="creator-expanded">
            {/* Title */}
            <input
              type="text"
              className="creator-title-input"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />

            {/* Content */}
            <textarea
              className="creator-content-input"
              placeholder="Take a note..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            {/* Tags section */}
            <div className="creator-tags-section">
              {tags.length > 0 && (
                <div className="creator-tags-list">
                  {tags.map((tag) => (
                    <span key={tag} className="creator-tag-badge">
                      <span>{tag}</span>
                      <button
                        type="button"
                        className="creator-tag-remove"
                        onClick={() => handleRemoveTag(tag)}
                        title="Remove tag"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <div className="creator-tag-input-row">
                <Tag size={14} className="tag-icon" />
                <input
                  type="text"
                  className="creator-tag-input-field"
                  placeholder="Add tags (press Enter)..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      handleAddTag(e);
                    }
                  }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="creator-actions">
              <div className="creator-buttons">
                <button
                  type="button"
                  className="creator-close-btn"
                  onClick={handleClose}
                >
                  Discard
                </button>
                <button type="submit" className="creator-submit-btn">
                  Save Note
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
