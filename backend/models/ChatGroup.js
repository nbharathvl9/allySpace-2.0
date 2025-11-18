const mongoose = require("mongoose");

const ChatGroupSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Group Name (Team Name or Subteam Name)
  isGroup: { type: Boolean, default: true },
  
  // 🔥 We store the custom "role" string here for the requested display format
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    displayRole: { type: String } // e.g. "AI Project" or "Frontend 'head'"
  }],
  
  relatedTeamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
  relatedSubteamId: { type: mongoose.Schema.Types.ObjectId, ref: "Subteam" },
  
  lastMessage: { type: String },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("ChatGroup", ChatGroupSchema);