import "../index.css";
import { Link } from "react-router-dom";
import FluidButton from "./FluidButton"; // 🔥 Import

export default function NavbarLanding() {
  return (
    <nav className="nav">
      <div className="nav-logo">ally<span>Space</span></div>

      <div className="nav-links">
        <a href="#">Home</a>
        <a href="#">About</a>
        <a href="#">Contact</a>
      </div>

      <Link to="/login">
        {/* 🔥 Fluid Button */}
        <FluidButton className="btn-primary" style={{ padding: "10px 22px" }}>
          Join Us
        </FluidButton>
      </Link>
    </nav>
  );
}