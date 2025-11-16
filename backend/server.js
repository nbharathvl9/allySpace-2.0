require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const authRoute= require("./routes/authRoute.js");
const UserRoute=require("./routes/userRoute.js");
const User = require("./models/User.js");

const app = express();

// ---------- Middlewares ----------
app.use(express.json());
app.use(cookieParser());

// CORS (for cookies)
app.use(
  cors({
    origin: "http://localhost:5173",    // your React frontend
    credentials: true,                  // allow cookies
  })
);

// ---------- Database ----------
connectDB();

// ---------- Routes ----------
app.use("/api/auth",authRoute);
app.use("/api/user", UserRoute);

// Test route
app.get("/", (req, res) => {
  res.send("API is working...");
});


// ---------- Server ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


