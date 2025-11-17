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

// 🔥 SEARCH TEAMS & SUBTEAMS
router.get("/search", protectRoute, async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.json({ teams: [] });

    // Find teams matching name, populate subteams
    const teams = await Team.find({
      TeamName: { $regex: query, $options: "i" }
    })
    .populate("Subteams", "name description headId members")
    .limit(10);

    res.json({ teams });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/head", protectRoute, async (req, res) => {
  try {
    const teams = await Team.find({ TeamHId: req.user._id });

    res.json({
      message: "Teams fetched successfully",
      teams
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/:teamId", protectRoute, async (req, res) => {
  try {
    const { teamId } = req.params;

    // Fetch team with subteams + head info
    const team = await Team.findById(teamId)
      .populate({
        path: "Subteams",
        populate: [
          { path: "headId", select: "userName email" },
          { path: "members", select: "userName email" },
          { path: "tasks" }
        ]
      })
      .populate("TeamHId", "userName email");  // Team head details

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