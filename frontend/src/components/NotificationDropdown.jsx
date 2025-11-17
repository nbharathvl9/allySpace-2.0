import { useEffect, useState } from "react";
import { createPortal } from "react-dom"; 
import "../styles/notif.css";
import api from "../api/axios";
import FluidButton from "./FluidButton";
import { FiInbox } from "react-icons/fi"; 

export default function NotificationDropdown({ close }) {
  const [notifs, setNotifs] = useState([]);

  const load = async () => {
    const res = await api.get("/notifications");
    setNotifs(res.data.notifications);
  };

  useEffect(() => {
    load();
  }, []);

  // Generic Accept (Invites)
  const accept = async (notif) => {
    if (notif.type === "SUBTEAM_HEAD_INVITE") {
      await api.post("/subteam/accept-subteam-head", { inviteId: notif.inviteId, notificationId: notif._id });
    }
    if (notif.type === "SUBTEAM_MEMBER_INVITE") {
      await api.post("/subteam/accept-member", { notificationId: notif._id });
    }
    await load();
  };

  // Generic Reject (Invites)
  const reject = async (notif) => {
    if (notif.type === "SUBTEAM_HEAD_INVITE") {
      await api.post("/subteam/reject-subteam-head", { inviteId: notif.inviteId, notificationId: notif._id });
    }
    if (notif.type === "SUBTEAM_MEMBER_INVITE") {
      await api.post("/subteam/reject-member", { notificationId: notif._id });
    }
    await load();
  };

  // 🔥 JOIN REQUEST: ACTIONS
  const handleJoinAction = async (action, notif) => {
    try {
      if (action === "reject") {
        await api.post("/subteam/join/reject", { notificationId: notif._id });
      } else if (action === "member") {
        await api.post("/subteam/join/approve-member", { notificationId: notif._id });
      } else if (action === "head") {
        await api.post("/subteam/join/approve-head", { notificationId: notif._id });
      }
      await load();
    } catch (err) {
      alert("Action failed");
    }
  };

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

            {/* Path for Tasks */}
            {n.type === "TASK_RESPONSE" && (
              <p style={{ fontSize: "12px", color: "#60a5fa", marginTop: "6px", opacity: 0.8 }}>
                {`{ ${n.senderId?.userName} / ${n.subteamId?.name} / ${n.teamId?.TeamName} }`}
              </p>
            )}

            {/* Standard Invite Actions */}
            {n.status === "Pending" && (n.type === "SUBTEAM_HEAD_INVITE" || n.type === "SUBTEAM_MEMBER_INVITE") && (
              <div className="notif-actions">
                <FluidButton className="btn-success" style={{ padding: "6px 14px", fontSize: "12px" }} onClick={() => accept(n)}>Accept</FluidButton>
                <FluidButton className="btn-danger" style={{ padding: "6px 14px", fontSize: "12px" }} onClick={() => reject(n)}>Reject</FluidButton>
              </div>
            )}

            {/* 🔥 JOIN REQUEST ACTIONS */}
            {n.status === "Pending" && n.type === "JOIN_REQUEST" && (
              <div className="notif-actions-col">
                <FluidButton 
                  className="btn-success" 
                  style={{ width: "100%", fontSize: "12px", padding: "8px" }}
                  onClick={() => handleJoinAction("member", n)}
                >
                  Add as Member
                </FluidButton>
                
                <FluidButton 
                  style={{ width: "100%", fontSize: "12px", padding: "8px", background: "rgba(124, 58, 237, 0.2)", borderColor: "rgba(124, 58, 237, 0.4)", color: "#a78bfa" }}
                  onClick={() => handleJoinAction("head", n)}
                >
                  Add as Subteam Head
                </FluidButton>

                <FluidButton 
                  className="btn-danger" 
                  style={{ width: "100%", fontSize: "12px", padding: "8px" }}
                  onClick={() => handleJoinAction("reject", n)}
                >
                  Reject
                </FluidButton>
              </div>
            )}

          </div>
        ))}
      </div>
    </div>,
    document.body 
  );
}