import React, { useState } from "react";
import { ToastContext } from "./ToastContext";

interface PathStep {
  server: string;
  items: string[];
  total: number;
  // Optionally, add iconUrls and item names for each item
  itemDetails?: { name: string; iconUrl?: string }[];
}

interface PathSectionProps {
  steps: PathStep[];
  totalCost: number;
  totalSavings: number;
}

const PathSection: React.FC<PathSectionProps> = ({ steps, totalCost, totalSavings }) => {
  const [completed, setCompleted] = useState<{ [server: string]: boolean }>({});
  const toast = React.useContext(ToastContext);

  if (steps.length === 0) return null;

  const handleCopy = (item: string) => {
    navigator.clipboard.writeText(item);
    toast.showToast("Copied!", "success");
  };

  const handleComplete = (server: string) => {
    setCompleted(prev => ({ ...prev, [server]: !prev[server] }));
  };

  return (
    <section className="path-section" id="path-section">
      <div className="section-header">
        <h2><i className="fas fa-route"></i> Optimal Shopping Path</h2>
      </div>
      <div className="path-steps" id="path-steps">
        {steps.map((step, idx) => (
          <div
            className={`path-step${completed[step.server] ? " completed" : ""}`}
            key={step.server}
            style={{ opacity: completed[step.server] ? 0.5 : 1, transition: "opacity 0.5s" }}
          >
            <input
              type="checkbox"
              checked={!!completed[step.server]}
              onChange={() => handleComplete(step.server)}
              style={{ marginRight: 16, width: 22, height: 22 }}
              aria-label={`Mark ${step.server} as completed`}
            />
            {/* Layout: left (checkbox+items), center (server), right (price) */}
            <div style={{ display: "flex", flex: 1, alignItems: "center" }}>
              <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
                <div className="step-items" style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                  {step.items.map((itemStr, i) => {
                    const match = itemStr.match(/^(.*) x(\d+)$/);
                    const name = match ? match[1] : itemStr;
                    const qty = match ? match[2] : "";
                    let iconUrl: string | undefined = undefined;
                    if (step.itemDetails && step.itemDetails[i] && step.itemDetails[i].iconUrl) {
                      iconUrl = step.itemDetails[i].iconUrl;
                    }
                    return (
                      <span key={i} style={{ display: "flex", alignItems: "center", marginRight: 14 }}>
                        <span
                          className="route-item-icon"
                          tabIndex={0}
                          onClick={() => handleCopy(name)}
                          onKeyDown={e => (e.key === "Enter" || e.key === " ") && handleCopy(name)}
                          style={{ outline: "none" }}
                        >
                          {iconUrl ? (
                            <img src={iconUrl} alt="" />
                          ) : (
                            <i className="fas fa-cube"></i>
                          )}
                          {/* Show item name tooltip on hover (CSS only) */}
                          <span className="route-tooltip">{name}</span>
                        </span>
                        {qty && (
                          <span className="route-qty-badge" style={{ marginLeft: 6, fontWeight: 600, color: "#888", fontSize: "1em", minWidth: 24, textAlign: "left" }}>x{qty}</span>
                        )}
                      </span>
                    );
                  })}
                </div>
              </div>
              <div style={{ flex: 1, textAlign: "center", fontWeight: 600, fontSize: "1.08rem", color: "#6366f1" }}>
                <i className="fas fa-server" style={{ marginRight: 8 }}></i>
                {step.server}
              </div>
              <div className="step-price" style={{ flex: 1, textAlign: "right", fontWeight: 600, color: "#f59e0b", fontSize: "1.08rem", marginLeft: 18 }}>
                {step.total.toLocaleString()} Gil
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="total-row" id="total-cost">Total Estimated Cost: {totalCost.toLocaleString()} Gil</div>
      <div className="savings-row" id="total-savings" style={{ display: totalSavings > 0 ? "flex" : "none" }}>
        Estimated Savings: {totalSavings.toLocaleString()} Gil
      </div>
    </section>
  );
};

export default PathSection;
