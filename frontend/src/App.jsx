import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/DashBoard";
import ProjectDashboard from "./pages/ProjectDashboard";
import Landing from "./pages/Landing";
import ChatPage from "./pages/ChatPage"; 
import { ToastProvider } from "./context/ToastContext";// 🔥 Import

export default function App() {
  return (
    <ToastProvider>
      <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/project/:id" element={<ProjectDashboard />} />
      <Route path="/chat" element={<ChatPage />} /> 
    </Routes>
    </ToastProvider>
  
  );
}
