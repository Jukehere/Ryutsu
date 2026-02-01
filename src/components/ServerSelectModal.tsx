import React, { useState, useEffect } from "react";

export type ServerSelectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (datacenter: string, server: string) => void;
  darkMode?: boolean;
};

const UNIVERSALIS_DC_URL = "https://universalis.app/api/v2/data-centers";
const UNIVERSALIS_WORLDS_URL = "https://universalis.app/api/v2/worlds";

const ServerSelectModal: React.FC<ServerSelectModalProps> = ({ isOpen, onClose, onSelect, darkMode }) => {
  const [datacenters, setDatacenters] = useState<string[]>([]);
  const [dcServers, setDCServers] = useState<{ [dc: string]: string[] }>({});
  const [servers, setServers] = useState<string[]>([]);
  const [selectedDC, setSelectedDC] = useState<string>(() => localStorage.getItem("ryutsu_dc") || "");
  const [selectedServer, setSelectedServer] = useState<string>(() => localStorage.getItem("ryutsu_server") || "");
  const [loading, setLoading] = useState(false);

  type World = { id: number; name: string };
  type DataCenter = { name: string; region: string; worlds: number[] };

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      Promise.all([
        fetch(UNIVERSALIS_DC_URL).then(res => res.json()),
        fetch(UNIVERSALIS_WORLDS_URL).then(res => res.json())
      ]).then(([dcData, worldsData]: [DataCenter[], World[]]) => {
        const idToName: { [id: number]: string } = {};
        if (Array.isArray(worldsData)) {
          worldsData.forEach((w: World) => { idToName[w.id] = w.name; });
        }
        const dcServers: { [dc: string]: string[] } = {};
        if (Array.isArray(dcData)) {
          dcData.forEach((dc: DataCenter) => {
            dcServers[dc.name] = Array.isArray(dc.worlds)
              ? dc.worlds.map((id: number) => idToName[id]).filter(Boolean)
              : [];
          });
        }
        setDCServers(dcServers);
        setDatacenters(Object.keys(dcServers));
        setLoading(false);
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedDC) {
      setServers(dcServers[selectedDC] || []);
    } else {
      setServers([]);
    }
    localStorage.setItem("ryutsu_dc", selectedDC);
  }, [selectedDC, dcServers]);

  useEffect(() => {
    if (isOpen && selectedDC && servers.length > 0) {
      const savedServer = localStorage.getItem("ryutsu_server") || "";
      if (savedServer && servers.includes(savedServer)) {
        setSelectedServer(savedServer);
      } else {
        setSelectedServer("");
      }
    }
  }, [isOpen, selectedDC, servers]);

  const handleSelect = () => {
    if (selectedDC && selectedServer) {
      localStorage.setItem("ryutsu_dc", selectedDC);
      localStorage.setItem("ryutsu_server", selectedServer);
      onSelect(selectedDC, selectedServer);
      onClose();
    }
  };

  if (!isOpen) return null;

  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: darkMode ? "rgba(20,20,30,0.7)" : "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    transition: "background 0.3s"
  };
  const modalStyle: React.CSSProperties = {
    background: darkMode ? "#23232b" : "#fff",
    color: darkMode ? "#f3f3f7" : "#222",
    padding: 24,
    borderRadius: 16,
    minWidth: 320,
    maxWidth: "90vw",
    width: "100%",
    boxShadow: darkMode ? "0 2px 24px rgba(0,0,0,0.7)" : "0 2px 16px rgba(0,0,0,0.2)",
    transition: "background 0.3s, color 0.3s",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch"
  };
  const labelStyle: React.CSSProperties = {
    fontWeight: 500,
    marginBottom: 6,
    color: darkMode ? "#e0e0e6" : "#333"
  };
  const selectStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px 12px",
    borderRadius: 8,
    border: darkMode ? "1px solid #444" : "1px solid #ccc",
    background: darkMode ? "#2c2c38" : "#f7f7fa",
    color: darkMode ? "#f3f3f7" : "#222",
    fontSize: "1rem",
    marginTop: 4,
    marginBottom: 12,
    transition: "background 0.3s, color 0.3s"
  };
  const buttonStyle: React.CSSProperties = {
    padding: "8px 18px",
    borderRadius: 8,
    border: "none",
    fontWeight: 600,
    fontSize: "1rem",
    cursor: "pointer",
    background: darkMode ? "#3a3a4a" : "#e0e0f7",
    color: darkMode ? "#f3f3f7" : "#222",
    marginLeft: 8,
    transition: "background 0.3s, color 0.3s"
  };
  const cancelStyle: React.CSSProperties = {
    ...buttonStyle,
    background: darkMode ? "#23232b" : "#fff",
    border: darkMode ? "1px solid #444" : "1px solid #ccc"
  };
  const titleStyle: React.CSSProperties = {
    marginBottom: 18,
    fontSize: "1.35rem",
    fontWeight: 700,
    textAlign: "center",
    color: darkMode ? "#f3f3f7" : "#222"
  };
  const loadingStyle: React.CSSProperties = {
    textAlign: "center",
    marginBottom: 16,
    color: darkMode ? "#e0e0e6" : "#333"
  };
  return (
    <div className="modal-overlay" style={overlayStyle}>
      <div className="modal-content" style={modalStyle}>
        <h2 style={titleStyle}>Select Server</h2>
        {loading && <div style={loadingStyle}>Loading...</div>}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Datacenter</label>
          <select value={selectedDC} onChange={e => {
            setSelectedDC(e.target.value);
            localStorage.setItem("ryutsu_dc", e.target.value);
          }} style={selectStyle}>
            <option value="">Select Datacenter</option>
            {datacenters.map(dc => (
              <option key={dc} value={dc}>{dc}</option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Server</label>
          <select value={selectedServer} onChange={e => {
            setSelectedServer(e.target.value);
            localStorage.setItem("ryutsu_server", e.target.value);
          }} style={selectStyle} disabled={!selectedDC}>
            <option value="">Select Server</option>
            {servers.map(server => (
              <option key={server} value={server}>{server}</option>
            ))}
          </select>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button style={cancelStyle} onClick={onClose}>Cancel</button>
          <button style={buttonStyle} onClick={handleSelect} disabled={!selectedDC || !selectedServer}>Select</button>
        </div>
      </div>
    </div>
  );
};

export default ServerSelectModal;
