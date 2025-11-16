const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
  subteamId: { type: mongoose.Schema.Types.ObjectId, ref: "Subteam" },
  status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
  deadline: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model("Task", TaskSchema);
