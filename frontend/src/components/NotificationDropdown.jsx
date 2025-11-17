import { useEffect, useState } from "react";
import "../styles/notif.css";
import api from "../api/axios";
import FluidButton from "./FluidButton"; // 🔥 Import

export default function NotificationDropdown({ close }) {
  const [notifs, setNotifs] = useState([]);

  const load = async () => {
    const res = await api.get("/notifications");
    setNotifs(res.data.notifications);
  };

  useEffect(() => {
    load();
  }, []);

  const accept = async (notif) => {
    if (notif.type === "SUBTEAM_HEAD_INVITE") {
      await api.post("/subteam/accept-subteam-head", {
        inviteId: notif.inviteId,
        notificationId: notif._id,
      });
    }
    if (notif.type === "SUBTEAM_MEMBER_INVITE") {
      await api.post("/subteam/accept-member", {
        notificationId: notif._id,
      });
    }
    await load();
  };

  const reject = async (notif) => {
    if (notif.type === "SUBTEAM_HEAD_INVITE") {
      await api.post("/subteam/reject-subteam-head", {
        inviteId: notif.inviteId,
        notificationId: notif._id,
      });
    }
    if (notif.type === "SUBTEAM_MEMBER_INVITE") {
      await api.post("/subteam/reject-member", {
        notificationId: notif._id,
      });
    }
    await load();
  };

  return (
    <div className="notif-box">
      <h3 className="notif-title">Notifications</h3>

      {notifs.length === 0 && (
        <p className="notif-empty">No new notifications</p>
      )}

      {notifs.map((n) => (
        <div key={n._id} className="notif-item">
          <p className="notif-msg">{n.message}</p>

          {n.status === "Pending" &&
            (n.type === "SUBTEAM_HEAD_INVITE" ||
              n.type === "SUBTEAM_MEMBER_INVITE") && (
              <div className="notif-actions">
                {/* 🔥 Fluid Buttons */}
                <FluidButton
                  className="btn-success"
                  style={{ padding: "5px 12px", fontSize: "14px" }}
                  onClick={() => accept(n)}
                >
                  ✓
                </FluidButton>
                <FluidButton
                  className="btn-danger"
                  style={{ padding: "5px 12px", fontSize: "14px" }}
                  onClick={() => reject(n)}
                >
                  ✕
                </FluidButton>
              </div>
            )}
        </div>
      ))}
    </div>
  );
}