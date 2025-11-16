import "../styles/ProfileModal.css";
import { IoClose } from "react-icons/io5";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function ProfileModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    userName: "",
    email: "",
  });

  // Fetch user data
  useEffect(() => {
    api
      .get("/user/profile")
      .then((res) => {
        setUser(res.data.user);
        setForm({
          userName: res.data.user.userName,
          email: res.data.user.email,
        });
      })
      .catch((err) => console.log(err));
  }, []);

  const handleLogout = async () => {
    await api.post("/auth/logout");
    window.location.href = "/login";
  };

  const handleSave = async () => {
    try {
      const res = await api.put("/user/profile", form);

      setUser(res.data.user);
      setEditMode(false);

      alert("Profile updated");
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="profile-overlay">
      <div className="profile-card">

        <button className="profile-close-btn" onClick={onClose}>
          <IoClose size={26} />
        </button>

        <div className="profile-avatar"></div>

        {/* VIEW MODE */}
        {!editMode && (
          <>
            <h2 className="profile-username">@{user?.userName}</h2>
            <p className="profile-email">{user?.email}</p>

            <div className="role-badges">
              <span className="role-badge head">Head</span>
              <span className="role-badge subhead">Subproject Head</span>
              <span className="role-badge member">Member</span>
            </div>

            <button className="edit-btn" onClick={() => setEditMode(true)}>
              Edit Profile
            </button>

            <button className="logout-big-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}

        {/* EDIT MODE */}
        {editMode && (
          <div className="edit-section">
            <div className="input-block">
              <label>UserName</label>
              <input
                type="text"
                value={form.userName}
                onChange={(e) =>
                  setForm({ ...form, userName: e.target.value })
                }
              />
            </div>

            <div className="input-block">
              <label>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            </div>

            <button className="save-btn" onClick={handleSave}>
              Save
            </button>

            <button
              className="cancel-btn"
              onClick={() => setEditMode(false)}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
