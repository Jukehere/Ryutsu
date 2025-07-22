import React, { useState } from "react";

interface HelpModalProps {
  open: boolean;
  onClose: () => void;
}

const helpTopics = [
  {
    title: "How to Use",
    content: (
      <ol style={{ marginLeft: "1.2em" }}>
        <li>Paste your shopping list in the <b>Paste your items list</b> box.</li>
        <li>Select your <b>Data Center</b> and <b>Item Quality</b> (NQ/HQ).</li>
        <li>Click <b>Search Prices</b> to fetch real-time market prices.</li>
        <li>Review the <b>Shopping List</b> table for best prices per item.</li>
        <li>Click <b>Find Path</b> to get an optimal route for shopping across servers.</li>
      </ol>
    ),
  },
  {
    title: "Item List Format",
    content: (
      <>
        <p>You can paste items in any of these formats:</p>
        <pre>{`4x Claro Walnut Lumber\n1x Titanium Gold Nugget\n5x Ra'Kaznar Ingot\n\n- 10 Hoptrap Leaf\n- 15 Clary Sage\n\n8 × Effervescent Water`}</pre>
        <p>The app will automatically detect quantities and item names.</p>
      </>
    ),
  },
  {
    title: "Lists & Saving",
    content: (
      <ul style={{ marginLeft: "1.2em" }}>
        <li>Click <b>Lists</b> to open the sidebar.</li>
        <li>Save your current list with a name for later use.</li>
        <li>Load or delete saved lists from the sidebar.</li>
        <li>Lists are stored locally in your browser.</li>
      </ul>
    ),
  },
  {
    title: "Price & Path Details",
    content: (
      <ul style={{ marginLeft: "1.2em" }}>
        <li>Click <b>Price List</b> on any item to see detailed server prices.</li>
        <li>After <b>Find Path</b>, click an item icon to copy its name.</li>
        <li>Estimated savings are shown if home server prices are available.</li>
      </ul>
    ),
  },
  {
    title: "Data Sources",
    content: (
      <ul style={{ marginLeft: "1.2em" }}>
        <li>Market prices from <a href="https://universalis.app/" target="_blank" rel="noopener noreferrer">Universalis.app</a></li>
        <li>Item data from <a href="https://xivapi.com/" target="_blank" rel="noopener noreferrer">XIVAPI</a></li>
      </ul>
    ),
  },
];

const HelpModal: React.FC<HelpModalProps> = ({ open, onClose }) => {
  const [expanded, setExpanded] = useState<number | null>(null);
  return (
    <div className={`modal-backdrop${open ? ' show' : ''}`} id="help-modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 540 }}>
        <button className="close-btn" id="close-help-modal" title="Close" onClick={onClose}>&times;</button>
        <h3><i className="fas fa-info-circle"></i> Ryutsu Help</h3>
        <div className="help-section">
          {helpTopics.map((topic, idx) => (
            <div
              className={`help-topic${expanded === idx ? " expanded" : ""}`}
              tabIndex={0}
              key={topic.title}
              onClick={() => setExpanded(expanded === idx ? null : idx)}
              onKeyDown={e => (e.key === "Enter" || e.key === " ") && setExpanded(expanded === idx ? null : idx)}
            >
              <div className="help-topic-header">
                <span className="chevron-wrap">
                  <i className="fas fa-chevron-right"></i>
                </span>
                <span>{topic.title}</span>
              </div>
              <div
                className="help-topic-content"
                style={{ maxHeight: expanded === idx ? 400 : 0 }}
              >
                <div className="help-topic-inner">{topic.content}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
