import React, { useState } from "react";
import { ToastContext } from "../contexts/ToastContext";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  lists: string[];
  currentListName?: string;
  onSaveList: (name: string) => boolean;
  onSelectList: (name: string) => void;
  onDeleteList: (name: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, lists, currentListName = "", onSaveList, onSelectList, onDeleteList }) => {
  const [listName, setListName] = useState("");
  const toast = React.useContext(ToastContext);
  React.useEffect(() => {
    if (open && currentListName) {
      setListName(currentListName);
    } else if (open && !currentListName) {
      setListName("");
    }
  }, [open, currentListName]);

  const handleSaveList = () => {
    const trimmedName = listName.trim();
    if (!trimmedName) {
      toast.showToast("Please enter a name for your list.", "error");
      return;
    }
    const result = onSaveList(trimmedName);
    if (result) {
      if (trimmedName !== currentListName) setListName("");
      toast.showToast(`List '${trimmedName}' saved!`, "success");
    } else {
      toast.showToast("Could not save list. Check your items and name.", "error");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveList();
    }
  };

  return (
    <aside className={`lists-sidebar${open ? " open" : ""}`} style={{ pointerEvents: open ? 'auto' : 'none' }}>
      <div className="lists-sidebar-header">
        <span style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600, fontSize: "1.1rem" }}>
          <i className="fas fa-list-ul"></i> Lists
        </span>
        <button id="close-lists-sidebar" className="sidebar-close-btn" title="Close" onClick={onClose}>
          &times;
        </button>
      </div>
      <div className="lists-sidebar-content">
        <div className="sidebar-section">
          <input
            id="sidebar-list-name"
            type="text"
            placeholder="List name..."
            className="sidebar-input"
            value={listName}
            onChange={e => setListName(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            id="sidebar-save-list-btn"
            className="btn btn-secondary"
            style={{ width: "100%", marginTop: 8 }}
            onClick={handleSaveList}
          >
            <i className="fas fa-save"></i> Save Current
          </button>
        </div>
        <div className="sidebar-section" style={{ marginTop: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 8, fontSize: "1rem", display: "flex", alignItems: "center", gap: 6 }}>
            <i className="fas fa-folder-open"></i> Saved Lists
          </div>
          <ul id="sidebar-lists-list" className="sidebar-lists-list">
            {lists.length === 0 ? (
              <li style={{ color: "#888", fontSize: "0.97rem", padding: "10px 0" }}>No saved lists.</li>
            ) : (
              lists.map((name, idx) => (
                <li key={idx} className={`sidebar-list-item${name === currentListName ? ' current-list' : ''}`}>
                  <span className="sidebar-list-label" title="Load list" onClick={() => onSelectList(name)}>
                    <i className="fas fa-folder"></i> {name}
                    {name === currentListName && <span className="current-indicator"> (current)</span>}
                  </span>
                  <span className="sidebar-list-actions">
                    <button className="sidebar-list-btn" title="Delete" onClick={() => onDeleteList(name)}>
                      <i className="fas fa-trash"></i>
                    </button>
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
