const User = require("../models/User");
const OTP = require("../models/Otp");
const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const generateToken = (_id) => {
  return jwt.sign({ id: _id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const cookieOptions = {
  httpOnly: true,
  secure: false, // set true in production (HTTPS)
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// TTLs
const OTP_TTL_MS = 10 * 60 * 1000; // OTP valid for 10 minutes
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // reset token valid for 1 hour

// ----------------- Helpers -----------------
const isOtpValid = (otpDoc) => {
  if (!otpDoc) return false;
  const created = new Date(otpDoc.createdAt).getTime();
  return Date.now() - created <= OTP_TTL_MS;
};

// ----------------- 1. SEND OTP (Signup) -----------------
exports.sendOtp = async (req, res) => {
  try {
    const { email, userName } = req.body;
    if (!email || !userName) return res.status(400).json({ message: "Email and username are required" });

    const existingEmail = await User.findOne({ email });
    if (existingEmail) return res.status(400).json({ message: "Email already registered" });

    const existingUser = await User.findOne({ userName });
    if (existingUser) return res.status(400).json({ message: "Username already taken" });

    // TODO: Add rate-limiting per email/IP to avoid abuse

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.findOneAndUpdate(
      { email },
      { otp, createdAt: Date.now() },
      { upsert: true, new: true }
    );

    await sendEmail(email, otp); // make sure sendEmail handles errors
    res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("sendOtp:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// ----------------- 2. SIGNUP (Verify OTP & Register) -----------------
exports.signup = async (req, res) => {
  try {
    const { userName, email, password, otp } = req.body;
    if (!userName || !email || !password || !otp)
      return res.status(400).json({ message: "All fields are required" });

    // Verify OTP with expiry
    const validOtp = await OTP.findOne({ email, otp });
    if (!isOtpValid(validOtp)) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Double-check existence
    if (await User.findOne({ email })) return res.status(400).json({ message: "Email exists" });
    if (await User.findOne({ userName })) return res.status(400).json({ message: "Username exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      userName,
      email,
      password: hashedPassword,
    });

    await OTP.deleteOne({ email });

    const token = generateToken(newUser._id);
    res.cookie("token", token, cookieOptions);

    res.status(201).json({
      message: "Signup successful",
      user: { _id: newUser._id, userName: newUser.userName, email: newUser.email },
    });
  } catch (err) {
    console.error("signup:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ----------------- 3. LOGIN -----------------
exports.login = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    if (!userName && !email) return res.status(400).json({ message: "Username or Email required" });
    if (!password) return res.status(400).json({ message: "Password required" });

    const user = await User.findOne({ $or: [{ userName }, { email }] });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id);
    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      message: "Login successful",
      user: { _id: user._id, userName: user.userName, email: user.email },
    });
  } catch (err) {
    console.error("login:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ----------------- 4. LOGOUT -----------------
exports.logout = async (req, res) => {
  try {
    res.cookie("token", "", { ...cookieOptions, expires: new Date(0) });
    res.status(200).json({ message: "Logged out" });
  } catch (err) {
    console.error("logout:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ----------------- 5. FORGOT PASS: SEND OTP -----------------
exports.sendForgotOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User with this email not found" });

    // TODO: Add rate-limiting per email/IP to avoid abuse
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.findOneAndUpdate(
      { email },
      { otp, createdAt: Date.now() },
      { upsert: true, new: true }
    );

    await sendEmail(email, otp);
    res.json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("sendForgotOtp:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// ----------------- 6. FORGOT PASS: RESET WITH OTP -----------------
exports.resetPasswordWithOtp = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) return res.status(400).json({ message: "All fields are required" });

    const validOtp = await OTP.findOne({ email, otp });
    if (!isOtpValid(validOtp)) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    await OTP.deleteOne({ email });

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("resetPasswordWithOtp:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ----------------- 7. FORGOT PASS (token link) -----------------
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + RESET_TOKEN_TTL_MS;
    await user.save();

    // Build reset URL — adapt domain/frontend route for production
    const frontendBase = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetUrl = `${frontendBase}/reset-password/${resetToken}`;

    // Prefer sending a proper email in production; console for dev
    try {
      await sendEmail(email, `Reset link: ${resetUrl}`);
    } catch (mailErr) {
      console.warn("Failed to send reset email:", mailErr);
      console.log("RESET LINK:", resetUrl);
    }

    res.json({ message: "Reset link generated (check email or server logs)" });
  } catch (err) {
    console.error("forgotPassword:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ----------------- 8. RESET PASS (token link) -----------------
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ message: "Token and new password required" });

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("resetPassword:", err);
    res.status(500).json({ message: "Server error" });
  }
};
