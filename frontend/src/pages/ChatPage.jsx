import React, { useState, useEffect, useRef } from "react";
import "../styles/Chat.css";
import Sidebar from "../components/sidebar.jsx";
import api from "../api/axios";
import { io } from "socket.io-client";
import EmojiPicker from "emoji-picker-react";
import { FiSearch, FiMoreVertical, FiSend, FiPaperclip, FiSmile } from "react-icons/fi";
import { BsCheckAll, BsCheck } from "react-icons/bs";

export default function ChatPage() {
  const [contacts, setContacts] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showEmoji, setShowEmoji] = useState(false);
  
  const messagesEndRef = useRef(null);
  
  // 🔥 REF TO TRACK ACTIVE CHAT INSIDE SOCKET LISTENERS
  const activeChatRef = useRef(null); 

  // Update ref whenever state changes
  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);

  // 1. Initialize
  useEffect(() => {
    const setup = async () => {
      try {
        const res = await api.get("/user/profile");
        const user = res.data.user;
        setCurrentUser(user);

        // Connect Socket
        const newSocket = io("http://localhost:5000", {
          query: { userId: user._id },
        });
        setSocket(newSocket);

        // Listeners
        newSocket.on("getOnlineUsers", (users) => setOnlineUsers(users));

        // ⚡ HANDLE INCOMING MESSAGES
        newSocket.on("newMessage", (msg) => {
          const currentChatId = activeChatRef.current?._id;
          
          // A. If chat is open with sender/receiver, append message
          if (currentChatId && (msg.sender === currentChatId || msg.recipient === currentChatId)) {
             setMessages((prev) => {
                // Avoid duplicates
                if (prev.some(m => m._id === msg._id)) return prev;
                return [...prev, msg];
             });
             
             // If I am the recipient and looking at it, mark read immediately
             if (msg.recipient === user._id && msg.sender === currentChatId) {
                newSocket.emit("markMessagesAsRead", { senderId: currentChatId, recipientId: user._id });
             }
          }

          // B. Update Sidebar (Move contact to top, update text)
          setContacts((prev) => {
             const otherId = msg.sender === user._id ? msg.recipient : msg.sender;
             const existingIndex = prev.findIndex(c => c._id === otherId);
             
             let updatedContact;
             let newContacts = [...prev];

             if (existingIndex !== -1) {
                updatedContact = { 
                  ...newContacts[existingIndex], 
                  lastMsg: msg.text, 
                  time: msg.createdAt 
                };
                newContacts.splice(existingIndex, 1); // Remove
             } else {
                // If contact doesn't exist (new conversation), we might need to fetch user details
                // For now, we handle existing contacts. 
                // To fix "new user not appearing", you'd typically fetch the user info here.
                return prev; 
             }
             return [updatedContact, ...newContacts]; // Add to top
          });
        });

        // ⚡ BLUE TICKS
        newSocket.on("messagesRead", ({ by }) => {
             // Update 'isRead' for all messages sent to 'by'
             setMessages(prev => prev.map(msg => 
                 msg.recipient === by ? { ...msg, isRead: true } : msg
             ));
        });

        return () => newSocket.close();
      } catch (err) {
        console.error(err);
      }
    };
    setup();
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
        const res = await api.get("/chat/conversations/all");
        setContacts(res.data);
    } catch(err) { console.error(err); }
  };

  // Search Users
  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }
    const delay = setTimeout(async () => {
      try {
        const res = await api.get(`/user/search?query=${searchQuery}`);
        setSearchResults(res.data);
      } catch (err) { console.error(err); }
    }, 300);
    return () => clearTimeout(delay);
  }, [searchQuery]);

  // Load History & Mark Read
  useEffect(() => {
    if (activeChat && currentUser && socket) {
      api.get(`/chat/${activeChat._id}`).then((res) => {
        setMessages(res.data);
        scrollToBottom();
      });

      // Mark as read when opening chat
      socket.emit("markMessagesAsRead", { 
          senderId: activeChat._id, 
          recipientId: currentUser._id 
      });
    }
  }, [activeChat, currentUser, socket]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    const msgData = {
      senderId: currentUser._id,
      recipientId: activeChat._id,
      text: newMessage,
    };

    socket.emit("sendMessage", msgData);
    setNewMessage("");
    setShowEmoji(false);
  };

  const selectUser = (user) => {
    setActiveChat(user);
    setSearchQuery(""); 
    setSearchResults([]);
    
    // If user not in contacts, add them temporarily
    if (!contacts.find(c => c._id === user._id)) {
        setContacts(prev => [{ ...user, lastMsg: "New Chat", time: new Date() }, ...prev]);
    }
  };

  const isOnline = (userId) => onlineUsers.includes(userId);

  const onEmojiClick = (emojiData) => {
    setNewMessage(prev => prev + emojiData.emoji);
  };

  return (
    <div className="chat-layout">
      <Sidebar />

      {/* LEFT SIDEBAR */}
      <div className="chat-sidebar-panel">
        <div className="chat-header">
          <h2 style={{ fontSize: "20px" }}>Messages</h2>
        </div>

        <div className="chat-search-bar">
          <div className="search-input-wrapper">
            <FiSearch color="#94a3b8" />
            <input 
                type="text" 
                placeholder="Search users..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="contact-list">
          {/* Search Results */}
          {searchQuery ? (
             searchResults.map(user => (
                <div key={user._id} className="contact-card" onClick={() => selectUser(user)}>
                    <div className="contact-avatar" style={{ backgroundImage: `url(https://api.dicebear.com/7.x/avataaars/svg?seed=${user.userName})` }}>
                         {isOnline(user._id) && <span className="online-dot"></span>}
                    </div>
                    <div className="contact-info">
                        <p className="contact-name">{user.userName}</p>
                        <p className="contact-last-msg" style={{color: "#60a5fa"}}>Start a conversation</p>
                    </div>
                </div>
             ))
          ) : (
             // Contact List
             contacts.map((contact) => (
                <div 
                  key={contact._id} 
                  className={`contact-card ${activeChat?._id === contact._id ? "active" : ""}`}
                  onClick={() => selectUser(contact)}
                >
                  <div className="contact-avatar" style={{ backgroundImage: `url(https://api.dicebear.com/7.x/avataaars/svg?seed=${contact.userName})` }}>
                    {isOnline(contact._id) && <span className="online-dot"></span>}
                  </div>
                  <div className="contact-info">
                    <p className="contact-name">{contact.userName}</p>
                    <p className="contact-last-msg">{contact.lastMsg || "Image/File"}</p>
                  </div>
                  <span className="msg-time">
                    {contact.time ? new Date(contact.time).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : ""}
                  </span>
                </div>
              ))
          )}
        </div>
      </div>

      {/* RIGHT WINDOW */}
      <div className="chat-window">
        {activeChat ? (
          <>
            <div className="chat-header" style={{ background: "rgba(15, 23, 42, 0.8)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <div className="contact-avatar" style={{ width: "40px", height: "40px", backgroundImage: `url(https://api.dicebear.com/7.x/avataaars/svg?seed=${activeChat.userName})` }}>
                    {isOnline(activeChat._id) && <span className="online-dot"></span>}
                </div>
                <div>
                  <h3 style={{ fontSize: "16px", margin: 0 }}>{activeChat.userName}</h3>
                  <span style={{ fontSize: "12px", color: isOnline(activeChat._id) ? "#22c55e" : "#94a3b8" }}>
                    {isOnline(activeChat._id) ? "Online" : "Offline"}
                  </span>
                </div>
              </div>
            </div>

            <div className="messages-container">
              {messages.map((msg, idx) => {
                const isMe = msg.sender === currentUser?._id;
                return (
                    <div key={idx} className={`message ${isMe ? "msg-sent" : "msg-received"}`}>
                      {msg.text}
                      <div className="msg-status">
                          <span className="msg-timestamp">
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isMe && (
                              <span className={`tick-icon ${msg.isRead ? "tick-read" : "tick-sent"}`}>
                                  {msg.isRead ? <BsCheckAll size={16} /> : <BsCheck size={16} />}
                              </span>
                          )}
                      </div>
                    </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <form className="chat-footer" onSubmit={handleSendMessage}>
              <div style={{position: 'relative'}}>
                  <FiSmile 
                    size={24} 
                    color="#94a3b8" 
                    style={{ cursor: "pointer" }} 
                    onClick={() => setShowEmoji(!showEmoji)}
                  />
                  {showEmoji && (
                      <div className="emoji-picker-container">
                          <EmojiPicker onEmojiClick={onEmojiClick} theme="dark" />
                      </div>
                  )}
              </div>
              
              <input 
                className="chat-input" 
                placeholder="Type a message..." 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button type="submit" className="send-btn">
                <FiSend size={20} />
              </button>
            </form>
          </>
        ) : (
          <div className="no-chat-selected">
            <h2>Select a user to start chatting</h2>
          </div>
        )}
      </div>
    </div>
  );
}