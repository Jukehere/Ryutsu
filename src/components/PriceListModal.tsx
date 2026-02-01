import React, { useEffect, useState } from "react";

interface Listing {
  worldName: string;
  pricePerUnit: number;
  quantity: number;
  hq: boolean;
}

interface PriceListModalProps {
  open: boolean;
  onClose: () => void;
  itemId: number;
  itemName: string;
  datacenter: string;
  crossDCMode?: boolean;
}

const PriceListModal: React.FC<PriceListModalProps> = ({ open, onClose, itemId, itemName, datacenter, crossDCMode }) => {
  useEffect(() => {
    console.log('PriceListModal props:', { open, itemId, itemName, datacenter, crossDCMode });
  }, [open, itemId, itemName, datacenter, crossDCMode]);
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<Listing[]>([]);
  const [error, setError] = useState<string | null>(null);

  const REGION_MAP: Record<string, string> = {
    "Aether": "America",
    "Primal": "America",
    "Crystal": "America",
    "Dynamis": "America",
    "Chaos": "Europe",
    "Light": "Europe",
    "Elemental": "Japan",
    "Gaia": "Japan",
    "Mana": "Japan",
    "Meteor": "Japan",
    "Materia": "Oceania",
  };

  const REGION_DC_LIST: Record<string, string[]> = {
    America: ["Aether", "Primal", "Crystal", "Dynamis"],
    Europe: ["Chaos", "Light"],
    Japan: ["Elemental", "Gaia", "Mana", "Meteor"],
    Oceania: ["Materia"],
  };

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError(null);
    setListings([]);
    const fetchListings = async () => {
      try {
        let endpoint = datacenter;
        if (crossDCMode && REGION_MAP[datacenter]) {
          endpoint = REGION_MAP[datacenter].toLowerCase();
        }
        const url = `https://universalis.app/api/v2/${endpoint}/${itemId}?listings=20`;
        const resp = await fetch(url);
        if (!resp.ok) throw new Error("Failed to fetch price list");
        const data = await resp.json();
        let arr: Listing[] = [];
        if (Array.isArray(data.listings)) {
          arr = data.listings;
        } else if (data.items && data.items[itemId] && Array.isArray(data.items[itemId].listings)) {
          arr = data.items[itemId].listings;
        }
        if (!arr.length) {
          setError("No price data found.");
          setListings([]);
        } else {
          setListings(arr);
        }
      } catch {
        setError("Failed to load price data.");
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [open, itemId, datacenter, crossDCMode]);

  return (
    <div className={`modal-backdrop${open ? ' show' : ''}`} id="universalis-modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 480, width: "95vw" }}>
        <button className="close-btn" id="close-universalis-modal" title="Close" onClick={onClose}>&times;</button>
        <h3 style={{ marginBottom: 12 }}><i className="fas fa-tags"></i> {itemName} Price List</h3>
        {crossDCMode && REGION_MAP[datacenter] && (
          <div style={{ fontWeight: 600, color: "#6366f1", marginBottom: 8, fontSize: "1.05rem" }}>
            Region: {REGION_MAP[datacenter]}
            <div style={{ marginTop: 6, fontWeight: 500, color: "#444", fontSize: "0.98rem" }}>
              Data Centers in this region:
              <ul style={{ margin: "4px 0 0 0", padding: 0, listStyle: "none", display: "flex", gap: 10 }}>
                {REGION_DC_LIST[REGION_MAP[datacenter]]?.map(dc => (
                  <li key={dc} style={{ background: "#eef2ff", color: "#6366f1", borderRadius: 6, padding: "2px 10px", fontWeight: 600, fontSize: "0.97rem" }}>{dc}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
        <div id="universalis-modal-content" style={{ minHeight: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {loading ? (
            <i className="fas fa-spinner fa-spin"></i>
          ) : error ? (
            <div style={{ color: "#e74c3c", textAlign: "center" }}>{error}</div>
          ) : (
            <div style={{ maxHeight: 320, overflowY: "auto", width: "100%" }}>
              <table style={{ width: "100%", fontSize: "0.97rem", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "7px 6px", color: "#6366f1" }}>Server</th>
                    <th style={{ textAlign: "right", padding: "7px 6px", color: "#6366f1" }}>Price</th>
                    <th style={{ textAlign: "center", padding: "7px 6px", color: "#6366f1" }}>Qty</th>
                    <th style={{ textAlign: "center", padding: "7px 6px", color: "#6366f1" }}>HQ</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map((l, idx) => (
                    <tr key={idx}>
                      <td style={{ padding: "7px 6px" }}>{l.worldName}</td>
                      <td style={{ padding: "7px 6px", textAlign: "right" }}>{l.pricePerUnit.toLocaleString()} Gil</td>
                      <td style={{ padding: "7px 6px", textAlign: "center" }}>{l.quantity}</td>
                      <td style={{ padding: "7px 6px", textAlign: "center" }}>{l.hq ? <span style={{ color: "#6366f1", fontWeight: 600 }}>HQ</span> : "NQ"}</td>
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

export default PriceListModal;
