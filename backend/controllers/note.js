const Note = require("../models/notes");
const User = require("../models/user");

async function handleCreateNotes(req, res){
     try{
          const {title, content, tags} = req.body;
          if(!title || !content){
               return res.status(400).json({
                    message: "Title and content are required"
               });
          }

          const userId = req.user.id;
          const userEmail = req.user.email || "Author";
          const note = await Note.create({
               title,
               content,
               tags,
               userId,
               activityLog: [
                    {
                         action: "Created note",
                         performedBy: userEmail,
                         timestamp: new Date()
                    }
               ]
          });

          return res.status(201).json({
               message: "Note Created Successfully",
               note
          });
     } catch(err){
          return res.status(500).json({
               message: "Error while creating notes",
          })
     }
}

async function handleGetAllNotes(req, res){
     try{
          const userId = req.user.id;
          const userEmail = req.user.email ? req.user.email.toLowerCase() : "";
          const notes = await Note.find({
               $or: [
                    { userId: userId },
                    { "collaborators.email": userEmail }
               ],
               deleted: false
          }).sort({ updatedAt: -1 });

          return res.status(200).json({
               message: "Notes Fetched Successfully",
               notes
          })
     } catch(err){
          return res.status(500).json({
               message: "Error while reteriving the notes"
          });
     }
}

async function handleGetSpecificNote(req, res){
     try{
          const noteId = req.params.id;
          const userId = req.user.id;
          const userEmail = req.user.email ? req.user.email.toLowerCase() : "";

          const notes = await Note.findOne({
               _id: noteId,
               $or: [
                    { userId: userId },
                    { "collaborators.email": userEmail }
               ]
          });

          if(!notes){
               return res.status(404).json({
                    message: "Note not found or access denied"
               })
          }

          return res.status(200).json({
               message: "Fetch Successfull",
               notes
          });
     } catch(err){
          return res.status(500).json({
               message: "Cannot get Notes Due to error",
               error: err.message
          });

     }
}

async function handleCompleteUpdate(req, res){
     try{
          const noteId = req.params.id;
          const userId = req.user.id;
          const userEmail = req.user.email ? req.user.email.toLowerCase() : "";
          const {title, content, tags} = req.body;

          const note = await Note.findOne({
               _id: noteId,
               $or: [
                    { userId: userId },
                    { "collaborators.email": userEmail, "collaborators.role": "editor" }
               ]
          });

          if(!note){
               return res.status(404).json({
                    message: "Note not found or you lack edit permission"
               });
          }

          note.title = title || note.title;
          note.content = content !== undefined ? content : note.content;
          if(tags) note.tags = tags;
          
          if (!note.activityLog) note.activityLog = [];
          note.activityLog.push({
               action: "Edited note content",
               performedBy: userEmail || "User",
               timestamp: new Date()
          });

          await note.save();

          return res.status(200).json({
               message: "Note updated Successfully",
               note
          });

     } catch(err){
          return res.status(500).json({
               message: "Error updating the notes",
               error: err.message
          })
     }
}

async function handleSearchNotes(req, res){
     try{
          const query = req.query.query;
          const userId = req.user.id;
          console.log(query);
          console.log(typeof userId);
          
          const notes = await Note.find({
               userId,
               title:{
                    $regex: query,
                    $options: "i"
               }
          });
          return res.status(200).json({
               message:"Notes fetched successfully",
               notes
          })
     } 
     catch(err){
          res.status(500).json({
               message:"Error while searching the notes",
               error: err.message
          })
     }
}

async function handleGetNotesByTag(req, res){
     try{
          const tag = req.params.tag;
          const userId = req.user.id;

          const notes = await Note.find({
               userId,
               tags:{
                    $regex: tag,
                    $options: "i"
               }
          });

          return res.status(200).json({
               message: "Notes fetched successfully",
               notes
          })
     }
     catch(err){
          return res.status(500).json({
               message:"Notes with tag not found",
               error: err.message
          })
     }
}

