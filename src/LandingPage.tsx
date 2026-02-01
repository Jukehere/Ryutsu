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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
            <a href="#/router" style={{ textDecoration: 'none' }}>
              <button className="landing-main-btn">
                Enter Shopping Router App
              </button>
            </a>
            <a href="#/scrip-exchange" style={{ textDecoration: 'none' }}>
              <button className="landing-main-btn">
                Enter Scrip Exchange App
              </button>
            </a>
            <a href="#/tome-exchange" style={{ textDecoration: 'none' }}>
              <button className="landing-main-btn">
                Enter Tome Exchange App
              </button>
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LandingPage;
