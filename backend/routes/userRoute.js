const express = require("express");
const router = express.Router();
const protectRoute = require("../middleware/protectRoute");

// Protected route example
router.get("/profile", protectRoute, async (req, res) => {
  res.json({
    message: "Authorized",
    user: req.user,
  });
});

module.exports = router;