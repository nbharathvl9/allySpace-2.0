import "../styles/Signup.css"; // Imports Login.css
import AuthLayout from "../components/AuthLayout";
import { useState } from "react";
import api from "../api/axios.js";
import FluidButton from "../components/FluidButton";
import { FiMail, FiLock, FiUser } from "react-icons/fi"; // Import icons

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/signup", form);
      window.location.href = "/dashboard";
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <AuthLayout>
      <h2 className="auth-title">Create Account</h2>
      <p className="auth-subtitle">Get started with AllySpace today.</p>

      <form className="auth-form" onSubmit={handleSignup}>
        <div className="input-block">
          <label>UserName</label>
          <div className="input-wrapper">
            {/* 🔥 Icon Added */}
            <FiUser className="input-icon" />
            <input
              type="text"
              placeholder="e.g., @username"
              value={form.userName}
              onChange={(e) => setForm({ ...form, userName: e.target.value })}
            />
          </div>
        </div>

        <div className="input-block">
          <label>Email</label>
          <div className="input-wrapper">
            {/* 🔥 Icon Added */}
            <FiMail className="input-icon" />
            <input
              type="email"
              placeholder="e.g., you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
        </div>

        <div className="input-block">
          <label>Password</label>
          {/* 🔥 Data-visible attribute controls the curtain */}
          <div className="password-wrapper" data-visible={showPassword}>
            <FiLock className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            {/* 🔥 The Curtain Element */}
            <div className="password-curtain"></div>
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
        </div>

        <FluidButton
          className="btn-primary"
          type="submit"
          style={{ width: "100%", padding: "14px", marginTop: "10px" }}
        >
          Sign Up
        </FluidButton>

        <p className="auth-footer">
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </AuthLayout>
  );
}