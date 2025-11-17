import "../styles/ProfileModal.css";
import { IoClose } from "react-icons/io5";
import { useEffect, useState } from "react";
import api from "../api/axios";
import FluidButton from "./FluidButton"; // 🔥 Import

export default function ProfileModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    userName: "",
    email: "",
  });

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

            {/* 🔥 Fluid Buttons */}
            <FluidButton
              style={{ width: "100%", marginTop: "12px" }}
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </FluidButton>
            <FluidButton
              className="btn-danger"
              style={{ width: "100%", marginTop: "12px" }}
              onClick={handleLogout}
            >
              Logout
            </FluidButton>
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

            {/* 🔥 Fluid Buttons */}
            <FluidButton
              className="btn-primary"
              style={{ width: "100%", marginTop: "10px" }}
              onClick={handleSave}
            >
              Save
            </FluidButton>
            <FluidButton
              style={{ width: "100%", marginTop: "12px" }}
              onClick={() => setEditMode(false)}
            >
              Cancel
            </FluidButton>
          </div>
        )}
      </div>
    </div>
  );
}