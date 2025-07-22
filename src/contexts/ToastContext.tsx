import React, { createContext, useState, useRef } from "react";
import type { ReactNode } from "react";

export type ToastType = "info" | "success" | "error";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextProps {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

export const ToastContext = createContext<ToastContextProps>({ showToast: () => {} });

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdRef = useRef(0);
  const [visibleToasts, setVisibleToasts] = useState<{ [id: number]: boolean }>({});

  const showToast = (message: string, type: ToastType = "info", duration = 3500) => {
    const id = ++toastIdRef.current;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration + 250);
  };

  const getIcon = (type: ToastType) => {
    if (type === "error") return <i className="fas fa-exclamation-triangle" style={{ color: "#b91c1c" }}></i>;
    if (type === "success") return <i className="fas fa-check-circle" style={{ color: "#065f46" }}></i>;
    return <i className="fas fa-info-circle" style={{ color: "#222" }}></i>;
  };

  const getStyle = (type: ToastType, visible: boolean) => {
    let bg, color, border;
    if (type === "error") {
      bg = "#fef2f2"; color = "#b91c1c"; border = "#fecaca";
    } else if (type === "success") {
      bg = "#ecfdf5"; color = "#065f46"; border = "#a7f3d0";
    } else {
      bg = "#f3f4f6"; color = "#222"; border = "#d1d5db";
    }
    return {
      minWidth: 220,
      maxWidth: "90vw",
      background: bg,
      color,
      border: `1px solid ${border}`,
      borderRadius: 8,
      boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
      padding: "14px 22px",
      fontSize: "1rem",
      display: "flex",
      alignItems: "center",
      gap: 10,
      opacity: visible ? 1 : 0,
      pointerEvents: "auto" as React.CSSProperties['pointerEvents'],
      transition: "opacity 0.25s, transform 0.25s",
      marginBottom: 0,
      transform: visible ? "translateY(0)" : "translateY(20px)",
    };
  };

  React.useEffect(() => {
    toasts.forEach(t => {
      if (!visibleToasts[t.id]) {
        setTimeout(() => setVisibleToasts(v => ({ ...v, [t.id]: true })), 10);
      }
    });
    Object.keys(visibleToasts).forEach(id => {
      if (!toasts.find(t => t.id === Number(id))) {
        setVisibleToasts(v => {
          const copy = { ...v };
          delete copy[Number(id)];
          return copy;
        });
      }
    });
  }, [toasts, visibleToasts]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toasts.length > 0 && (
        <div id="toast-container" style={{ position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 3000, display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
          {toasts.map(toast => (
            <div
              key={toast.id}
              className={`toast toast-${toast.type}`}
              style={getStyle(toast.type, visibleToasts[toast.id])}
            >
              {getIcon(toast.type)}
              <span>{toast.message}</span>
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
};

