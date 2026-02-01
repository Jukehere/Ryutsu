import React from "react";

interface ItemCalcModalProps {
  open: boolean;
  item: {
    name: string;
    minPrice: number;
    cost: number;
    iconUrl?: string;
  } | null;
  itemCount: number;
  calcRevenue: number;
  onItemCountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
  darkMode: boolean;
}

const ItemCalcModal: React.FC<ItemCalcModalProps> = ({ open, item, itemCount, calcRevenue, onItemCountChange, onClose, darkMode }) => {
  if (!open || !item) return null;
  return (
    <div className={`modal-backdrop${open ? ' show' : ''}`} style={{ zIndex: 3000, background: darkMode ? 'rgba(30,32,50,0.7)' : 'rgba(99,102,241,0.10)' }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 600, minWidth: 380, width: "99vw", background: darkMode ? '#23232b' : '#fff', color: darkMode ? '#f3f3f7' : '#222', borderRadius: 20, padding: 48, boxShadow: darkMode ? '0 4px 32px #18181b' : '0 4px 32px #e0e7ff', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
        <button className="close-btn" title="Close" onClick={onClose} style={{ position: 'absolute', top: 24, right: 24, fontSize: '1.7rem', background: 'none', border: 'none', color: darkMode ? '#fff' : '#6366f1', cursor: 'pointer', zIndex: 2 }}>&times;</button>
        <h3 style={{ marginBottom: 12, fontWeight: 700, color: darkMode ? '#a5b4fc' : '#6366f1', fontSize: '1.55rem', letterSpacing: 0.5, textAlign: 'center' }}>
          <i className="fas fa-calculator" style={{ marginRight: 12 }}></i> Revenue Calculator
        </h3>
        <div style={{ fontWeight: 700, color: darkMode ? '#fff' : '#222', fontSize: '1.25rem', marginBottom: 24, textAlign: 'center', wordBreak: 'break-word' }}>
          {item.name}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32, marginBottom: 32, width: '100%', justifyContent: 'center' }}>
          {item.iconUrl && <img src={item.iconUrl} alt="icon" style={{ width: 48, height: 48, borderRadius: 10, boxShadow: darkMode ? '0 2px 8px #18181b' : '0 2px 8px #e0e7ff', marginRight: 10 }} />}
          <label htmlFor="item-count-input" style={{ fontWeight: 500, fontSize: '1.18rem', marginRight: 12 }}>Number of items to buy:</label>
          <input
            id="item-count-input"
            type="number"
            min={1}
            step={1}
            value={itemCount}
            onChange={onItemCountChange}
            style={{ padding: '14px 24px', borderRadius: 10, border: '2px solid #c7d2fe', fontSize: '1.25rem', width: 130, background: darkMode ? '#18181b' : '#f3f4fa', color: darkMode ? '#fff' : '#222', boxShadow: '0 1px 4px #e0e7ff', outline: 'none', fontWeight: 600 }}
          />
        </div>
        <div style={{ fontWeight: 500, color: darkMode ? '#a5b4fc' : '#6366f1', marginBottom: 28, fontSize: '1.18rem', background: darkMode ? '#18181b' : '#eef2ff', borderRadius: 10, padding: '16px 0', width: '100%', textAlign: 'center', boxShadow: darkMode ? '0 1px 4px #18181b' : '0 1px 4px #e0e7ff' }}>
          Currency required: <b style={{ fontWeight: 700 }}>{item.cost * itemCount}</b>
        </div>
        <div style={{ fontWeight: 500, fontSize: '1.28rem', color: darkMode ? '#fff' : '#222', marginBottom: 28, background: darkMode ? '#23232b' : '#f3f4fa', borderRadius: 10, padding: '18px 0', width: '100%', textAlign: 'center', boxShadow: darkMode ? '0 1px 4px #18181b' : '0 1px 4px #e0e7ff' }}>
          Estimated Revenue: <span style={{ fontWeight: 700, color: '#22c55e', fontSize: '1.28rem' }}>{calcRevenue ? `${calcRevenue.toLocaleString(undefined, { maximumFractionDigits: 2 })} Gil` : '-'}</span>
        </div>
        <button
          style={{ marginTop: 18, padding: '16px 48px', borderRadius: 10, border: 'none', background: darkMode ? '#6366f1' : '#6366f1', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '1.18rem', boxShadow: '0 2px 12px #e0e7ff', letterSpacing: 0.5, transition: 'background 0.18s' }}
          onClick={onClose}
        >Close</button>
      </div>
    </div>
  );
};

export default ItemCalcModal;
