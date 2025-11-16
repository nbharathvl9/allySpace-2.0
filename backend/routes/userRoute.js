const express = require("express");
const router = express.Router();
const protectRoute = require("../middleware/protectRoute");
const User = require("../models/User");

const Team = require("../models/team");
const Subteam = require("../models/subteam");
const Notification = require("../models/notification");
const Task = require("../models/task");

// Protected route example
router.get("/profile", protectRoute, async (req, res) => {
  res.json({
    message: "Authorized",
    user: req.user,
  });
});
router.put("/profile", protectRoute, async (req, res) => {
  try {
    const { userName, email } = req.body;

    // Check duplicates except current user's own values
    if (email && email !== req.user.email) {
      if (await User.findOne({ email })) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    if (userName && userName !== req.user.userName) {
      if (await User.findOne({ userName })) {
        return res.status(400).json({ message: "Username already taken" });
      }
    }

    const updatedUser = await User.findOneAndUpdate(
      { id: req.user.id },
      { userName, email },
      { new: true }
    ).select("-password");

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/notifications", protectRoute, async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipientId: req.user._id
    })
      .sort({ createdAt: -1 })
      .populate("senderId", "userName email")
      .populate("teamId", "TeamName");

    res.json({ notifications });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});
router.put("/notifications/read/:id", protectRoute, async (req, res) => {
  try {
    const { id } = req.params;

    const notif = await Notification.findOne({
      _id: id,
      recipientId: req.user._id
    });

    if (!notif) return res.status(404).json({ message: "Notification not found" });

    notif.isRead = true;
    await notif.save();

    res.json({ message: "Notification marked as read" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});
router.delete("/notifications/:id", protectRoute, async (req, res) => {
  try {
    const { id } = req.params;

    const notif = await Notification.findOneAndDelete({
      _id: id,
      recipientId: req.user._id
    });

    if (!notif)
      return res.status(404).json({ message: "Notification not found" });

    res.json({ message: "Notification deleted" });
    
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;