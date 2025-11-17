const express = require("express");
const router = express.Router();
const protectRoute = require("../middleware/protectRoute");
const Message = require("../models/Message");
const User = require("../models/User");

// Get chat history with a specific user
router.get("/:userId", protectRoute, async (req, res) => {
  try {
    const { userId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { sender: myId, recipient: userId },
        { sender: userId, recipient: myId },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get recent chat contacts (Users you have chatted with)
router.get("/conversations/all", protectRoute, async (req, res) => {
  try {
    const myId = req.user._id;
    // Find all messages where user is sender or recipient
    const messages = await Message.find({
        $or: [{ sender: myId }, { recipient: myId }]
    }).populate("sender", "userName email").populate("recipient", "userName email");

    // Extract unique users
    const usersMap = new Map();
    messages.forEach(msg => {
        const otherUser = msg.sender._id.toString() === myId.toString() ? msg.recipient : msg.sender;
        if(!usersMap.has(otherUser._id.toString())) {
            usersMap.set(otherUser._id.toString(), {
                _id: otherUser._id,
                userName: otherUser.userName,
                email: otherUser.email,
                lastMsg: msg.text, // This is rough, ideally sort by date
                time: msg.createdAt
            });
        }
    });

    res.json(Array.from(usersMap.values()));
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;