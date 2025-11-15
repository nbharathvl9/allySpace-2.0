import "../styles/Signup.css";
import AuthLayout from "../components/AuthLayout";
import { useState } from "react";
import GoogleButton from "../components/GoogleButton";


export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthLayout>
      <h2 className="auth-title">Create Account</h2>

      <form className="auth-form">
        <div className="input-block">
          <label>UserName</label>
          <input type="text" placeholder="Enter the User Name" />
        </div>

        <div className="input-block">
          <label>Email</label>
          <input type="email" placeholder="you@example.com" />
        </div>

        <div className="input-block">
          <label>Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
        </div>

        <button className="auth-btn signup">Sign Up</button>
               
        
        <GoogleButton className="GoogleButton" text="Sign up with Google" />
        
        

        <p className="auth-footer">
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </AuthLayout>
  );
}