async function handlePinNotes(req, res){
     try{
          const noteId = req.params.id;
          const userId = req.user.id;
          const userEmail = req.user.email ? req.user.email.toLowerCase() : "";
          const note = await Note.findOne({
               _id: noteId,
               $or: [
                    { userId: userId },
                    { "collaborators.email": userEmail }
               ]
          });

          if(!note){
               return res.status(404).json({
                    message: "Notes not found"
               });
          }

          note.pinned = !note.pinned;
          await note.save();

          return res.status(200).json({
               message: "Notes Pinned successfully",
               note
          });
     }
     catch(err){
          return res.status(500).json({
               message: "Error while pinning the notes",
               error: err.message
          })
     }
}

async function handleArchiveNotes(req, res){
     try{
          const noteId = req.params.id;
          const userId = req.user.id;
          const userEmail = req.user.email ? req.user.email.toLowerCase() : "";

          const note = await Note.findOne({
               _id: noteId,
               $or: [
                    { userId: userId },
                    { "collaborators.email": userEmail }
               ]
          });

          if(!note){
               return res.status(404).json({
                    message: "Note not found"
               });
          }

          note.archived = !note.archived;
          await note.save();

          return res.status(200).json({
               message: "Note Archived Successfully",
               note
          })
     }
     catch(err){
          return res.status(500).json({
               message: "Error while archiving the notes",
               error: err.message
          })
     }
}

async function handleGetArchivedNotes(req, res){
     try{
          const userId = req.user.id;

          const note = await Note.find({
               userId,
               archived: true
          })

          if(!note){
               return res.status(400).json({
                    message: "No archived notes",
               });
          }

          return res.status(200).json({
               message: "Archived notes fetched successfully",
               note
          })
     }
     catch(err){
          return res.status(500).json({
               message: "Error while fetching archived notes",
               error: err.message
          });
     }
}

async function handleGetPinnedNotes(req, res){
     try{
          const userId = req.user.id;

          const note = await Note.find({
               userId, 
               pinned: true
          });

          if(!note){
               return res.status(404).json({
                    message: "No Pinned notes"
               });
          }

          return res.status(200).json({
               message: "Pinned Notes fetched successfully",
               note
          })
     }
     catch(err){
          return res.status(500).json({
               message: "Error while fetching pinned notes",
               error: err.message
          })
     }
}

async function handleSoftDelete(req, res){
     try{
          const noteId = req.params.id;
          const userId = req.user.id;

          const note = await Note.findOne({
               _id: noteId,
               userId
          });
          if(!note){
               return res.status(404).json({
                    message: "Note not found"
               });
          }

          note.deleted =  !note.deleted;
          await note.save();
          return res.status(200).json({
               message: "Note deleted successfully",
          });
     } 
     catch(err){
          return res.status(500).json({
               message: "Error while deleting notes",
               error: err.message
          });
     }
}

async function handleGetTrashNotes(req, res){
     try{
          const noteId = req.params.id;
          const userId = req.user.id;

          const notes = await Note.find({
               userId,
               deleted: true
          });

          return res.status(200).json({
               messageP: "Trash notes fetched successfully",
               notes
          });
     }
     catch(err){
          return res.status(500).json({
               message: "Error while fetcching trash notes",
               error: err.message
          });
     }
}

async function handleRestoreNote(req, res){
     try{
          const noteId = req.params.id;
          const userId = req.user.id;
          const note = await Note.findOne({
               _id: noteId,
               userId
          });
          
          if(!note){
               return res.status(404).json({
                    message: "Note not found"
               });
          }

          note.deleted = false;
          await note.save();

          return res.status(200).json({
               message: "Note restored successfully",
               note
          })
     }
     catch(err){
          return res.status(500).json({
               message: "Error while restoring note",
               error: err.message
          })
     }
}

