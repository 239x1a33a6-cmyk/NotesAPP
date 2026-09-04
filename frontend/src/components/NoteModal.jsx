import React, { useState, useEffect } from "react";
import { X, Tag } from "lucide-react";

export default function NoteModal({
  note,
  onClose,
  onNoteUpdate,
  showNotification
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  // Sync state with note prop on open
  useEffect(() => {
    if (note) {
      setTitle(note.title || "");
      setContent(note.content || "");
      setTags(note.tags || []);
      setTagInput("");
    }
  }, [note]);

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

    const success = await onNoteUpdate(note._id, {
      title: title.trim(),
      content: content.trim(),
      tags: tags,
    });

    if (success) {
      onClose();
    }
  };

  if (!note) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content note-edit-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">Edit Note</h2>
          <button className="modal-close-btn" onClick={onClose} title="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSave} className="note-modal-body">
          {/* Title */}
          <div className="note-modal-field">
            <label className="note-modal-label">Title</label>
            <input
              type="text"
              className="note-modal-input"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Content */}
          <div className="note-modal-field">
            <label className="note-modal-label">Content</label>
            <textarea
              className="note-modal-textarea"
              placeholder="Write your note here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          {/* Tags */}
          <div className="note-modal-field">
            <label className="note-modal-label">Tags</label>
            <div className="creator-tags-list">
              {tags.map((tag) => (
                <span key={tag} className="creator-tag-badge">
                  <span>{tag}</span>
                  <button
                    type="button"
                    className="creator-tag-remove"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="tag-input-row">
              <input
                type="text"
                className="tag-input-field"
                placeholder="Add tag and press Enter"
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

          {/* Footer buttons */}
          <div className="note-modal-footer">
            <button
              type="button"
              className="btn-modal-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn-modal-save">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
