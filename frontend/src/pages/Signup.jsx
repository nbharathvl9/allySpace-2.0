import "../styles/Signup.css"; 
import AuthLayout from "../components/AuthLayout";
import { useState } from "react";
import api from "../api/axios.js";
import FluidButton from "../components/FluidButton";
import { FiMail, FiLock, FiUser, FiKey } from "react-icons/fi"; 
import { useToast } from "../context/ToastContext"; // 🔥 Import
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false); 
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({ userName: "", email: "", password: "", otp: "" });

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if(!form.userName || !form.email || !form.password) return showToast("Please fill all fields", "error");

    setLoading(true);
    try {
      await api.post("/auth/send-otp", { email: form.email, userName: form.userName });
      setOtpSent(true); 
      showToast(`OTP sent to ${form.email}`, "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to send OTP", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/signup", form);
      showToast("Account created! Welcome aboard.", "success");
      navigate("/dashboard");
    } catch (err) {
      showToast(err.response?.data?.message || "Signup failed (Invalid OTP?)", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h2 className="auth-title">Create Account</h2>
      <p className="auth-subtitle">Get started with AllySpace today.</p>

      <form className="auth-form" onSubmit={otpSent ? handleSignup : handleSendOtp}>
        <div className="input-block">
          <label>UserName</label>
          <div className="input-wrapper">
            <FiUser className="input-icon" />
            <input type="text" placeholder="e.g., @username" value={form.userName} onChange={(e) => setForm({ ...form, userName: e.target.value })} disabled={otpSent} />
          </div>
        </div>

        <div className="input-block">
          <label>Email</label>
          <div className="input-wrapper">
            <FiMail className="input-icon" />
            <input type="email" placeholder="e.g., you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} disabled={otpSent} />
          </div>
        </div>

        <div className="input-block">
          <label>Password</label>
          <div className="password-wrapper" data-visible={showPassword}>
            <FiLock className="input-icon" />
            <input type={showPassword ? "text" : "password"} placeholder="Create a password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} disabled={otpSent} />
            <div className="password-curtain"></div>
            <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "🙈" : "👁️"}</span>
          </div>
        </div>

        {otpSent && (
          <div className="input-block" style={{animation: "fadeIn 0.5s ease"}}>
            <label style={{color: "#60a5fa"}}>Enter OTP</label>
            <div className="input-wrapper">
              <FiKey className="input-icon" style={{color: "#60a5fa"}} />
              <input type="text" placeholder="6-digit code" value={form.otp} onChange={(e) => setForm({ ...form, otp: e.target.value })} maxLength={6} style={{ borderColor: "#60a5fa", background: "rgba(96, 165, 250, 0.1)" }} />
            </div>
          </div>
        )}

        <FluidButton className={otpSent ? "btn-success" : "btn-primary"} type="submit" style={{ width: "100%", padding: "14px", marginTop: "10px" }}>
          {loading ? "Processing..." : otpSent ? "Verify & Register" : "Get OTP"}
        </FluidButton>

        {otpSent ? (
           <p className="auth-footer" onClick={() => setOtpSent(false)} style={{cursor: "pointer", marginTop: "10px", textDecoration: "underline"}}>
             Wrong email? Change details
           </p>
        ) : (
          <p className="auth-footer">
            Already have an account? <a href="/login">Login</a>
          </p>
        )}
      </form>
    </AuthLayout>
  );
}