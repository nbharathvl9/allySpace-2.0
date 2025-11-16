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
    const { TeamName, description } = req.body;

    const team = await Team.create({
      TeamName,
      description,
      TeamHId: req.user._id
    });

    res.json({
      message: "Team created successfully",
      team
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/:teamId", protectRoute, async (req, res) => {
  try {
    const { teamId } = req.params;

    const team = await Team.findById(teamId)
      .populate("Subteams")        // if you want subteams
      .populate("TeamHId", "userName email");  // head details

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.json({ team });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports=router;