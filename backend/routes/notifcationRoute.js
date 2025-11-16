const express = require("express");
const router = express.Router();
const protectRoute = require("../middleware/protectRoute");
const Notification = require("../models/notification");

// GET ALL NOTIFICATIONS FOR LOGGED-IN USER
router.get("/", protectRoute, async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipientId: req.user._id
    })
      .populate("senderId", "userName email")
      .populate("teamId", "TeamName")
      .populate("subteamId", "name")
      .sort({ createdAt: -1 });

    res.json({ notifications });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
