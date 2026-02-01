
import React from "react";
import { ToastContext } from "./contexts/ToastContext";

interface InputSectionProps {
  onSearch: (items: string, isHQ: boolean) => void;
  items: string;
  isHQ: boolean;
  setItems: (items: string) => void;
  setIsHQ: (isHQ: boolean) => void;
  onOpenSidebar?: () => void;
  onOpenHelp?: () => void;
  crossDCMode?: boolean;
  setCrossDCMode?: (mode: boolean) => void;
}

const InputSection: React.FC<InputSectionProps> = ({
  onSearch,
  items,
  isHQ,
  setItems,
  setIsHQ,
  onOpenSidebar = () => {},
  onOpenHelp = () => {},
  crossDCMode = false,
  setCrossDCMode = () => {},
}) => {
  const toast = React.useContext(ToastContext);

  const handleClick = () => {
    if (!items.trim()) {
      toast.showToast("Please enter at least one item.", "error");
      return;
    }
    onSearch(items, isHQ);
    toast.showToast("Searching prices...", "info");
  };

  return (
    <section className="input-section">
      <div>
        <div className="input-group">
          <label htmlFor="items-input">
            <i className="fas fa-clipboard-list"></i> Paste your items list
          </label>
          <textarea
            id="items-input"
            value={items}
            onChange={e => setItems(e.target.value)}
            placeholder={`Paste your items here. Example:\n4x Claro Walnut Lumber\n1x Titanium Gold Nugget\n5x Ra'Kaznar Ingot`}
          ></textarea>
        </div>
        <div className="input-group">
          <label htmlFor="hq-switch">
            <i className="fas fa-gem"></i> Item Quality
          </label>
          <div className="quality-toggle">
            <button
              id="nq-btn"
              type="button"
              className={`quality-btn${!isHQ ? " active" : ""}`}
              onClick={() => setIsHQ(false)}
            >
              NQ
            </button>
            <button
              id="hq-btn"
              type="button"
              className={`quality-btn${isHQ ? " active" : ""}`}
              onClick={() => setIsHQ(true)}
            >
              HQ
            </button>
          </div>
        </div>
      </div>
      <div className="button-group" style={{ gap: 12, flexWrap: "wrap" }}>
        <button id="search-btn" className="btn btn-primary" onClick={handleClick}>
          <i className="fas fa-search"></i> Search Prices
        </button>
        <span style={{ fontWeight: 600, fontSize: "1.05rem", marginLeft: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ marginRight: 8 }}>Cross-DC Mode</span>
          <span style={{ position: "relative", display: "inline-block", width: 46, height: 26 }}>
            <span
              role="switch"
              aria-checked={!!crossDCMode}
              tabIndex={0}
              onClick={() => setCrossDCMode && setCrossDCMode(!crossDCMode)}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") {
                  setCrossDCMode && setCrossDCMode(!crossDCMode);
                }
              }}
              style={{
                position: "absolute",
                cursor: "pointer",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: crossDCMode ? "#6366f1" : "#ccc",
                transition: "background 0.2s",
                borderRadius: 26,
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                outline: "none",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: crossDCMode ? 22 : 2,
                  top: 2,
                  width: 22,
                  height: 22,
                  background: "#fff",
                  borderRadius: "50%",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
                  transition: "left 0.2s",
                  border: "1px solid #eee",
                }}
              />
            </span>
          </span>
        </span>
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 16, justifyContent: "flex-start", flexWrap: "wrap" }}>
        <button
          className="btn btn-secondary lists-btn-prominent"
          style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600, fontSize: "1.05rem", borderRadius: 8, boxShadow: "0 2px 8px rgba(99,102,241,0.08)", padding: "10px 18px 10px 16px" }}
          onClick={onOpenSidebar}
        >
          <i className="fas fa-list-ul"></i> Lists
        </button>
        <button
          className="btn btn-secondary help-btn-prominent"
          style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600, fontSize: "1.05rem", borderRadius: 8, boxShadow: "0 2px 8px rgba(99,102,241,0.08)", padding: "10px 18px 10px 16px" }}
          onClick={onOpenHelp}
        >
          <i className="fas fa-question-circle"></i> Help
        </button>
      </div>
    </section>
  );
};

export default InputSection;
