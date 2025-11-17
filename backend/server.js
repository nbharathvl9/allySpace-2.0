require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const http = require("http"); 
const { Server } = require("socket.io");

const authRoute = require("./routes/authRoute.js");
const UserRoute = require("./routes/userRoute.js");
const teamRoute = require("./routes/teamRoute.js");
const subTeamRoute = require("./routes/subTeamRoute.js");
const taskRoute = require("./routes/taskRoute.js");
const chatRoute = require("./routes/chatRoute.js"); 
const notificationRoute = require("./routes/notifcationRoute.js");
const Message = require("./models/Message");

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

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});