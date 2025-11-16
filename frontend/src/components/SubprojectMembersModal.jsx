import "../styles/createProject.css";
import { IoClose } from "react-icons/io5";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function SubprojectMembersModal({ subteamId, onClose }) {
  const [members, setMembers] = useState([]);
  const [subteamName, setSubteamName] = useState("");

  useEffect(() => {
    api.get(`/subteam/return-subteams/${subteamId}`)
      .then(res => {
        setMembers(res.data.members);
        setSubteamName(res.data.subteamName);
      })
      .catch(err => console.log(err));
  }, [subteamId]);

  return (
    <div className="modal-overlay">
      <div className="modal-card-large">
        <button className="modal-close-btn" onClick={onClose}>
          <IoClose size={26} />
        </button>

        <h2 className="modal-title">{subteamName}</h2>

        {members.length === 0 ? (
          <p style={{ color: "#fff", marginTop: "20px" }}>
            No members found.
          </p>
        ) : (
          <div className="member-list">
            {members.map((m) => (
              <div className="member-card" key={m._id}>
                <h3>{m.userName}</h3>
                <p>Email: {m.email}</p>

                <p className="task-title">Task: {m.assignedTask}</p>
                {m.description && <p>{m.description}</p>}

                <span
                  className={`status-badge ${
                    m.status === "Completed"
                      ? "status-completed"
                      : m.status === "In Progress"
                      ? "status-progress"
                      : "status-pending"
                  }`}
                >
                  {m.status}
                </span>

                {m.deadline && (
                  <p className="deadline">
                    Deadline: {new Date(m.deadline).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
