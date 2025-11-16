import "../index.css";
import { Link } from "react-router-dom";

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
        <button className="join-btn">Join Us</button>
      </Link>
    </nav>
  );
}
