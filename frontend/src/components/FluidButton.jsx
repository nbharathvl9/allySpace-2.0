import React, { useRef } from "react";
import "../styles/fluidButton.css";

/**
 * A reusable fluid button with magnetic hover and shine effects.
 */
const FluidButton = ({ children, className = "", onClick, style, type = "button", ...rest }) => {
  const btnRef = useRef(null);

  const handleMouseMove = (e) => {
    const btn = btnRef.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Magnetic center
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const pullX = (x - centerX) / 6;
    const pullY = (y - centerY) / 6;

    // Set CSS variables (FIXED)
    btn.style.setProperty("--x", `${x}px`);
    btn.style.setProperty("--y", `${y}px`);
    btn.style.setProperty("--pull-x", `${pullX}px`);
    btn.style.setProperty("--pull-y", `${pullY}px`);
    btn.style.setProperty("--scale", "1.03");
  };

  const handleMouseLeave = () => {
    const btn = btnRef.current;
    if (!btn) return;

    btn.style.setProperty("--pull-x", "0px");
    btn.style.setProperty("--pull-y", "0px");
    btn.style.setProperty("--scale", "1");
  };

  return (
    <button
      ref={btnRef}
      className={`fluid-btn ${className}`}  // FIXED
      onClick={onClick}
      style={style}
      type={type}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...rest}
    >
      {children}
    </button>
  );
};

export default FluidButton;
