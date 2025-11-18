const express = require("express");
const router = express.Router();
const protectRoute = require("../middleware/protectRoute");

const Team = require("../models/team");
const Subteam = require("../models/subteam");
const User = require("../models/User");
const Notification = require("../models/notification");
const Task = require("../models/task");

// CREATE TASK
router.post("/create", protectRoute, async (req, res) => {
  try {
    const { title, description, assignedTo, teamId, subteamId, deadline } = req.body;

    const team = await Team.findById(teamId);
    const subteam = await Subteam.findById(subteamId);

    if (!team || !subteam)
      return res.status(404).json({ message: "Team or Subteam not found" });

    // Check Roles
    const isTeamHead = team.TeamHId.toString() === req.user._id.toString();
    const isSubteamHead = subteam.headId?.toString() === req.user._id.toString();
    const isMember = subteam.members.some(m => m.toString() === req.user._id.toString());  

    // 🔥 FIXED LOGIC: Use if-else to prioritize Head roles
    if (isTeamHead) {
      // Rule: Team Head -> Subteam Head
      if (assignedTo.toString() !== subteam.headId.toString()) {
        return res.status(403).json({ message: "Team Head can only assign tasks to Subteam Head" });
      }
    } 
    else if (isSubteamHead) {
      // Rule: Subteam Head -> Members
      // Ensure we compare strings for the includes check
      const isAssigneeMember = subteam.members.some(m => m.toString() === assignedTo.toString());
      
      if (!isAssigneeMember) {
        return res.status(403).json({ message: "Subteam Head can only assign tasks to Subteam Members" });
      }
    } 
    else if (isMember) {
      // Rule: Members cannot assign
      return res.status(403).json({ message: "Members cannot assign tasks" });
    } 
    else {
      return res.status(403).json({ message: "Not authorized to assign tasks in this subteam" });
    }

    // CREATE TASK OBJECT
    const task = await Task.create({
      title,
      description,
      assignedTo,
      assignedBy: req.user._id,
      teamId,
      subteamId,
      deadline
    });

    // STORE TASK REFERENCE
    if (isTeamHead) {
      team.tasks.push(task._id);
      await team.save();
    }

    if (isSubteamHead) {
      subteam.tasks.push(task._id);
      await subteam.save();
    }

    res.json({
      message: "Task created successfully",
      task
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/respond", protectRoute, async (req, res) => {
  try {
    const { taskId, status, message } = req.body;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "This is not your task" });
    }

    const team = await Team.findById(task.teamId);
    const subteam = await Subteam.findById(task.subteamId);

    const isSubteamHead = subteam.headId?.toString() === req.user._id.toString();
    const isMember = subteam.members.includes(req.user._id);

    // ---------------------
    // Determine Recipient (Team Head or Subteam Head)
    // ---------------------
    let recipientId = null;
    if (isSubteamHead) recipientId = team.TeamHId;
    if (isMember) recipientId = subteam.headId;

    if (recipientId) {
      await Notification.create({
        recipientId: recipientId,
        senderId: req.user._id,
        teamId: team._id,
        subteamId: subteam._id, // 🔥 ADDED THIS to allow path tracking
        type: "TASK_RESPONSE",
        message: message || `User responded to task: ${task.title}`
      });
    }

    // Update task fields
    task.status = status;
    task.responseMessage = message; 
    await task.save();

    res.json({
      message: "Task response sent successfully",
      task
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/assigned", protectRoute, async (req, res) => {
  try {
    const tasks = await Task.find({
      assignedTo: req.user._id
    })
      .populate("assignedBy", "userName email")
      .populate("teamId", "TeamName")
      .populate("subteamId", "name");

    res.json({ tasks });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports=router;