const express = require("express");
const router = express.Router();
const protectRoute = require("../middleware/protectRoute");

const Team = require("../models/team");
const Subteam = require("../models/subteam");
const User = require("../models/User");
const Notification = require("../models/notification");
const Task = require("../models/task");
const SubteamInvite = require("../models/SubTeamInvite.js");

// ---------------------------------------------------------
// 1. GET MEMBERS + TASKS (Updated to return teamId)
// ---------------------------------------------------------
router.get("/return-subteams/:id", async (req, res) => {
  try {
    const subteamId = req.params.id;

    // Step 1: Find subteam + populate all members
    const subteam = await Subteam.findById(subteamId)
      .populate("members", "userName email")
      .lean();

    if (!subteam) {
      return res.status(404).json({ message: "Subteam not found" });
    }

    // Step 2: Get all tasks in this subteam
    const tasks = await Task.find({ subteamId }).lean();

    // Step 3: Attach tasks to members
    const membersWithTaskInfo = subteam.members.map((member) => {
      const task = tasks.find(
        (t) => t.assignedTo?.toString() === member._id.toString()
      );

      return {
        _id: member._id,
        userName: member.userName,
        email: member.email,

        assignedTask: task ? task.title : "No task assigned",
        description: task ? task.description : "",
        status: task ? task.status : "Pending",
        deadline: task ? task.deadline : null,
        responseMessage: task ? task.responseMessage : "" 
      };
    });

    res.json({
      subteamName: subteam.name,
      teamId: subteam.teamId, // 🔥 ADDED: Required for Assign Task Modal
      members: membersWithTaskInfo,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------------------------------------------------
// 2. INVITE SUBTEAM HEAD
// ---------------------------------------------------------
router.post("/invite-subteam-head", protectRoute, async (req, res) => {
  try {
    const { teamId, name, description, headUserName } = req.body;

    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: "Team not found" });

    if (team.TeamHId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only team head can invite subteam heads." });
    }

    const headUser = await User.findOne({ userName: headUserName });
    if (!headUser) return res.status(404).json({ message: "User not found" });

    // Save invite info
    const invite = await SubteamInvite.create({
      teamId,
      name,
      description,
      headId: headUser._id,
      senderId: req.user._id
    });

    // Notification
    await Notification.create({
      recipientId: headUser._id,
      senderId: req.user._id,
      teamId,
      type: "SUBTEAM_HEAD_INVITE",
      message: `You are invited to lead the subteam "${name}".`,
      inviteId: invite._id
    });

    res.json({
      message: "Subteam head invite sent.",
      inviteId: invite._id
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------------------------------------------------
// 3. ACCEPT SUBTEAM HEAD
// ---------------------------------------------------------
router.post("/accept-subteam-head", protectRoute, async (req, res) => {
  try {
    const { inviteId, notificationId } = req.body;

    const invite = await SubteamInvite.findById(inviteId);
    if (!invite) return res.status(404).json({ message: "Invite not found" });

    if (invite.status !== "Pending") {
      return res.status(400).json({ message: "Invite already processed" });
    }

    if (invite.headId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not your invite" });
    }

    invite.status = "Accepted";
    await invite.save();

    const subteam = await Subteam.create({
      name: invite.name,
      description: invite.description,
      teamId: invite.teamId,
      headId: invite.headId
    });

    await Team.findByIdAndUpdate(invite.teamId, { $push: { Subteams: subteam._id } });

    // Update notification status
    if (notificationId) {
      await Notification.findByIdAndUpdate(notificationId, { status: "Accepted", isRead: true });
    }

    // Notify sender
    await Notification.create({
      recipientId: invite.senderId,
      senderId: req.user._id,
      teamId: invite.teamId,
      type: "INVITE_ACCEPTED",
      message: `${req.user.userName} accepted and became Subteam Head of "${invite.name}".`,
      inviteId: invite._id
    });

    res.json({ message: "Accepted invite. Subteam created.", subteam });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------------------------------------------------
// 4. REJECT SUBTEAM HEAD
// ---------------------------------------------------------
router.post("/reject-subteam-head", protectRoute, async (req, res) => {
  try {
    const { inviteId, notificationId } = req.body;

    const invite = await SubteamInvite.findById(inviteId);
    if (!invite) return res.status(404).json({ message: "Invite not found" });

    if (invite.status !== "Pending") {
      return res.status(400).json({ message: "Invite already processed" });
    }

    invite.status = "Rejected";
    await invite.save();

    if (notificationId) {
      await Notification.findByIdAndUpdate(notificationId, { status: "Rejected", isRead: true });
    }

    await Notification.create({
      recipientId: invite.senderId,
      senderId: req.user._id,
      teamId: invite.teamId,
      type: "INVITE_REJECTED",
      message: `${req.user.userName} rejected the Subteam Head invite.`
    });

    res.json({ message: "Rejected invite" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------------------------------------------------
// 5. INVITE MEMBER
// ---------------------------------------------------------
router.post("/invite-member", protectRoute, async (req, res) => {
  try {
    const { subteamId, userName } = req.body;

    const subteam = await Subteam.findById(subteamId);
    if (!subteam) return res.status(404).json({ message: "Subteam not found" });

    if (subteam.headId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Only subteam head can invite members" });

    const user = await User.findOne({ userName });
    if (!user) return res.status(404).json({ message: "User not found" });

    const notif = await Notification.create({
      recipientId: user._id,
      senderId: req.user._id,
      teamId: subteam.teamId,
      subteamId: subteam._id,
      type: "SUBTEAM_MEMBER_INVITE",
      message: `You are invited to join subteam "${subteam.name}".`
    });

    res.json({ message: "Member invite sent", notificationId: notif._id });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------------------------------------------------
// 6. ACCEPT MEMBER
// ---------------------------------------------------------
router.post("/accept-member", protectRoute, async (req, res) => {
  try {
    const { notificationId } = req.body;

    const notif = await Notification.findById(notificationId);
    if (!notif) return res.status(404).json({ message: "Notification not found" });

    if (notif.status !== "Pending") {
      return res.status(400).json({ message: "Invite already processed" });
    }

    const subteam = await Subteam.findById(notif.subteamId);
    if (!subteam) return res.status(404).json({ message: "Subteam not found" });

    if (!subteam.members.includes(req.user._id)) {
      subteam.members.push(req.user._id);
      await subteam.save();
    }

    notif.status = "Accepted";
    notif.isRead = true;
    await notif.save();

    res.json({ message: "Member joined subteam", subteam });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------------------------------------------------
// 7. REJECT MEMBER
// ---------------------------------------------------------
router.post("/reject-member", protectRoute, async (req, res) => {
  try {
    const { notificationId } = req.body;

    const notif = await Notification.findById(notificationId);
    if (!notif) return res.status(404).json({ message: "Notification not found" });

    if (notif.status !== "Pending") {
      return res.status(400).json({ message: "Invite already processed" });
    }

    notif.status = "Rejected";
    notif.isRead = true;
    await notif.save();

    await Notification.create({
      recipientId: notif.senderId,
      senderId: req.user._id,
      teamId: notif.teamId,
      type: "INVITE_REJECTED",
      message: `${req.user.userName} rejected the member invite.`
    });

    res.json({ message: "Invite rejected" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------------------------------------------------
// 8. ADD MEMBER DIRECTLY
// ---------------------------------------------------------
router.post("/add-member", protectRoute, async (req, res) => {
  try {
    const { subteamId, userName } = req.body;

    const user = await User.findOne({ userName });
    if (!user) return res.status(404).json({ message: "User not found" });

    const subteam = await Subteam.findById(subteamId);
    if (!subteam.members.includes(user._id)) {
      subteam.members.push(user._id);
      await subteam.save();
    }

    res.json({ message: "Member added", subteam });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------------------------------------------------
// 9. DELETE SUBTEAM
// ---------------------------------------------------------
router.delete("/:id", protectRoute, async (req, res) => {
  try {
    const { id } = req.params;
    const subteam = await Subteam.findById(id);

    if (!subteam) return res.status(404).json({ message: "Subteam not found" });

    const team = await Team.findById(subteam.teamId);
    if (team.TeamHId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this subteam" });
    }

    await Team.findByIdAndUpdate(subteam.teamId, { $pull: { Subteams: id } });
    await Subteam.findByIdAndDelete(id);
    await Task.deleteMany({ subteamId: id });

    res.json({ message: "Subteam deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------------------------------------------------
// 10. REMOVE MEMBER FROM SUBTEAM
// ---------------------------------------------------------
router.post("/remove-member", protectRoute, async (req, res) => {
  try {
    const { subteamId, memberId } = req.body;

    const subteam = await Subteam.findById(subteamId);
    if (!subteam) return res.status(404).json({ message: "Subteam not found" });

    const team = await Team.findById(subteam.teamId);
    
    const isSubteamHead = subteam.headId?.toString() === req.user._id.toString();
    const isTeamHead = team.TeamHId.toString() === req.user._id.toString();

    if (!isSubteamHead && !isTeamHead) {
       return res.status(403).json({ message: "Not authorized to remove members" });
    }

    subteam.members = subteam.members.filter(m => m.toString() !== memberId);
    await subteam.save();

    res.json({ message: "Member removed successfully", subteam });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------------------------------------------------
// 11. GET ROUTES (HEAD / MEMBER)
// ---------------------------------------------------------
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

module.exports = router;