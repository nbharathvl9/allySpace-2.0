import "../styles/createProject.css";
import { IoClose } from "react-icons/io5";
import { useProjects } from "../context/projectContext.jsx";

export default function YourSubprojectsModal({ isOpen, onClose }) {
  const { getSubteamsForUser, projects } = useProjects();

  if (!isOpen) return null;

  const mySubs = getSubteamsForUser();

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: "550px" }}>

        <button className="modal-close-btn" onClick={onClose}>
          <IoClose size={26} />
        </button>

        <h2 className="modal-title">Your Subprojects</h2>

        {mySubs.length === 0 ? (
          <p style={{ color: "#fff", marginTop: "20px" }}>
            You are not a subproject head for any teams.
          </p>
        ) : (
          mySubs.map((sp, index) => {

            // find parent project name
            const parentProject = projects.find((p) =>
              p.subprojects.includes(sp)
            );

            return (
              <div
                key={index}
                className="dashboard-card"
                style={{ marginBottom: "15px" }}
              >
                <h3>{sp.title}</h3>
                <p>{sp.desc}</p>
                <p style={{ color: "#60a5fa", marginTop: "10px" }}>
                  Lead: @{sp.lead}
                </p>
                <p style={{ fontSize: "0.85rem", opacity: 0.7 }}>
                  Parent Project: {parentProject?.title}
                </p>
              </div>
            );
          })
        )}

      </div>
    </div>
  );
}
