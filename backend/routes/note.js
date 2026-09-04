const express = require("express");
const router = express.Router();
const {authenticateUser} = require("../middlewares/auth");
const {handleCreateNotes, 
       handleGetAllNotes,
       handleGetSpecificNote,
       handleCompleteUpdate,
       handleSearchNotes,
       handleGetNotesByTag,
       handlePinNotes,
       handleArchiveNotes,
       handleGetArchivedNotes,
       handleGetPinnedNotes,
       handleSoftDelete,
       handleGetTrashNotes,
       handleRestoreNote,
       handleAddCollaborator,
       handleRemoveCollaborator,
       handleAddComment,
       handleDiscoverNotes,
       handleRequestAccess,
       handleGetMyRequests,
       handleRespondToRequest
} = require("../controllers/note");

// Must be before /:id routes to avoid param conflicts
router.get("/discover", authenticateUser, handleDiscoverNotes);
router.get("/my-requests", authenticateUser, handleGetMyRequests);
router.get("/search", authenticateUser, handleSearchNotes);
router.get("/archived", authenticateUser, handleGetArchivedNotes);
router.get("/pinned", authenticateUser, handleGetPinnedNotes);
router.get("/trash", authenticateUser, handleGetTrashNotes);
router.get("/tag/:tag", authenticateUser, handleGetNotesByTag);

router.post("/", authenticateUser, handleCreateNotes);
router.get("/", authenticateUser, handleGetAllNotes);
router.get("/:id", authenticateUser, handleGetSpecificNote);
router.put("/:id", authenticateUser, handleCompleteUpdate);
router.delete("/:id", authenticateUser, handleSoftDelete);
router.patch("/:id/pin", authenticateUser, handlePinNotes);
router.patch("/:id/archive", authenticateUser, handleArchiveNotes);
router.patch("/:id/restore", authenticateUser, handleRestoreNote);
router.post("/:id/collaborators", authenticateUser, handleAddCollaborator);
router.delete("/:id/collaborators/:email", authenticateUser, handleRemoveCollaborator);
router.post("/:id/comments", authenticateUser, handleAddComment);
router.post("/:id/request-access", authenticateUser, handleRequestAccess);
router.patch("/:id/requests/:requestId", authenticateUser, handleRespondToRequest);

module.exports = router;