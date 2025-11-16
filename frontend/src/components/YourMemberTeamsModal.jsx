import "../styles/createProject.css";
import { IoClose } from "react-icons/io5";
import { useProjects } from "../context/projectContext.jsx";

export default function YourMemberTeamsModal({ isOpen, onClose }) {
  const { projects, currentUser } = useProjects();

  if (!isOpen) return null;

  // ⭐ Get subprojects where user is a MEMBER
  const myMemberTeams = projects.flatMap((project) =>
    project.subprojects.filter((sp) =>
      Array.isArray(sp.members) && sp.members.includes(currentUser)
    ).map((sp) => ({
      ...sp,
      parentTitle: project.title,
    }))
  );

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: "550px" }}>

        {/* CLOSE BUTTON */}
        <button className="modal-close-btn" onClick={onClose}>
          <IoClose size={26} />
        </button>

        <h2 className="modal-title">Teams You Are a Member Of</h2>

        {myMemberTeams.length === 0 ? (
          <p style={{ color: "#fff", marginTop: "20px" }}>
            You are not a member of any subteam.
          </p>
        ) : (
          myMemberTeams.map((team, index) => (
            <div
              key={index}
              className="dashboard-card"
              style={{ marginBottom: "15px" }}
            >
              <h3>{team.title}</h3>
              <p>{team.desc}</p>

              <p
                style={{
                  color: "#60a5fa",
                  marginTop: "10px",
                  fontSize: "0.9rem",
                }}
              >
                Lead: @{team.lead}
              </p>

              <p
                style={{
                  color: "#94a3b8",
                  fontSize: "0.85rem",
                  marginTop: "4px",
                }}
              >
                Parent Project: {team.parentTitle}
              </p>
            </div>
          ))
        )}

      </div>
    </div>
  );
}