async function handleAddCollaborator(req, res){
     try{
          const noteId = req.params.id;
          const userId = req.user.id;
          const userEmail = req.user.email || "User";
          const { email, role, name } = req.body;

          if(!email){
               return res.status(400).json({ message: "Collaborator email is required" });
          }

          const cleanEmail = email.toLowerCase().trim();

          const targetUser = await User.findOne({ email: cleanEmail });
          if (!targetUser) {
               return res.status(404).json({
                    message: "User not found with this email. They must have an account to collaborate."
               });
          }

          const note = await Note.findOne({
               _id: noteId,
               userId: userId
          });

          if(!note){
               return res.status(404).json({ message: "Note not found or only the owner can invite collaborators" });
          }

          if(!note.collaborators) note.collaborators = [];
          
          const alreadyAdded = note.collaborators.some(c => c.email === cleanEmail);
          if(alreadyAdded){
               return res.status(400).json({ message: "User is already a collaborator on this note" });
          }

          note.collaborators.push({
               email: cleanEmail,
               name: targetUser.name || name || cleanEmail.split("@")[0],
               role: role || "editor",
               addedAt: new Date()
          });

          if(!note.activityLog) note.activityLog = [];
          note.activityLog.push({
               action: `Added ${cleanEmail} as ${role || 'editor'}`,
               performedBy: userEmail,
               timestamp: new Date()
          });

          await note.save();

          return res.status(200).json({
               message: "Collaborator added successfully",
               note
          });
     } catch(err){
          return res.status(500).json({
               message: "Error adding collaborator",
               error: err.message
          });
     }
}

async function handleRemoveCollaborator(req, res){
     try{
          const noteId = req.params.id;
          const userId = req.user.id;
          const userEmail = req.user.email || "User";
          const targetEmail = req.params.email ? req.params.email.toLowerCase().trim() : "";

          const note = await Note.findOne({
               _id: noteId,
               userId: userId
          });

          if(!note){
               return res.status(404).json({ message: "Note not found or only the owner can remove collaborators" });
          }

          note.collaborators = (note.collaborators || []).filter(c => c.email !== targetEmail);

          if(!note.activityLog) note.activityLog = [];
          note.activityLog.push({
               action: `Removed ${targetEmail} from workspace`,
               performedBy: userEmail,
               timestamp: new Date()
          });

          await note.save();

          return res.status(200).json({
               message: "Collaborator removed",
               note
          });
     } catch(err){
          return res.status(500).json({
               message: "Error removing collaborator",
               error: err.message
          });
     }
}

async function handleAddComment(req, res){
     try{
          const noteId = req.params.id;
          const userId = req.user.id;
          const userEmail = req.user.email ? req.user.email.toLowerCase() : "user@example.com";
          const { text, authorName } = req.body;

          if(!text || !text.trim()){
               return res.status(400).json({ message: "Comment text cannot be empty" });
          }

          const note = await Note.findOne({
               _id: noteId,
               $or: [
                    { userId: userId },
                    { "collaborators.email": userEmail }
               ]
          });

          if(!note){
               return res.status(404).json({ message: "Note not found or you lack permission to comment" });
          }

          const newComment = {
               authorName: authorName || req.user.name || userEmail.split("@")[0],
               authorEmail: userEmail,
               text: text.trim(),
               createdAt: new Date()
          };

          if(!note.comments) note.comments = [];
          note.comments.push(newComment);

          if(!note.activityLog) note.activityLog = [];
          note.activityLog.push({
               action: `Commented: "${text.trim().substring(0, 30)}${text.trim().length > 30 ? '...' : ''}"`,
               performedBy: newComment.authorName,
               timestamp: new Date()
          });

          await note.save();

          return res.status(201).json({
               message: "Comment added successfully",
               note
          });
     } catch(err){
          return res.status(500).json({
               message: "Error adding comment",
               error: err.message
          });
     }
}

// GET /notes/discover - all notes not owned by current user (no content exposed)
async function handleDiscoverNotes(req, res){
     try{
          const userId = req.user.id;
          const userEmail = req.user.email ? req.user.email.toLowerCase() : "";

          const notes = await Note.find({
               userId: { $ne: userId },
               deleted: false
          }).populate("userId", "name email").sort({ updatedAt: -1 });

          const safeNotes = notes.map(n => ({
               _id: n._id,
               title: n.title,
               tags: n.tags,
               ownerName: n.userId?.name || "Unknown",
               ownerEmail: n.userId?.email || "",
               collaboratorCount: n.collaborators?.length || 0,
               commentCount: n.comments?.length || 0,
               updatedAt: n.updatedAt,
               createdAt: n.createdAt,
               hasAccess: n.collaborators?.some(c => c.email === userEmail) || false,
               hasPendingRequest: n.accessRequests?.some(
                    r => r.requesterEmail === userEmail && r.status === "pending"
               ) || false
          }));

          return res.status(200).json({ message: "Discover notes fetched", notes: safeNotes });
     } catch(err){
          return res.status(500).json({ message: "Error fetching discover notes", error: err.message });
     }
}

