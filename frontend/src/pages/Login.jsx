import "../styles/Login.css";
import AuthLayout from "../components/AuthLayout";
import { useState } from "react";
import GoogleButton from "../components/GoogleButton";
import api from "../api/axios.js";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const [identifier, setIdentifier] = useState("");  // email or username
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const body = {
        password,
      };

      // decide what user entered
      if (identifier.includes("@")) {
        body.email = identifier;
      } else {
        body.userName = identifier;
      }

      const res = await api.post("/auth/login", body);

      console.log("Login success:", res.data);

      window.location.href = "/dashboard";

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <AuthLayout>
      <h2 className="auth-title">Welcome Back</h2>

      <form className="auth-form" onSubmit={handleLogin}>
        
        <div className="input-block">
          <label>Email or UserName</label>
          <input
            type="text"
            placeholder="you@example.com"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
        </div>

        <div className="input-block">
          <label>Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
        </div>

        <button className="auth-btn" type="submit">Login</button>

        <GoogleButton text="Sign in with Google" />

        <p className="auth-footer">
          Don’t have an account? <a href="/signup">Sign Up</a>
        </p>
      </form>
    </AuthLayout>
  );
}
