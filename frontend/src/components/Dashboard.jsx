import React, { useState, useEffect, useCallback } from "react";
import { FolderOpen, Compass, Users, Pin, Archive, Trash2, Bell } from "lucide-react";
import TopNav from "./TopNav";
import NoteCreator from "./NoteCreator";
import NoteCard from "./NoteCard";
import NoteModal from "./NoteModal";
import CollaborateModal from "./CollaborateModal";
import ExploreCard from "./ExploreCard";
import RequestsInbox from "./RequestsInbox";

export default function Dashboard({ user, showNotification, onLogout, theme, onToggleTheme }) {
  const [notes, setNotes] = useState([]);
  const [discoverNotes, setDiscoverNotes] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [currentView, setCurrentView] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEditNote, setSelectedEditNote] = useState(null);
  const [selectedCollabNote, setSelectedCollabNote] = useState(null);
  const [showRequestsInbox, setShowRequestsInbox] = useState(false);

  // ─── Data Fetching ─────────────────────────────────────────────
  const fetchNotes = useCallback(async () => {
    try {
      const endpoint = currentView === "trash" ? "/notes/trash" : "/notes";
      const res = await fetch(endpoint, { headers: { Accept: "application/json" } });
      if (res.status === 401) { showNotification("Session expired. Please login again.", "error"); onLogout(); return; }
      const data = await res.json();
      if (res.ok) setNotes(data.notes || data.note || []);
      else showNotification(data.message || "Failed to fetch notes", "error");
    } catch {
      showNotification("Failed to connect to backend", "error");
    }
  }, [currentView]);

  const fetchDiscoverNotes = useCallback(async () => {
    try {
      const res = await fetch("/notes/discover", { headers: { Accept: "application/json" } });
      const data = await res.json();
      if (res.ok) setDiscoverNotes(data.notes || []);
    } catch { /* silent */ }
  }, []);

  const fetchMyRequests = useCallback(async () => {
    try {
      const res = await fetch("/notes/my-requests", { headers: { Accept: "application/json" } });
      const data = await res.json();
      if (res.ok) setPendingRequests(data.requests || []);
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    if (currentView === "explore") {
      fetchDiscoverNotes();
    } else {
      fetchNotes();
    }
    fetchMyRequests();
  }, [currentView]);

  // ─── View handler ───────────────────────────────────────────────
  const handleViewChange = (view) => {
    if (view === "requests") {
      setShowRequestsInbox(true);
    } else {
      setCurrentView(view);
      setSearchQuery("");
    }
  };

  // ─── Note CRUD ─────────────────────────────────────────────────
  const handleNoteCreate = async (noteData) => {
    try {
      const res = await fetch("/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(noteData),
      });
      const data = await res.json();
      if (res.ok) { showNotification("Note created!", "success"); fetchNotes(); return true; }
      else { showNotification(data.message || "Failed to create note", "error"); return false; }
    } catch { showNotification("Network error", "error"); return false; }
  };

  const handleNoteUpdate = async (noteId, updatedData) => {
    try {
      const res = await fetch(`/notes/${noteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();
      if (res.ok) { showNotification("Note updated", "success"); fetchNotes(); return true; }
      else { showNotification(data.message || "Failed to update", "error"); return false; }
    } catch { showNotification("Network error", "error"); return false; }
  };

  const handlePinToggle = async (noteId) => {
    try {
      const res = await fetch(`/notes/${noteId}/pin`, { method: "PATCH" });
      if (res.ok) fetchNotes();
      else showNotification("Failed to pin/unpin", "error");
    } catch { showNotification("Network error", "error"); }
  };

  const handleArchiveToggle = async (noteId) => {
    try {
      const res = await fetch(`/notes/${noteId}/archive`, { method: "PATCH" });
      if (res.ok) { showNotification("Done", "success"); fetchNotes(); }
      else showNotification("Failed", "error");
    } catch { showNotification("Network error", "error"); }
  };

  const handleDeleteToggle = async (noteId) => {
    try {
      const res = await fetch(`/notes/${noteId}`, { method: "DELETE" });
      if (res.ok) { showNotification("Moved to Trash", "success"); fetchNotes(); }
      else showNotification("Failed", "error");
    } catch { showNotification("Network error", "error"); }
  };

  const handleRestoreNote = async (noteId) => {
    try {
      const res = await fetch(`/notes/${noteId}/restore`, { method: "PATCH" });
      if (res.ok) { showNotification("Note restored", "success"); fetchNotes(); }
      else showNotification("Failed to restore", "error");
    } catch { showNotification("Network error", "error"); }
  };

  // ─── Collaborators & Comments ───────────────────────────────────
  const handleAddCollaborator = async (noteId, collabData) => {
    try {
      const res = await fetch(`/notes/${noteId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(collabData),
      });
      const data = await res.json();
      if (res.ok) {
        showNotification("Teammate added!", "success");
        fetchNotes();
        if (selectedCollabNote?._id === noteId) setSelectedCollabNote(data.note);
        return true;
      } else { showNotification(data.message || "Failed", "error"); return false; }
    } catch { showNotification("Network error", "error"); return false; }
  };

  const handleRemoveCollaborator = async (noteId, email) => {
    try {
      const res = await fetch(`/notes/${noteId}/collaborators/${encodeURIComponent(email)}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        showNotification("Removed", "success");
        fetchNotes();
        if (selectedCollabNote?._id === noteId) setSelectedCollabNote(data.note);
        return true;
      } else { showNotification(data.message || "Failed", "error"); return false; }
    } catch { showNotification("Network error", "error"); return false; }
  };

  const handleAddComment = async (noteId, commentData) => {
    try {
      const res = await fetch(`/notes/${noteId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(commentData),
      });
      const data = await res.json();
      if (res.ok) {
        showNotification("Comment posted", "success");
        fetchNotes();
        if (selectedCollabNote?._id === noteId) setSelectedCollabNote(data.note);
        return true;
      } else { showNotification(data.message || "Failed", "error"); return false; }
    } catch { showNotification("Network error", "error"); return false; }
  };

  // ─── Request Access ─────────────────────────────────────────────
  const handleRequestAccess = async (noteId, message) => {
    try {
      const res = await fetch(`/notes/${noteId}/request-access`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      if (res.ok) {
        showNotification("Access request sent!", "success");
        fetchDiscoverNotes(); // refresh status
        return true;
      } else { showNotification(data.message || "Failed to send request", "error"); return false; }
    } catch { showNotification("Network error", "error"); return false; }
  };

  const handleRespondToRequest = async (noteId, requestId, action) => {
    try {
      const res = await fetch(`/notes/${noteId}/requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (res.ok) {
        showNotification(action === "accept" ? "Request accepted!" : "Request rejected", "success");
        fetchMyRequests();
        fetchNotes();
        return true;
      } else { showNotification(data.message || "Failed", "error"); return false; }
    } catch { showNotification("Network error", "error"); return false; }
  };

  // ─── Filtered Notes ─────────────────────────────────────────────
  const getFilteredNotes = () => {
    let list = [...notes];
    const myEmail = user?.email?.toLowerCase();

    if (currentView !== "trash") {
      if (currentView === "pinned") {
        list = list.filter((n) => n.pinned && !n.archived);
      } else if (currentView === "archived") {
        list = list.filter((n) => n.archived);
      } else if (currentView === "shared") {
        list = list.filter((n) =>
          myEmail && n.collaborators?.some((c) => c.email.toLowerCase() === myEmail)
        );
      } else {
        list = list.filter((n) => !n.archived);
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (n) =>
          n.title?.toLowerCase().includes(q) ||
          n.content?.toLowerCase().includes(q) ||
          n.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    return list;
  };

  const getFilteredDiscover = () => {
    if (!searchQuery.trim()) return discoverNotes;
    const q = searchQuery.toLowerCase();
    return discoverNotes.filter(
      (n) =>
        n.title?.toLowerCase().includes(q) ||
        n.ownerName?.toLowerCase().includes(q) ||
        n.tags?.some((t) => t.toLowerCase().includes(q))
    );
  };

  const displayedNotes = getFilteredNotes();
  const pinnedNotes = displayedNotes.filter((n) => n.pinned && !n.archived && !n.deleted);
  const regularNotes = displayedNotes.filter((n) => !n.pinned || n.archived || n.deleted);

  // ─── Section heading ────────────────────────────────────────────
  const getSectionInfo = () => {
    switch (currentView) {
      case "active": return { icon: <FolderOpen size={18} />, title: "My Notes", desc: "All your notes in one place" };
      case "explore": return { icon: <Compass size={18} />, title: "Explore", desc: "Discover notes from other users" };
      case "shared": return { icon: <Users size={18} />, title: "Shared With Me", desc: "Notes you have been invited to" };
      case "pinned": return { icon: <Pin size={18} />, title: "Pinned", desc: "Your important notes" };
      case "archived": return { icon: <Archive size={18} />, title: "Archived", desc: "Notes you have archived" };
      case "trash": return { icon: <Trash2 size={18} />, title: "Trash", desc: "Soft-deleted notes" };
      default: return { icon: <FolderOpen size={18} />, title: "Notes", desc: "" };
    }
  };

  const section = getSectionInfo();

  // ─── Render ─────────────────────────────────────────────────────
  return (
    <div className="app-layout">
      <TopNav
        user={user}
        currentView={currentView}
        onViewChange={handleViewChange}
        requestCount={pendingRequests.length}
        onLogout={onLogout}
        theme={theme}
        onToggleTheme={onToggleTheme}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="main-content">
        {/* Section header */}
        <div className="section-header">
          <div className="section-title-row">
            {section.icon}
            <h1 className="section-title">{section.title}</h1>
            <span className="section-desc">{section.desc}</span>
          </div>
        </div>

        {/* Explore view */}
        {currentView === "explore" && (
          <>
            {getFilteredDiscover().length === 0 ? (
              <div className="empty-state">
                <Compass size={48} />
                <p>No notes to explore yet.</p>
                <span>When other users add notes, they'll appear here.</span>
              </div>
            ) : (
              <div className="notes-grid">
                {getFilteredDiscover().map((note) => (
                  <ExploreCard
                    key={note._id}
                    note={note}
                    onRequestAccess={handleRequestAccess}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* All other views: own notes */}
        {currentView !== "explore" && (
          <>
            {/* Note creator - only on My Notes */}
            {currentView === "active" && (
              <NoteCreator
                onNoteCreate={handleNoteCreate}
                showNotification={showNotification}
              />
            )}

            {displayedNotes.length === 0 ? (
              <div className="empty-state">
                {section.icon}
                <p>Nothing here yet.</p>
                <span>
                  {currentView === "active"
                    ? "Create your first note above."
                    : currentView === "shared"
                    ? "Notes shared with you will appear here."
                    : "This section is empty."}
                </span>
              </div>
            ) : (
              <div className="notes-content">
                {/* Pinned section — only on active view */}
                {currentView === "active" && pinnedNotes.length > 0 && (
                  <>
                    <p className="notes-section-label">Pinned</p>
                    <div className="notes-grid">
                      {pinnedNotes.map((note) => (
                        <NoteCard
                          key={note._id}
                          note={note}
                          currentUser={user}
                          onPin={handlePinToggle}
                          onArchive={handleArchiveToggle}
                          onDelete={handleDeleteToggle}
                          onRestore={handleRestoreNote}
                          onEditClick={setSelectedEditNote}
                          onCollaborateClick={setSelectedCollabNote}
                        />
                      ))}
                    </div>
                    {regularNotes.length > 0 && (
                      <p className="notes-section-label">Others</p>
                    )}
                  </>
                )}

                {/* Main grid */}
                <div className="notes-grid">
                  {(currentView === "active" && pinnedNotes.length > 0
                    ? regularNotes
                    : displayedNotes
                  ).map((note) => (
                    <NoteCard
                      key={note._id}
                      note={note}
                      currentUser={user}
                      onPin={handlePinToggle}
                      onArchive={handleArchiveToggle}
                      onDelete={handleDeleteToggle}
                      onRestore={handleRestoreNote}
                      onEditClick={setSelectedEditNote}
                      onCollaborateClick={setSelectedCollabNote}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Edit Note Modal */}
      {selectedEditNote && (
        <NoteModal
          note={selectedEditNote}
          onClose={() => setSelectedEditNote(null)}
          onNoteUpdate={handleNoteUpdate}
          showNotification={showNotification}
        />
      )}

      {/* Collaboration Modal */}
      {selectedCollabNote && (
        <CollaborateModal
          note={selectedCollabNote}
          currentUser={user}
          onClose={() => setSelectedCollabNote(null)}
          onAddCollaborator={handleAddCollaborator}
          onRemoveCollaborator={handleRemoveCollaborator}
          onAddComment={handleAddComment}
          showNotification={showNotification}
        />
      )}

      {/* Requests Inbox Modal */}
      {showRequestsInbox && (
        <RequestsInbox
          requests={pendingRequests}
          onRespond={async (noteId, requestId, action) => {
            const ok = await handleRespondToRequest(noteId, requestId, action);
            if (ok && pendingRequests.length <= 1) setShowRequestsInbox(false);
          }}
          onClose={() => setShowRequestsInbox(false)}
        />
      )}
    </div>
  );
}
