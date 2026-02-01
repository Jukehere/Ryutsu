import React, { useEffect, useState } from "react";

interface HistoryEntry {
  worldName: string;
  pricePerUnit: number;
  quantity: number;
  hq: boolean;
  timestamp?: number;
  purchaseDate?: number;
}

interface PurchaseHistoryModalProps {
  open: boolean;
  onClose: () => void;
  itemId: number;
  itemName: string;
  server: string;
}

const PurchaseHistoryModal: React.FC<PurchaseHistoryModalProps> = ({ open, onClose, itemId, itemName, server }) => {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError(null);
    setHistory([]);
    const fetchHistory = async () => {
      try {
        const selectedServer = server || localStorage.getItem("ryutsu_server") || "";
        const url = `https://universalis.app/api/v2/history/${selectedServer}/${itemId}`;
        const resp = await fetch(url);
        if (!resp.ok) throw new Error("Failed to fetch purchase history");
        const data = await resp.json();
        let arr: any[] = [];
        if (Array.isArray(data.entries)) {
          arr = data.entries;
        } else if (data.items && data.items[itemId] && Array.isArray(data.items[itemId].entries)) {
          arr = data.items[itemId].entries;
        }
        const now = Date.now() / 1000;
        // Only filter by last 7 days
        const filtered = arr.filter(h => {
          const ts = h.timestamp ?? h.purchaseDate;
          return ts && (now - ts <= 604800);
        });
        if (!filtered.length) {
          setError("No purchase history found for this server in the past 7 days.");
          setHistory([]);
        } else {
          setHistory(filtered);
        }
      } catch (err) {
        setError("Failed to load purchase history.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [open, itemId, server]);

  return (
    <div className={`modal-backdrop${open ? ' show' : ''}`} id="purchase-history-modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 520, width: "97vw" }}>
        <button className="close-btn" id="close-purchase-history-modal" title="Close" onClick={onClose}>&times;</button>
        <h3 style={{ marginBottom: 12 }}><i className="fas fa-history"></i> {itemName} Purchase History</h3>
        <div id="purchase-history-modal-content" style={{ minHeight: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {loading ? (
            <i className="fas fa-spinner fa-spin"></i>
          ) : error ? (
            <div style={{ color: "#e74c3c", textAlign: "center" }}>{error}</div>
          ) : (
            <div style={{ maxHeight: 340, overflowY: "auto", width: "100%" }}>
              <table style={{ width: "100%", fontSize: "0.97rem", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "right", padding: "7px 6px", color: "#6366f1" }}>Price</th>
                    <th style={{ textAlign: "center", padding: "7px 6px", color: "#6366f1" }}>Qty</th>
                    <th style={{ textAlign: "center", padding: "7px 6px", color: "#6366f1" }}>HQ</th>
                    <th style={{ textAlign: "center", padding: "7px 6px", color: "#6366f1" }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h, idx) => (
                    <tr key={idx}>
                      <td style={{ padding: "7px 6px", textAlign: "right" }}>{h.pricePerUnit.toLocaleString()} Gil</td>
                      <td style={{ padding: "7px 6px", textAlign: "center" }}>{h.quantity}</td>
                      <td style={{ padding: "7px 6px", textAlign: "center" }}>{h.hq ? <span style={{ color: "#6366f1", fontWeight: 600 }}>HQ</span> : "NQ"}</td>
                      <td style={{ padding: "7px 6px", textAlign: "center" }}>{(() => {
                        const ts = h.timestamp ?? h.purchaseDate;
                        if (!ts) return "-";
                        const d = new Date(ts * 1000);
                        return d.toLocaleString();
                      })()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <button id="open-universalis-btn" style={{ marginTop: 18, width: "100%", padding: "12px 0", background: "#6366f1", color: "#fff", border: "none", borderRadius: 7, fontWeight: 600, fontSize: "1rem", cursor: "pointer", transition: "background 0.2s" }}
          onClick={() => window.open(`https://universalis.app/market/${itemId}`, "_blank")}
        >
          <i className="fas fa-external-link-alt"></i> Open In Universalis
        </button>
      </div>
    </div>
  );
};

export default PurchaseHistoryModal;
