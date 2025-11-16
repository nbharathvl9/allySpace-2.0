import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { SidebarProvider } from './context/sideBarContext.jsx' 
import { ProjectProvider } from './context/projectContext.jsx'  // ⭐ ADD THIS

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <SidebarProvider>
      <ProjectProvider>   {/* ⭐ Add this */}
        <App />
      </ProjectProvider>
    </SidebarProvider>
  </StrictMode>,
)
