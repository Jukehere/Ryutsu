import React from "react";
import TopMenu from "./components/TopMenu";
import Footer from "./components/Footer";
import "./styles/App.css";

type LandingPageProps = {
  darkMode: boolean;
  onToggleDarkMode: () => void;
};
const LandingPage: React.FC<LandingPageProps> = ({ darkMode, onToggleDarkMode }) => {
  return (
    <>
      <TopMenu darkMode={darkMode} onToggleDarkMode={onToggleDarkMode} onOpenSidebar={() => {}} />
      <div className="app-root-with-header" style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div className="landing-content-box">
          <h1 className="landing-title">Welcome to Ryutsu Tools</h1>
          <p className="landing-desc">
            Ryutsu is a suite of tools for the FFXIV Marketboard. Plan your shopping, compare prices across datacenters, and optimize your route for maximum savings!
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center', width: '100%' }}>
            <a href="#/router" style={{ textDecoration: 'none', width: '100%' }}>
              <button className="landing-main-btn" style={{ width: '250px', fontSize: '1.2rem' }}>
                Shopping Router
              </button>
            </a>
            <hr style={{ width: '100%', margin: '2rem 0 1rem 0' }} />
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '2.2rem', fontWeight: 'bold', letterSpacing: '2px' }}>Exchanges</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '1.5rem', justifyContent: 'center', alignItems: 'center', marginBottom: '1rem' }}>
              <a href="#/tome-exchange" style={{ textDecoration: 'none' }}>
                <button className="landing-main-btn" style={{ minWidth: '120px', fontSize: '1.1rem' }}>
                  Tomes
                </button>
              </a>
              <a href="#/scrip-exchange" style={{ textDecoration: 'none' }}>
                <button className="landing-main-btn" style={{ minWidth: '120px', fontSize: '1.1rem' }}>
                  Scrips
                </button>
              </a>
              <a href="#/cosmic-exchange" style={{ textDecoration: 'none' }}>
                <button className="landing-main-btn" style={{ minWidth: '120px', fontSize: '1.1rem' }}>
                  Cosmic
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LandingPage;
