const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (_id) => {
  return jwt.sign({ id: _id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Cookies for localhost
const cookieOptions = {
  httpOnly: true,
  secure: false,      // IMPORTANT for localhost
  sameSite: "lax",    // IMPORTANT for localhost
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// ----------------- SIGNUP -----------------
exports.signup = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    if (await User.findOne({ email }))
      return res.status(400).json({ message: "Email already exists" });

    if (await User.findOne({ userName }))
      return res.status(400).json({ message: "Username already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      userName,
      email,
      password: hashedPassword
    });

    const token = generateToken(newUser._id);

    res.cookie("token", token, cookieOptions);

    res.status(201).json({
      message: "Signup successful",
      user: {
        _id: newUser._id,
        userName: newUser.userName,
        email: newUser.email
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ----------------- LOGIN -----------------
exports.login = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    if (!userName && !email)
      return res.status(400).json({ message: "Username or Email is required" });

    const user = await User.findOne({ $or: [{ userName }, { email }] });

    if (!user)
      return res.status(400).json({ message: "Invalid username/email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid username/email or password" });

    const token = generateToken(user._id);

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        userName: user.userName,
        email: user.email
      }
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ----------------- LOGOUT -----------------
exports.logout = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      secure: false,     // localhost
      sameSite: "lax",
      expires: new Date(0),
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
