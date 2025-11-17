import { useEffect, useState } from "react";
import { createPortal } from "react-dom"; // 🔥 Import Portal
import "../styles/notif.css";
import api from "../api/axios";
import FluidButton from "./FluidButton";
import { FiInbox } from "react-icons/fi"; // Import an icon

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

  // 🔥 Use createPortal to render the modal directly into document.body
  return createPortal(
    <div className="notif-box">
      <h3 className="notif-title">Notifications</h3>

      {notifs.length === 0 && (
        <div className="notif-empty">
          <FiInbox size={32} />
          <p>No new notifications</p>
          <span>You're all caught up!</span>
        </div>
      )}

      <div className="notif-list">
        {notifs.map((n) => (
          <div key={n._id} className="notif-item">
            <p className="notif-msg">{n.message}</p>

            {n.status === "Pending" &&
              (n.type === "SUBTEAM_HEAD_INVITE" ||
                n.type === "SUBTEAM_MEMBER_INVITE") && (
                <div className="notif-actions">
                  <FluidButton
                    className="btn-success"
                    style={{ padding: "6px 14px", fontSize: "13px" }}
                    onClick={() => accept(n)}
                  >
                    Accept
                  </FluidButton>
                  <FluidButton
                    className="btn-danger"
                    style={{ padding: "6px 14px", fontSize: "13px" }}
                    onClick={() => reject(n)}
                  >
                    Reject
                  </FluidButton>
                </div>
              )}
          </div>
        ))}
      </div>
    </div>,
    document.body // Target document.body
  );
}