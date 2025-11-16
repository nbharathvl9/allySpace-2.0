const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protectRoute = async (req, res, next) => {
  try {
    // Read token from HTTP-only cookie
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authorized. No token." });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user using auto-increment id
    const user = await User.findOne({ id: decoded.id }).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    // Attach user to req for controller access
    req.user = user;

    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = protectRoute;