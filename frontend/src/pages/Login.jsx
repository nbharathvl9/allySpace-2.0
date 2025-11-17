import "../styles/Login.css";
import AuthLayout from "../components/AuthLayout";
import { useState } from "react";
import api from "../api/axios.js";
import FluidButton from "../components/FluidButton";
import { FiMail, FiLock, FiUser } from "react-icons/fi"; // Import icons

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

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

  return (
    <AuthLayout>
      <h2 className="auth-title">Welcome Back</h2>
      <p className="auth-subtitle">Sign in to access your projects.</p>

      <form className="auth-form" onSubmit={handleLogin}>
        <div className="input-block">
          <label>Email or UserName</label>
          <div className="input-wrapper">
            {/* 🔥 Icon Added */}
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
          {/* 🔥 Data-visible attribute controls the curtain */}
          <div className="password-wrapper" data-visible={showPassword}>
            <FiLock className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          Login
        </FluidButton>

        <p className="auth-footer">
          Don’t have an account? <a href="/signup">Sign Up</a>
        </p>
      </form>
    </AuthLayout>
  );
}