const express = require("express");
const router = express.Router();
const protectRoute = require("../middleware/protectRoute");

const Team = require("../models/team");
const Subteam = require("../models/subteam");
const User = require("../models/User");
const Notification = require("../models/notification");
const Task = require("../models/task");
const SubteamInvite=require("../models/SubTeamInvite.js")
// 
router.get("/head", protectRoute, async (req, res) => {
  try {
    const subteams = await Subteam.find({
      headId: req.user._id
    }).populate("teamId");

    res.json({ subteams });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/member", protectRoute, async (req, res) => {
  try {
    const subteams = await Subteam.find({
      members: req.user._id
    }).populate("teamId");

    res.json({ subteams });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/request", protectRoute, async (req, res) => {
  try {
    const { teamId, name, description, headUserName } = req.body;

    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: "Team not found" });

    if (team.TeamHId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only team head can create subteam requests" });
    }

    const headUser = await User.findOne({ userName: headUserName });
    if (!headUser) return res.status(404).json({ message: "User not found" });

    // Create invite record
    const invite = await SubteamInvite.create({
      teamId,
      name,
      description,
      headId: headUser._id,
      senderId: req.user._id
    });

    // Send notification
    await Notification.create({
      recipientId: headUser._id,
      senderId: req.user._id,
      teamId,
      type: "TEAM_INVITE",
      message: `You are invited to become the head of subteam "${name}".`,
    });

    res.json({
      message: "Subteam head invitation sent",
      inviteId: invite._id
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/accept", protectRoute, async (req, res) => {
  try {
    const { inviteId } = req.body;

    const invite = await SubteamInvite.findById(inviteId);
    if (!invite) return res.status(404).json({ message: "Invite not found" });

    if (invite.headId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not your invite" });
    }

    invite.status = "Accepted";
    await invite.save();

    // Create the actual subteam
    const subteam = await Subteam.create({
      name: invite.name,
      description: invite.description,
      teamId: invite.teamId,
      headId: invite.headId,
    });

    // Push into team
    await Team.findByIdAndUpdate(invite.teamId, {
      $push: { Subteams: subteam._id }
    });

    res.json({
      message: "You accepted the invitation. Subteam created.",
      subteam
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/reject", protectRoute, async (req, res) => {
  try {
    const { inviteId } = req.body;

    const invite = await SubteamInvite.findById(inviteId);
    if (!invite) return res.status(404).json({ message: "Invite not found" });

    if (invite.headId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not your invite" });
    }

    invite.status = "Rejected";
    await invite.save();

    // Notify sender
    await Notification.create({
      recipientId: invite.senderId,
      senderId: req.user._id,
      teamId: invite.teamId,
      type: "TEAM_INVITE",
      message: `${req.user.userName} rejected the subteam head offer.`,
    });

    res.json({ message: "You rejected the offer. Subteam not created." });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/add-member", protectRoute, async (req, res) => {
  try {
    const { subteamId, userName } = req.body;

    const user = await User.findOne({ userName });
    if (!user) return res.status(404).json({ message: "User not found" });

    const subteam = await Subteam.findById(subteamId);
    subteam.members.push(user._id);
    await subteam.save();

    res.json({ message: "Member added", subteam });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/invite-member", protectRoute, async (req, res) => {
  try {
    const { subteamId, userName } = req.body;

    const subteam = await Subteam.findById(subteamId);
    if (!subteam) return res.status(404).json({ message: "Subteam not found" });

    if (subteam.headId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only subteam head can invite members" });
    }

    const user = await User.findOne({ userName });
    if (!user) return res.status(404).json({ message: "User not found" });

    const notif = await Notification.create({
      recipientId: user._id,
      senderId: req.user._id,
      teamId: subteam.teamId,
      type: "TEAM_INVITE",
      message: `You are invited to join subteam "${subteam.name}".`,
    });

    res.json({ message: "Member invite sent", notificationId: notif._id });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/accept-member", protectRoute, async (req, res) => {
  try {
    const { notificationId, subteamId } = req.body;

    const notif = await Notification.findById(notificationId);
    if (!notif) return res.status(404).json({ message: "Notification not found" });

    const subteam = await Subteam.findById(subteamId);
    if (!subteam) return res.status(404).json({ message: "Subteam not found" });

    // Add member
    subteam.members.push(req.user._id);
    await subteam.save();

    notif.status = "Accepted";
    notif.isRead = true;
    await notif.save();

    res.json({ message: "You joined the subteam", subteam });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/reject-member", protectRoute, async (req, res) => {
  try {
    const { notificationId } = req.body;

    const notif = await Notification.findById(notificationId);
    if (!notif) return res.status(404).json({ message: "Notification not found" });

    notif.status = "Rejected";
    notif.isRead = true;
    await notif.save();

    // Send rejection notice
    await Notification.create({
      recipientId: notif.senderId,
      senderId: req.user._id,
      teamId: notif.teamId,
      message: `${req.user.userName} rejected the member invite`,
    });

    res.json({ message: "You rejected the invite" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports=router;
