const mongoose = require('mongoose');

const SubteamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  headId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // optional subteam head
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // members of this subteam
  description: { type: String },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
}, { timestamps: true });

// common indexes
SubteamSchema.index({ teamId: 1 });
SubteamSchema.index({ headId: 1 });

module.exports = mongoose.model('Subteam', SubteamSchema);
