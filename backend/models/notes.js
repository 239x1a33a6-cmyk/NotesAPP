const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema({
     title: {
          type: String,
          required: true,
          trim: true
     },
     content: {
          type: String,
          required: true
     },
     userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true
     },
     tags: [{
          type: String
     }],
     pinned: {
          type: Boolean,
          default: false
     },
     archived: {
          type: Boolean,
          default: false
     },
     deleted: {
          type: Boolean,
          default: false
     },
     collaborators: [
          {
               email: { type: String, required: true, trim: true, lowercase: true },
               name: { type: String, default: "" },
               role: { type: String, enum: ["viewer", "editor"], default: "editor" },
               addedAt: { type: Date, default: Date.now }
          }
     ],
     comments: [
          {
               authorName: { type: String, default: "User" },
               authorEmail: { type: String, required: true },
               text: { type: String, required: true },
               createdAt: { type: Date, default: Date.now }
          }
     ],
     activityLog: [
          {
               action: { type: String, required: true },
               performedBy: { type: String, default: "User" },
               timestamp: { type: Date, default: Date.now }
          }
     ],
     accessRequests: [
          {
               requesterId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
               requesterEmail: { type: String, required: true, trim: true, lowercase: true },
               requesterName: { type: String, default: "" },
               message: { type: String, default: "" },
               status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
               requestedAt: { type: Date, default: Date.now }
          }
     ]
}, { timestamps: true });

const Note = mongoose.model("Note", notesSchema);

module.exports = Note;