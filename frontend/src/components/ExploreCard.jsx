import React, { useState } from "react";
import { Lock, Users, MessageSquare, CheckCircle, Clock, Send, ChevronRight } from "lucide-react";

export default function ExploreCard({ note, onRequestAccess }) {
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [requesting, setRequesting] = useState(false);

  const handleRequest = async () => {
    setRequesting(true);
    const success = await onRequestAccess(note._id, message);
    setRequesting(false);
    if (success) {
      setShowForm(false);
      setMessage("");
    }
  };

  const formatDate = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="explore-card">
      {/* Header */}
      <div className="explore-card-top">
        <div className="explore-owner-avatar">
          {note.ownerName?.[0]?.toUpperCase() || "?"}
        </div>
        <div className="explore-meta">
          <span className="explore-owner-name">{note.ownerName}</span>
          <span className="explore-date">{formatDate(note.updatedAt)}</span>
        </div>
        <Lock size={14} className="explore-lock" />
      </div>

      {/* Title */}
      <h3 className="explore-title">{note.title}</h3>

      {/* Tags */}
      {note.tags?.length > 0 && (
        <div className="explore-tags">
          {note.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="explore-tag">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="explore-stats">
        <span className="explore-stat">
          <Users size={12} /> {note.collaboratorCount} collaborator{note.collaboratorCount !== 1 ? "s" : ""}
        </span>
        <span className="explore-stat">
          <MessageSquare size={12} /> {note.commentCount} comment{note.commentCount !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Footer action */}
      <div className="explore-footer">
        {note.hasAccess ? (
          <span className="explore-status has-access">
            <CheckCircle size={14} /> You have access
          </span>
        ) : note.hasPendingRequest ? (
          <span className="explore-status pending">
            <Clock size={14} /> Request pending
          </span>
        ) : !showForm ? (
          <button
            className="btn-request-access"
            onClick={() => setShowForm(true)}
          >
            Request Access <ChevronRight size={14} />
          </button>
        ) : (
          <div className="request-form">
            <input
              type="text"
              className="request-msg-input"
              placeholder="Add a message (optional)…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRequest()}
              autoFocus
            />
            <div className="request-form-btns">
              <button
                className="btn-cancel-sm"
                onClick={() => { setShowForm(false); setMessage(""); }}
              >
                Cancel
              </button>
              <button
                className="btn-send-sm"
                onClick={handleRequest}
                disabled={requesting}
              >
                <Send size={13} />
                {requesting ? "Sending…" : "Send"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
