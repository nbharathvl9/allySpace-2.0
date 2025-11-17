import React from "react";
import "../index.css";
import FluidButton from "./FluidButton"; // 🔥 Import

const Hero = () => {
  return (
    <section className="hero-sec">
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

      <div className="hero-text">
        <h1>Maintain Co-Ordination Like a Pro</h1>
        <p>
          Manage your teams, assign tasks, and track progress all in one
          centralized, fluid dashboard.
        </p>

        {/* 🔥 Fluid Button */}
        <FluidButton style={{ padding: "14px 28px" }}>
          ▶ Watch The Video
        </FluidButton>
      </div>
    </section>
  );
}; // 🔥 Added the missing semicolon here

export default Hero; // 🔥 Added the missing export