/* frontend/src/context/ToastContext.jsx */
import React, { createContext, useContext, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from "react-icons/fi";
import "../styles/Toast.css";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.map(t => t.id === id ? { ...t, closing: true } : t));
    // Actual removal after animation
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 400);
  }, []);

  const showToast = useCallback((message, type = "info") => {
    const id = Date.now();
    const newToast = { id, message, type, closing: false };
    
    setToasts((prev) => [...prev, newToast]);

    // Auto dismiss after 5 seconds
    setTimeout(() => removeToast(id), 5000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Portal to render toasts outside main app flow */}
      {createPortal(
        <div className="toast-container">
          {toasts.map((toast) => (
            <div key={toast.id} className={`toast ${toast.type} ${toast.closing ? "closing" : ""}`}>
              <div className="toast-icon">
                {toast.type === "success" && <FiCheckCircle size={20} />}
                {toast.type === "error" && <FiAlertCircle size={20} />}
                {toast.type === "info" && <FiInfo size={20} />}
              </div>
              <div className="toast-content">
                <div className="toast-title">
                  {toast.type === "success" ? "Success" : toast.type === "error" ? "Error" : "Info"}
                </div>
                <div className="toast-message">{toast.message}</div>
              </div>
              <button className="toast-close" onClick={() => removeToast(toast.id)}>
                <FiX size={18} />
              </button>
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};