// API Base URL Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8002";

export const API_ENDPOINTS = {
  // User endpoints
  register: `${API_BASE_URL}/user/register`,
  login: `${API_BASE_URL}/user/login`,
  logout: `${API_BASE_URL}/user/logout`,

  // Notes endpoints
  getNotes: `${API_BASE_URL}/notes`,
  getTrashNotes: `${API_BASE_URL}/notes/trash`,
  discoverNotes: `${API_BASE_URL}/notes/discover`,
  myRequests: `${API_BASE_URL}/notes/my-requests`,
  createNote: `${API_BASE_URL}/notes`,

  // Helper function to build note-specific URLs
  getNoteById: (noteId) => `${API_BASE_URL}/notes/${noteId}`,
  pinNote: (noteId) => `${API_BASE_URL}/notes/${noteId}/pin`,
  archiveNote: (noteId) => `${API_BASE_URL}/notes/${noteId}/archive`,
  deleteNote: (noteId) => `${API_BASE_URL}/notes/${noteId}`,
  restoreNote: (noteId) => `${API_BASE_URL}/notes/${noteId}/restore`,
  addCollaborator: (noteId) => `${API_BASE_URL}/notes/${noteId}/collaborators`,
  removeCollaborator: (noteId, email) =>
    `${API_BASE_URL}/notes/${noteId}/collaborators/${encodeURIComponent(email)}`,
  addComment: (noteId) => `${API_BASE_URL}/notes/${noteId}/comments`,
  requestAccess: (noteId) => `${API_BASE_URL}/notes/${noteId}/request-access`,
  respondToRequest: (noteId, requestId) =>
    `${API_BASE_URL}/notes/${noteId}/requests/${requestId}`,
};

// Helper function for fetch with credentials
export async function apiFetch(url, options = {}) {
  return fetch(url, {
    ...options,
    credentials: "include", // Always include credentials for auth
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
}
