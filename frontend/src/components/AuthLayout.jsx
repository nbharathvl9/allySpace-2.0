import "../styles/AuthLayout.css";

export default function AuthLayout({ children }) {
  return (
    <div className="auth-container">
      <div className="auth-card">
        {children}
      </div>
    </div>
  );
}
