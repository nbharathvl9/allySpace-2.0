import "../styles/ProfileModal.css";
import { IoClose } from "react-icons/io5";

export default function ProfileModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  const handleLogout =()=>{
    window.location.href="/login"
  }

  return (
    <div className="profile-overlay">
      <div className="profile-card">

        {/* Close Button */}
        <button className="profile-close-btn" onClick={onClose}>
          <IoClose size={26} />
        </button>

        {/* Avatar */}
        <div className="profile-avatar"></div>

        {/* Static User Details */}
        <h2 className="profile-username">@sam_dev</h2>
        <p className="profile-email">sam@example.com</p>

        {/* Example Roles */}
        <div className="role-badges">
          <span className="role-badge head">Head</span>
          <span className="role-badge subhead">Subproject Head</span>
          <span className="role-badge member">Member</span>
        </div>

        {/* Buttons */}
        <button className="edit-btn">
          Edit Profile
        </button>

        <button className="logout-big-btn" onClick={handleLogout}>
          Logout
        </button>

      </div>
    </div>
  );
}
