require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const http = require("http"); 
const { Server } = require("socket.io");
const cron = require('node-cron'); // 🔥 ADDED: For scheduling reminders
const { sendTaskReminder } = require('./utils/sendEmail'); // 🔥 ADDED: Import the reminder utility

const authRoute = require("./routes/authRoute.js");
const UserRoute = require("./routes/userRoute.js");
const teamRoute = require("./routes/teamRoute.js");
const subTeamRoute = require("./routes/subTeamRoute.js");
const taskRoute = require("./routes/taskRoute.js");
const chatRoute = require("./routes/chatRoute.js"); 
const notificationRoute = require("./routes/notifcationRoute.js");
const Message = require("./models/Message");
const Task = require('./models/task'); // 🔥 ADDED: Import Task model
const User = require('./models/User'); // 🔥 ADDED: Import User model

const app = express();
const server = http.createServer(app); 

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

connectDB();

app.use("/api/auth", authRoute);
app.use("/api/user", UserRoute);
app.use("/api/team", teamRoute);
app.use("/api/subteam", subTeamRoute);
app.use("/api/task", taskRoute);
app.use("/api/notifications", notificationRoute);
app.use("/api/chat", chatRoute);

// ⚡ REAL-TIME SOCKET LOGIC
const userSocketMap = {}; // { userId: socketId }

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  
  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }

  socket.on("sendMessage", async ({ senderId, recipientId, text }) => {
    try {
      // Save to DB
      const newMessage = await Message.create({ sender: senderId, recipient: recipientId, text });

      // Send to Receiver
      const receiverSocketId = userSocketMap[recipientId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }
      
      // Send back to Sender (for optimistic UI updates assurance)
      const senderSocketId = userSocketMap[senderId];
      if (senderSocketId) {
        io.to(senderSocketId).emit("newMessage", newMessage);
      }
    } catch (err) {
      console.log("Socket Error:", err);
    }
  });

  socket.on("markMessagesAsRead", async ({ senderId, recipientId }) => {
    // Update DB
    await Message.updateMany(
      { sender: senderId, recipient: recipientId, isRead: false },
      { $set: { isRead: true } }
    );
    
    // Notify the SENDER that their messages were read
    const senderSocketId = userSocketMap[senderId];
    if (senderSocketId) {
      io.to(senderSocketId).emit("messagesRead", { by: recipientId });
    }
  });

  socket.on("disconnect", () => {
    if (userId) {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

// ---------------------------------------------------------
// 🔥 CRON JOB FOR TASK REMINDERS (Runs every hour)
// ---------------------------------------------------------
cron.schedule('0 * * * *', async () => { // Runs at the start of every hour (e.g., 00:00, 01:00)
  console.log('Running task reminder check...');
  try {
    const now = new Date();
    // Calculate the exact window: 6 hours from now to 7 hours from now
    const sixHoursFromNow = new Date(now.getTime() + 6 * 60 * 60 * 1000); 
    const sevenHoursFromNow = new Date(now.getTime() + 7 * 60 * 60 * 1000); 

    // Find tasks that are Pending/In Progress and due within the 6th hour from now
    const tasksToRemind = await Task.find({
      status: { $in: ["Pending", "In Progress"] },
      deadline: { 
        $gt: sixHoursFromNow, // After 6 hours from current time
        $lte: sevenHoursFromNow // Before or at 7 hours from current time
      }
    }).populate('assignedTo', 'email userName');

    for (const task of tasksToRemind) {
      if (task.assignedTo && task.assignedTo.email) {
        console.log(`Sending reminder for task: ${task.title} to ${task.assignedTo.userName}`);
        await sendTaskReminder(task.assignedTo.email, task.title, task.deadline);
      }
    }
  } catch (error) {
    console.error('Error in task reminder cron job:', error);
  }
});
// ---------------------------------------------------------

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});