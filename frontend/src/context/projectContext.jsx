import { createContext, useContext, useState } from "react";

const ProjectContext = createContext();

export function ProjectProvider({ children }) {
 const [projects, setProjects] = useState([
  {
    title: "AI Research Project",
    description: "Developing an AI chatbot and emotion model.",
    subprojects: [
      {
        title: "Frontend UI",
        desc: "React-based dashboard and user interface.",
        lead: "bharath", // ⭐ You are subteam head
        members: ["arjun", "rahul"],
        tasks: 3,
      },
      {
        title: "Model Training",
        desc: "Training transformer-based emotion classifier.",
        lead: "gudda",
        members: ["bharath"], // ⭐ You are member
        tasks: 5,
      },
    ],
  },
  {
    title: "College Management System",
    description: "Managing reports, attendance, and notifications.",
    subprojects: [
      {
        title: "Backend Services",
        desc: "Node.js + Express backend.",
        lead: "arjun",
        members: ["bharath", "rahul"], // ⭐ You are member
        tasks: 1,
      },
      {
        title: "UI Redesign",
        desc: "Landing page + dashboard overhaul.",
        lead: "priya",
        members: ["gudda"],
        tasks: 0,
      },
    ],
  },
  {
    title: "Hackathon Project",
    description: "NASA Space Apps challenge prototype.",
    subprojects: [
      {
        title: "Data Cleaning",
        desc: "Processing satellite datasets.",
        lead: "bharath", // ⭐ You are head
        members: ["arjun"],
        tasks: 2,
      },
    ],
  },
]);


  // Fake logged-in user (replace later)
  const [currentUser, setCurrentUser] = useState("bharath");

  // Dashboard view mode
  const [viewMode, setViewMode] = useState("all");

  
  // Add MAIN project
  const addProject = (project) => {
    setProjects((prev) => [
      ...prev,
      {
        ...project,
        subprojects: [],
      },
    ]);
  };

  // Add SUBPROJECT to a specific project
  const addSubproject = (projectIndex, subproject) => {
    setProjects((prev) =>
      prev.map((p, i) =>
        i === projectIndex
          ? { ...p, subprojects: [...p.subprojects, subproject] }
          : p
      )
    );
  };

  // Get all subprojects where user is head
  const getSubteamsForUser = () => {
    return projects.flatMap((p) =>
      p.subprojects.filter((sp) => sp.lead === currentUser)
    );
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        addProject,
        addSubproject,
        currentUser,
        setCurrentUser,
        viewMode,
        setViewMode,
        getSubteamsForUser,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export const useProjects = () => useContext(ProjectContext);
