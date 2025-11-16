import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";  // ⭐ Required import
import App from "./App";
import "./index.css";

import { SidebarProvider } from "./context/sideBarContext.jsx";
import { ProjectProvider } from "./context/projectContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SidebarProvider>
      <ProjectProvider>
        <App />
      </ProjectProvider>
    </SidebarProvider>
  </StrictMode>
);
