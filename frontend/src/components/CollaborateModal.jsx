import React, { useState } from "react";
import { X, Users, UserPlus, Trash2, MessageSquare, Clock, Send, ShieldCheck, Edit3, Eye } from "lucide-react";

export default function CollaborateModal({
  note,
  currentUser,
  onClose,
  onAddCollaborator,
  onRemoveCollaborator,
  onAddComment,
  showNotification
}) {
  const [activeTab, setActiveTab] = useState("members"); // 'members', 'comments', 'activity'
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("editor");
  const [commentText, setCommentText] = useState("");
  const [submittingInvite, setSubmittingInvite] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  if (!note) return null;

  const collaborators = note.collaborators || [];
  const comments = note.comments || [];
  const activityLog = (note.activityLog || []).slice().reverse(); // Most recent first

  const isOwner = !note.userId || (currentUser && (note.userId === currentUser._id || note.userId === currentUser.id));

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) {
      showNotification("Please enter an email address", "warning");
      return;
    }
    setSubmittingInvite(true);
    const success = await onAddCollaborator(note._id, {
      email: inviteEmail.trim(),
      role: inviteRole
    });
    setSubmittingInvite(false);
    if (success) {
      setInviteEmail("");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    const success = await onAddComment(note._id, {
      text: commentText.trim(),
      authorName: currentUser?.name || "User"
    });
    setSubmittingComment(false);
    if (success) {
      setCommentText("");
    }
  };

  const formatTimestamp = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content collaborate-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div className="collab-header-left">
            <h2 className="modal-title">Workspace & Collaboration</h2>
            <p className="collab-note-title" title={note.title}>
              Note: <strong>{note.title}</strong>
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose} title="Close">
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="collab-tabs">
          <button
            className={`collab-tab ${activeTab === "members" ? "active" : ""}`}
            onClick={() => setActiveTab("members")}
          >
            <Users size={15} />
            <span>Teammates ({collaborators.length})</span>
          </button>
          <button
            className={`collab-tab ${activeTab === "comments" ? "active" : ""}`}
            onClick={() => setActiveTab("comments")}
          >
            <MessageSquare size={15} />
            <span>Comments ({comments.length})</span>
          </button>
          <button
            className={`collab-tab ${activeTab === "activity" ? "active" : ""}`}
            onClick={() => setActiveTab("activity")}
          >
            <Clock size={15} />
            <span>Activity Log ({activityLog.length})</span>
          </button>
        </div>

        {/* Tab 1: Teammates & Invites */}
        {activeTab === "members" && (
          <div className="collab-body">
            {/* Invite Form */}
            <form onSubmit={handleInviteSubmit} className="collab-invite-section">
              <span className="collab-section-title">Invite Collaborator</span>
              <div className="collab-form">
                <input
                  type="email"
                  className="collab-input"
                  placeholder="colleague@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                />
                <select
                  className="collab-role-select"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                >
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
                <button
                  type="submit"
                  className="btn-collab-add"
                  disabled={submittingInvite}
                >
                  <UserPlus size={14} />
                  <span>{submittingInvite ? "Adding..." : "Invite"}</span>
                </button>
              </div>
            </form>

            {/* Collaborators List */}
            <div className="collab-members-section">
              <span className="collab-section-title">Current Members</span>
              <div className="collab-member-list">
                {/* Author Item */}
                <div className="collab-member owner-item">
                  <div className="collab-member-avatar">
                    <ShieldCheck size={16} />
                  </div>
                  <div className="collab-member-info">
                    <span className="collab-member-name">Note Author</span>
                    <span className="collab-member-email">Full Access</span>
                  </div>
                  <span className="collab-member-role">Owner</span>
                </div>

                {/* Collaborators */}
                {collaborators.length === 0 ? (
                  <p className="collab-empty">
                    No team members invited yet. Add someone above to work together!
                  </p>
                ) : (
                  collaborators.map((c) => (
                    <div key={c.email} className="collab-member">
                      <div className="collab-member-avatar">
                        {c.role === "editor" ? <Edit3 size={14} /> : <Eye size={14} />}
                      </div>
                      <div className="collab-member-info">
                        <span className="collab-member-name">{c.name || c.email.split("@")[0]}</span>
                        <span className="collab-member-email">{c.email}</span>
                      </div>
                      <span className="collab-member-role">{c.role}</span>
                      {isOwner && (
                        <button
                          type="button"
                          className="btn-remove-collab"
                          onClick={() => onRemoveCollaborator(note._id, c.email)}
                          title="Remove teammate"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Comments */}
        {activeTab === "comments" && (
          <div className="collab-body">
            <div className="collab-comments">
              {comments.length === 0 ? (
                <div className="collab-empty">
                  <MessageSquare size={28} opacity={0.3} style={{ margin: "0 auto 8px" }} />
                  <p>No comments on this note yet. Start the conversation below!</p>
                </div>
              ) : (
                comments.map((comment, idx) => (
                  <div key={comment._id || idx} className="collab-comment">
                    <div className="comment-author">{comment.authorName}</div>
                    <p className="comment-text">{comment.text}</p>
                    <div className="comment-date">{formatTimestamp(comment.createdAt)}</div>
                  </div>
                ))
              )}
            </div>

            {/* Post Comment Input */}
            <form onSubmit={handleCommentSubmit} className="collab-comment-form">
              <textarea
                className="comment-textarea"
                placeholder="Write a comment or feedback..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={2}
              />
              <button
                type="submit"
                className="btn-post-comment"
                disabled={submittingComment || !commentText.trim()}
              >
                <Send size={14} />
                <span>Post</span>
              </button>
            </form>
          </div>
        )}

        {/* Tab 3: Activity Log */}
        {activeTab === "activity" && (
          <div className="collab-body">
            <div className="collab-activity">
              {activityLog.length === 0 ? (
                <p className="collab-empty">No activity recorded yet.</p>
              ) : (
                activityLog.map((log, idx) => (
                  <div key={log._id || idx} className="activity-item">
                    <div className="activity-dot"></div>
                    <div>
                      <div className="activity-text">{log.action}</div>
                      <div className="activity-by">
                        by {log.performedBy || "Teammate"} • {formatTimestamp(log.timestamp)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
