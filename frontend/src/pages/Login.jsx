import "../styles/Login.css";
import AuthLayout from "../components/AuthLayout";
import { useState } from "react";
import GoogleButton from "../components/GoogleButton";


export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const onLogin=()=>{
    window.location.href="/dashboard"

  }

  return (
    <AuthLayout>
      <h2 className="auth-title">Welcome Back</h2>

      <form className="auth-form">
        <div className="input-block">
          <label>Email or UserName</label>
          <input type="email" placeholder="you@example.com" />
        </div>

        <div className="input-block">
          <label>Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
        </div>

        <button className="auth-btn" onClick={onLogin}>Login</button>
   

<GoogleButton className="GoogleButton" text="Sign up with Google" />


        <p className="auth-footer">
          Don’t have an account? <a href="/signup">Sign Up</a>
        </p>
      </form>
    </AuthLayout>
  );
}
