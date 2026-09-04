import React from "react";
import { Pin, Archive, Trash2, RotateCcw, Users, MessageSquare } from "lucide-react";

export default function NoteCard({
  note,
  currentUser,
  onPin,
  onArchive,
  onDelete,
  onRestore,
  onEditClick,
  onCollaborateClick,
}) {
  const formatDate = (d) => {
    if (!d) return "";
    const date = new Date(d);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const collaboratorCount = note.collaborators?.length || 0;
  const commentCount = note.comments?.length || 0;
  const isSharedWithMe =
    currentUser &&
    note.userId &&
    note.userId !== currentUser._id &&
    note.userId !== currentUser.id;

  const handleCardClick = () => {
    if (!note.deleted && onEditClick) onEditClick(note);
  };

  return (
    <div className="note-card" onClick={handleCardClick}>
      {/* Pin indicator strip */}
      {note.pinned && <div className="note-pin-strip" />}

      {/* Card Header */}
      <div className="note-card-header">
        <div className="note-card-title-block">
          <h3 className="note-card-title">{note.title}</h3>
          {isSharedWithMe && (
            <span className="note-shared-badge">Shared</span>
          )}
        </div>
        {!note.deleted && (
          <button
            className={`pin-btn ${note.pinned ? "pinned" : ""}`}
            onClick={(e) => { e.stopPropagation(); onPin(note._id); }}
            title={note.pinned ? "Unpin" : "Pin"}
          >
            <Pin size={15} fill={note.pinned ? "currentColor" : "none"} />
          </button>
        )}
      </div>

      {/* Content preview */}
      <p className="note-card-content">{note.content}</p>

      {/* Tags */}
      {note.tags?.length > 0 && (
        <div className="note-card-tags">
          {note.tags.map((tag) => (
            <span key={tag} className="note-tag">{tag}</span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="note-card-footer">
        <div className="note-card-stats">
          {collaboratorCount > 0 && (
            <span className="note-stat" title={`${collaboratorCount} collaborator(s)`}>
              <Users size={12} /> {collaboratorCount}
            </span>
          )}
          {commentCount > 0 && (
            <span className="note-stat" title={`${commentCount} comment(s)`}>
              <MessageSquare size={12} /> {commentCount}
            </span>
          )}
          <span className="note-date">
            {note.updatedAt
              ? `Updated ${formatDate(note.updatedAt)}`
              : formatDate(note.createdAt)}
          </span>
        </div>

        <div className="note-card-actions">
          {note.deleted ? (
            <button
              className="card-btn"
              onClick={(e) => { e.stopPropagation(); onRestore(note._id); }}
              title="Restore"
            >
              <RotateCcw size={15} />
            </button>
          ) : (
            <>
              <button
                className="card-btn"
                onClick={(e) => { e.stopPropagation(); if (onCollaborateClick) onCollaborateClick(note); }}
                title="Team & Comments"
              >
                <Users size={15} />
              </button>
              <button
                className={`card-btn ${note.archived ? "active-state" : ""}`}
                onClick={(e) => { e.stopPropagation(); onArchive(note._id); }}
                title={note.archived ? "Unarchive" : "Archive"}
              >
                <Archive size={15} />
              </button>
              <button
                className="card-btn danger"
                onClick={(e) => { e.stopPropagation(); onDelete(note._id); }}
                title="Move to Trash"
              >
                <Trash2 size={15} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
