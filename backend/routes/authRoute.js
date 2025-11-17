const express = require("express");
const router = express.Router();

// Import ALL functions from the controller
const { 
  signup, 
  login, 
  logout, 
  forgotPassword, 
  resetPassword, 
  sendOtp,
  resetPasswordWithOtp,
  sendForgotOtp
} = require("../controllers/authController");

// Define Routes
router.post("/send-otp", sendOtp);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.post("/forgot-password/otp", sendForgotOtp);
router.post("/forgot-password/reset", resetPasswordWithOtp);

module.exports = router;

