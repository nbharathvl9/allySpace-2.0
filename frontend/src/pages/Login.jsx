import "../styles/Login.css";
import AuthLayout from "../components/AuthLayout";
import { useState } from "react";
import api from "../api/axios.js";
import FluidButton from "../components/FluidButton";
import { FiMail, FiLock, FiUser, FiKey } from "react-icons/fi"; 

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  
  // 🔥 View State: 'login' | 'forgot-email' | 'forgot-reset'
  const [view, setView] = useState("login"); 

  // Login Form Data
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  // Forgot Password Form Data
  const [resetEmail, setResetEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 1. LOGIN HANDLER
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const body = { password };
      if (identifier.includes("@")) {
        body.email = identifier;
      } else {
        body.userName = identifier;
      }
      await api.post("/auth/login", body);
      window.location.href = "/dashboard";
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  // 2. SEND OTP HANDLER
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!resetEmail) return alert("Please enter email");
    setLoading(true);
    try {
      await api.post("/auth/forgot-password/otp", { email: resetEmail });
      alert("OTP sent to your email!");
      setView("forgot-reset");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // 3. RESET PASSWORD HANDLER
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp || !newPassword) return alert("Please fill all fields");
    setLoading(true);
    try {
      await api.post("/auth/forgot-password/reset", { 
        email: resetEmail, 
        otp, 
        newPassword 
      });
      alert("Password reset successful! Please login.");
      setView("login");
    } catch (err) {
      alert(err.response?.data?.message || "Reset failed (Invalid OTP?)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      
      {/* HEADER */}
      <h2 className="auth-title">
        {view === "login" ? "Welcome Back" : "Reset Password"}
      </h2>
      <p className="auth-subtitle">
        {view === "login" 
          ? "Sign in to access your projects." 
          : view === "forgot-email" 
            ? "Enter your email to receive an OTP." 
            : "Enter the OTP sent to your email."}
      </p>

      {/* ==================== LOGIN FORM ==================== */}
      {view === "login" && (
        <form className="auth-form" onSubmit={handleLogin}>
          <div className="input-block">
            <label>Email or UserName</label>
            <div className="input-wrapper">
              <FiUser className="input-icon" />
              <input
                type="text"
                placeholder="e.g., @username or you@example.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>
          </div>

          <div className="input-block">
            <label>Password</label>
            <div className="password-wrapper" data-visible={showPassword}>
              <FiLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="password-curtain"></div>
              <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
            {/* Forgot Password Link */}
            <div style={{ textAlign: "right", marginTop: "8px" }}>
              <span 
                onClick={() => setView("forgot-email")} 
                style={{ color: "#60a5fa", fontSize: "13px", cursor: "pointer", fontWeight: "500" }}
              >
                Forgot Password?
              </span>
            </div>
          </div>

          <FluidButton className="btn-primary" type="submit" style={{ width: "100%", padding: "14px", marginTop: "10px" }}>
            Login
          </FluidButton>

          <p className="auth-footer">
            Don’t have an account? <a href="/signup">Sign Up</a>
          </p>
        </form>
      )}

      {/* ==================== FORGOT: STEP 1 (EMAIL) ==================== */}
      {view === "forgot-email" && (
        <form className="auth-form" onSubmit={handleSendOtp}>
          <div className="input-block">
            <label>Enter your Registered Email</label>
            <div className="input-wrapper">
              <FiMail className="input-icon" />
              <input
                type="email"
                placeholder="you@example.com"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
            </div>
          </div>

          <FluidButton className="btn-primary" type="submit" style={{ width: "100%", padding: "14px", marginTop: "10px" }}>
            {loading ? "Sending..." : "Get OTP"}
          </FluidButton>

          <p className="auth-footer">
            <span onClick={() => setView("login")} style={{ cursor: "pointer", color: "#94a3b8" }}>Back to Login</span>
          </p>
        </form>
      )}

      {/* ==================== FORGOT: STEP 2 (RESET) ==================== */}
      {view === "forgot-reset" && (
        <form className="auth-form" onSubmit={handleResetPassword}>
          
          <div className="input-block">
            <label style={{color: "#60a5fa"}}>OTP Code</label>
            <div className="input-wrapper">
              <FiKey className="input-icon" style={{color: "#60a5fa"}} />
              <input
                type="text"
                placeholder="6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                style={{ borderColor: "#60a5fa", background: "rgba(96, 165, 250, 0.1)" }}
              />
            </div>
          </div>

          <div className="input-block">
            <label>New Password</label>
            <div className="input-wrapper">
              <FiLock className="input-icon" />
              <input
                type="password"
                placeholder="New secure password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>

          <FluidButton className="btn-success" type="submit" style={{ width: "100%", padding: "14px", marginTop: "10px" }}>
            {loading ? "Resetting..." : "Reset Password"}
          </FluidButton>

          <p className="auth-footer">
            <span onClick={() => setView("forgot-email")} style={{ cursor: "pointer", color: "#94a3b8" }}>Wrong email? Go back</span>
          </p>
        </form>
      )}

    </AuthLayout>
  );
}