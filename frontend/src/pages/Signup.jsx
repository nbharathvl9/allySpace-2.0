import "../styles/Signup.css";
import AuthLayout from "../components/AuthLayout";
import { useState } from "react";
import GoogleButton from "../components/GoogleButton";
import api from "../api/axios.js"; // <-- import axios instance

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
            placeholder="Enter the User Name"
            value={form.userName}
            onChange={(e) => setForm({ ...form, userName: e.target.value })}
          />
        </div>

        <div className="input-block">
          <label>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
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

        <button className="auth-btn signup" type="submit">
          Sign Up
        </button>

        <GoogleButton text="Sign up with Google" />

        <p className="auth-footer">
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </AuthLayout>
  );
}
