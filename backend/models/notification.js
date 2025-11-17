const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
  subteamId: { type: mongoose.Schema.Types.ObjectId, ref: "Subteam" },
  inviteId: { type: mongoose.Schema.Types.ObjectId, ref: "SubteamInvite" },

  type: {
    type: String,
    enum: [
      "SUBTEAM_HEAD_INVITE",
      "SUBTEAM_MEMBER_INVITE",
      "INVITE_ACCEPTED",
      "INVITE_REJECTED",
      "TASK_RESPONSE" // 🔥 ADD THIS
    ],
    required: true
  },

  message: { type: String, required: true },

  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
    default: "Pending"
  },

  isRead: { type: Boolean, default: false }

}, { timestamps: true });

module.exports = mongoose.model("Notification", NotificationSchema);