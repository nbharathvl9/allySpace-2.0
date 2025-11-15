import React from "react";
import "../index.css";

const Navbar = () => {
  return (
    <nav className="nav">
      <div className="nav-logo">ally<span>Space</span></div>

      <div className="nav-links">
        <a href="#">Home</a>
        <a href="#">About</a>
        <a href="#">Contact</a>        
        
      </div>

      <a href="#"> <button className="join-btn">Join Us</button> </a>

    </nav>
  );
};

export default Navbar;
