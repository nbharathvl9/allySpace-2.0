import React from "react";
import "../index.css";

const Hero = () => {
  return (
    <section className="hero-sec">

      {/* Left 3D Neon Blocks */}
      <div className="neon-illustration">
        <div className="cube-stack">
          <div className="cube neon"></div>
          <div className="cube neon"></div>
          <div className="cube neon"></div>
        </div>

        <div className="floating-cube fc1"></div>
        <div className="floating-cube fc2"></div>
        <div className="floating-cube fc3"></div>
      </div>

      {/* Right content */}
      <div className="hero-text">
        <h1>Maintain Co-Ordination Like a Pro</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. 
          Elit incidunt ut labore magna aliqua. Ut enim ad minim.
        </p>

        <button className="watch-btn">
          ▶ Watch The Video
        </button>
      </div>
    </section>
  );
};

export default Hero;
