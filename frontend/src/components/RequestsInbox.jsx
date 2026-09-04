import React from "react";
import { X, Bell, Check, Clock, FileText } from "lucide-react";

export default function RequestsInbox({ requests, onRespond, onClose }) {
  const formatDate = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="inbox-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="inbox-header">
          <div className="inbox-title-row">
            <Bell size={20} />
            <h2>Access Requests</h2>
            {requests.length > 0 && (
              <span className="inbox-count">{requests.length} pending</span>
            )}
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="inbox-body">
          {requests.length === 0 ? (
            <div className="inbox-empty">
              <Bell size={44} className="inbox-empty-icon" />
              <p>No pending access requests</p>
              <span>When someone requests access to your notes, it will appear here.</span>
            </div>
          ) : (
            <div className="inbox-list">
              {requests.map((req) => (
                <div key={String(req.requestId)} className="inbox-item">
                  <div className="inbox-item-left">
                    <div className="inbox-avatar">
                      {req.requesterName?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div className="inbox-item-info">
                      <p className="inbox-requester-name">{req.requesterName}</p>
                      <p className="inbox-requester-email">{req.requesterEmail}</p>
                      <div className="inbox-note-ref">
                        <FileText size={12} />
                        <span>{req.noteTitle}</span>
                      </div>
                      {req.message && (
                        <p className="inbox-message">"{req.message}"</p>
                      )}
                      <p className="inbox-time">
                        <Clock size={11} />
                        {formatDate(req.requestedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="inbox-item-actions">
                    <button
                      className="btn-accept"
                      onClick={() =>
                        onRespond(req.noteId, req.requestId, "accept")
                      }
                    >
                      <Check size={15} /> Accept
                    </button>
                    <button
                      className="btn-reject"
                      onClick={() =>
                        onRespond(req.noteId, req.requestId, "reject")
                      }
                    >
                      <X size={15} /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
