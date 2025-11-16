const express = require("express");
const router = express.Router();
const protectRoute = require("../middleware/protectRoute");

const Team = require("../models/team");
const Subteam = require("../models/subteam");
const User = require("../models/User");
const Notification = require("../models/notification");
const Task = require("../models/task");

router.post("/create", protectRoute, async (req, res) => {
  try {
    const { title, description, assignedTo, teamId, subteamId, deadline } = req.body;

    const team = await Team.findById(teamId);
    const subteam = await Subteam.findById(subteamId);

    if (!team || !subteam)
      return res.status(404).json({ message: "Team or Subteam not found" });

    const isTeamHead = team.TeamHId.toString() === req.user._id.toString();
    const isSubteamHead = subteam.headId?.toString() === req.user._id.toString();
    const isMember = subteam.members.includes(req.user._id);  

    // RULE 1: Team Head → Subteam Head ONLY
    if (isTeamHead) {
      if (assignedTo.toString() !== subteam.headId.toString()) {
        return res.status(403).json({ message: "Team Head can only assign tasks to Subteam Head" });
      }
    }

    // RULE 2: Subteam Head → Members ONLY
    if (isSubteamHead) {
      if (!subteam.members.includes(assignedTo)) {
        return res.status(403).json({ message: "Subteam Head can only assign tasks to Subteam Members" });
      }
    }

    // RULE 3: Members CANNOT assign tasks
    if (isMember) {
      return res.status(403).json({ message: "Members cannot assign tasks" });
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

    // STORE TASK BASED ON ROLE
    if (isTeamHead) {
      // Save task under TEAM
      team.tasks.push(task._id);
      await team.save();
    }

    if (isSubteamHead) {
      // Save task under SUBTEAM
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
    const { taskId, status } = req.body;

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
    // RULE A: Subteam Head responds to Team Head
    // ---------------------
    if (isSubteamHead) {
      await Notification.create({
        recipientId: team.TeamHId,
        senderId: req.user._id,
        teamId: team._id,
        type: "TASK_RESPONSE",
        message: `Subteam Head responded to task: ${task.title}`
      });
    }

    // ---------------------
    // RULE B: Member responds to Subteam Head
    // ---------------------
    if (isMember) {
      await Notification.create({
        recipientId: subteam.headId,
        senderId: req.user._id,
        teamId: team._id,
        type: "TASK_RESPONSE",
        message: `Member responded to task: ${task.title}`
      });
    }

    // Update task
    task.status = status;
    await task.save();

    res.json({
      message: "Task response sent",
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
