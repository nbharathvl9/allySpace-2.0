import { useRef } from "react";
import "../styles/AuthLayout.css";

export default function AuthLayout({ children }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const { width, height } = rect;

    // Calculate rotation (e.g., -10deg to 10deg)
    const rotateX = (y / height - 0.5) * -14; // Invert Y-axis for natural feel
    const rotateY = (x / width - 0.5) * 14;

    // Calculate background gradient position
    const bgX = (x / width) * 100;
    const bgY = (y / height) * 100;

    // Set CSS variables for the card to use
    card.style.setProperty("--rotate-x", `${rotateX}deg`);
    card.style.setProperty("--rotate-y", `${rotateY}deg`);
    card.style.setProperty("--bg-x", `${bgX}%`);
    card.style.setProperty("--bg-y", `${bgY}%`);
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    
    // Reset to default state
    card.style.setProperty("--rotate-x", `0deg`);
    card.style.setProperty("--rotate-y", `0deg`);
    card.style.setProperty("--bg-x", `50%`);
    card.style.setProperty("--bg-y", `50%`);
  };

  return (
    <div 
      className="auth-container" 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="auth-card" ref={cardRef}>
        {/* This is the shine layer behind the content */}
        <div className="auth-card-shine"></div>
        
        {/* This is the main content layer */}
        <div className="auth-card-content">
          {children}
        </div>
      </div>
    </div>
  );
}