// POST /notes/:id/request-access
async function handleRequestAccess(req, res){
     try{
          const noteId = req.params.id;
          const userId = req.user.id;
          const userEmail = req.user.email ? req.user.email.toLowerCase() : "";
          const { message } = req.body;

          const requester = await User.findById(userId);
          const note = await Note.findOne({ _id: noteId, deleted: false });

          if(!note){
               return res.status(404).json({ message: "Note not found" });
          }

          if(note.userId.toString() === userId){
               return res.status(400).json({ message: "You already own this note" });
          }

          if(note.collaborators?.some(c => c.email === userEmail)){
               return res.status(400).json({ message: "You already have access to this note" });
          }

          const existingPending = note.accessRequests?.find(
               r => r.requesterEmail === userEmail && r.status === "pending"
          );
          if(existingPending){
               return res.status(400).json({ message: "You already have a pending access request" });
          }

          if(!note.accessRequests) note.accessRequests = [];
          note.accessRequests.push({
               requesterId: userId,
               requesterEmail: userEmail,
               requesterName: requester?.name || userEmail.split("@")[0],
               message: message || "",
               status: "pending",
               requestedAt: new Date()
          });

          if(!note.activityLog) note.activityLog = [];
          note.activityLog.push({
               action: `${requester?.name || userEmail} requested access`,
               performedBy: userEmail,
               timestamp: new Date()
          });

          await note.save();

          return res.status(200).json({ message: "Access request sent successfully" });
     } catch(err){
          return res.status(500).json({ message: "Error sending access request", error: err.message });
     }
}

// GET /notes/my-requests - get all pending requests on notes I own
async function handleGetMyRequests(req, res){
     try{
          const userId = req.user.id;

          const notes = await Note.find({
               userId: userId,
               deleted: false,
               "accessRequests.status": "pending"
          });

          const requests = [];
          notes.forEach(note => {
               (note.accessRequests || []).forEach(req => {
                    if(req.status === "pending"){
                         requests.push({
                              requestId: req._id,
                              noteId: note._id,
                              noteTitle: note.title,
                              requesterId: req.requesterId,
                              requesterEmail: req.requesterEmail,
                              requesterName: req.requesterName,
                              message: req.message,
                              requestedAt: req.requestedAt
                         });
                    }
               });
          });

          return res.status(200).json({ message: "Access requests fetched", requests });
     } catch(err){
          return res.status(500).json({ message: "Error fetching requests", error: err.message });
     }
}

// PATCH /notes/:id/requests/:requestId - accept or reject
async function handleRespondToRequest(req, res){
     try{
          const { id: noteId, requestId } = req.params;
          const userId = req.user.id;
          const userEmail = req.user.email || "";
          const { action } = req.body;

          if(!["accept", "reject"].includes(action)){
               return res.status(400).json({ message: "Action must be 'accept' or 'reject'" });
          }

          const note = await Note.findOne({ _id: noteId, userId: userId });

          if(!note){
               return res.status(404).json({ message: "Note not found or not your note" });
          }

          const request = (note.accessRequests || []).find(r => r._id.toString() === requestId);

          if(!request){
               return res.status(404).json({ message: "Request not found" });
          }

          if(request.status !== "pending"){
               return res.status(400).json({ message: "This request has already been responded to" });
          }

          request.status = action === "accept" ? "accepted" : "rejected";

          if(action === "accept"){
               if(!note.collaborators) note.collaborators = [];
               const alreadyCollab = note.collaborators.some(c => c.email === request.requesterEmail);
               if(!alreadyCollab){
                    note.collaborators.push({
                         email: request.requesterEmail,
                         name: request.requesterName,
                         role: "editor",
                         addedAt: new Date()
                    });
               }
          }

          if(!note.activityLog) note.activityLog = [];
          note.activityLog.push({
               action: `${action === "accept" ? "Accepted" : "Rejected"} access request from ${request.requesterEmail}`,
               performedBy: userEmail,
               timestamp: new Date()
          });

          await note.save();

          return res.status(200).json({
               message: `Request ${action === "accept" ? "accepted" : "rejected"} successfully`
          });
     } catch(err){
          return res.status(500).json({ message: "Error responding to request", error: err.message });
     }
}

module.exports = {
     handleCreateNotes,
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
}