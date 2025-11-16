import { createContext, useContext, useState } from "react";

const ProjectContext = createContext();

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState([]);

const addProject = (project) => {
  setProjects(prev => [
    ...prev,
    { 
      ...project,
      subprojects: project.subprojects ?? []   // ⭐ ALWAYS ensure array
    }
  ]);
};

const addSubproject = (projectId, subproject) => {
  setProjects(prev =>
    prev.map((p, index) =>
      index === projectId
        ? { 
            ...p, 
            subprojects: [...(p.subprojects ?? []), subproject]  // ⭐ safe spread
          }
        : p
    )
  );
};

  return (
    <ProjectContext.Provider value={{ projects, addProject,addSubproject }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  return useContext(ProjectContext);
}
