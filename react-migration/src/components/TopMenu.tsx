import React from "react";

export type TopMenuProps = {
  onToggleDarkMode: () => void;
  darkMode: boolean;
  onOpenSidebar: () => void;
};

const TopMenu: React.FC<TopMenuProps> = ({
  onToggleDarkMode,
  darkMode,
}) => {
  return (
    <header className="top-menu" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100vw', height: 64, padding: '0 2rem', boxSizing: 'border-box' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}></div>
      <div className="app-title" style={{ flex: 0, display: 'flex', alignItems: 'center', gap: 12, fontSize: '1.2rem', fontWeight: 600, justifyContent: 'center', whiteSpace: 'nowrap' }}>
        <span>Ryutsu v0.5</span>
      </div>
      <div className="menu-controls" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 15 }}>
        <a
          href="https://github.com/Jukehere/Ryutsu"
          target="_blank"
          className="menu-btn"
          title="GitHub"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "1.25rem",
          }}
        >
          <i className="fab fa-github"></i>
        </a>
        <button
          id="mode-toggle"
          className="menu-btn"
          title="Toggle dark/light mode"
          onClick={onToggleDarkMode}
        >
          <i className={darkMode ? "fas fa-sun" : "fas fa-moon"}></i>
        </button>
      </div>
    </header>
  );
};

export default TopMenu;
