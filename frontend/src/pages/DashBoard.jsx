import Navbar from "../components/Navbar";
import "../styles/dashboard.css";
import Sidebar from "../components/sidebar.jsx";


export default function Dashboard() {
  const handleLogout = () => {
    window.location.href = "/login";
  };

  return (
    <div className="dashboard-wrapper">
          <Sidebar />
      <Navbar onLogout={handleLogout} />

      <div className="dashboard-content">
        <h1 className="dashboard-title">
          Welcome to your Dashboard<span style={{ color: "#60a5fa" }}>.</span>
        </h1>

        <p className="dashboard-subtitle">
          This dashboard now visually matches your login/signup pages perfectly.
        </p>

        <div className="dashboard-card">
          <h3>Your First Glass Widget</h3>
          <p>All components use the exact same UI language and styling family.</p>
        </div>
      </div>
    </div>
  );
}
