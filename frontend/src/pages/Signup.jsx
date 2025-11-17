import "../styles/Signup.css"; // Imports Login.css
import AuthLayout from "../components/AuthLayout";
import { useState } from "react";
import api from "../api/axios.js";
import FluidButton from "../components/FluidButton"; // 🔥 Import

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
      const res = await api.post("/auth/signup", form);
      console.log("Signup success:", res.data);
      window.location.href = "/dashboard";
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <AuthLayout>
      <h2 className="auth-title">Create Account</h2>

      <form className="auth-form" onSubmit={handleSignup}>
        <div className="input-block">
          <label>UserName</label>
          <input
            type="text"
            placeholder="e.g., @username"
            value={form.userName}
            onChange={(e) => setForm({ ...form, userName: e.target.value })}
          />
        </div>

        <div className="input-block">
          <label>Email</label>
          <input
            type="email"
            placeholder="e.g., you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="input-block">
          <label>Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
        </div>

        {/* 🔥 Fluid Submit Button */}
        <FluidButton
          className="btn-primary"
          type="submit"
          style={{ width: "100%", padding: "14px", marginTop: "10px" }}
        >
          Sign Up
        </FluidButton>

        {/* Google Button Removed */}

        <p className="auth-footer">
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </AuthLayout>
  );
}