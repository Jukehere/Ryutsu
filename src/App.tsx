
import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { ToastProvider } from "./contexts/ToastContext";
import LandingPage from "./LandingPage";
import { injectFontAwesome } from "./utils/fontawesome-v6-cdn";
import "./styles/App.css";

type RouterAppProps = {
  darkMode: boolean;
  onToggleDarkMode: () => void;
};

import TopMenu from "./components/TopMenu";
import Sidebar from "./components/Sidebar";
import SearchPrices from "./components/SearchPrices";
import PathSection from "./components/PathSection";
import Footer from "./components/Footer";
import HelpModal from "./components/HelpModal";
import PriceListModal from "./components/PriceListModal";
import type { ResultItem } from "./components/ResultsSection";
import { ToastContext } from "./contexts/ToastContext";

type PathStep = {
  server: string;
  items: string[];
  total: number;
  itemDetails?: { name: string; iconUrl?: string }[];
};

const RouterApp: React.FC<RouterAppProps> = ({ darkMode, onToggleDarkMode }) => {
  const [results, setResults] = useState<ResultItem[]>([]);
  // List state and persistence
  const LS_PREFIX = "ryutsu-list-";
  const [lists, setLists] = useState<string[]>([]);
  const [listData, setListData] = useState<{ [name: string]: { itemsText: string; datacenter: string; isHQ: boolean } }>({});
  const [inputItems, setInputItems] = useState("");
  const [inputDatacenter, setInputDatacenter] = useState("");
  const [inputIsHQ, setInputIsHQ] = useState(false);
  const [pathSteps, setPathSteps] = useState<PathStep[]>([]);
  const [totalCost, setTotalCost] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [currentListName, setCurrentListName] = useState(""); // Track currently loaded list
  const toast = React.useContext(ToastContext);
  // Price List modal state
  const [priceListModal, setPriceListModal] = useState<{ open: boolean; itemId?: number; itemName: string; datacenter: string }>({ open: false, itemId: undefined, itemName: "", datacenter: "" });

  useEffect(() => {
    // FontAwesome is injected at the top level
    document.body.className = darkMode ? "dark-mode" : "light-mode";
    localStorage.setItem("ryutsu-dark-mode", darkMode ? "true" : "false");
  }, [darkMode]);

  // Handler for Find Path button (real logic)
  const handleFindPath = () => {
    if (results.length === 0) return;
    const itemsByServer: {
      [server: string]: Array<{
        item: string;
        qty: number;
        price: number;
        iconUrl?: string;
      }>;
    } = {};
    let totalCostValue = 0;
    let homeServerCost = 0;
    let homeServer: string | undefined = undefined;
    for (const r of results) {
      if (r.homeServer) {
        homeServer = r.homeServer;
        break;
      }
    }
    results.forEach((item) => {
      const server = item.server || "Unknown";
      if (!itemsByServer[server]) itemsByServer[server] = [];
      itemsByServer[server].push({ item: item.item, qty: item.qty || item.quantity || 1, price: item.price || 0, iconUrl: item.iconUrl });
      totalCostValue += (item.price || 0) * (item.qty || item.quantity || 1);
      if (homeServer && item.homeServer === server) {
        homeServerCost += (item.homePrice || 0) * (item.qty || item.quantity || 1);
      }
    });
    const steps: PathStep[] = Object.entries(itemsByServer).map(([server, items]) => ({
      server,
      items: items.map(i => `${i.item} x${i.qty}`),
      total: items.reduce((sum, i) => sum + i.price * i.qty, 0),
      itemDetails: items.map(i => ({ name: i.item, iconUrl: i.iconUrl })),
    }));
    const savings = homeServerCost > 0 ? homeServerCost - totalCostValue : 0;
    setPathSteps(steps);
    setTotalCost(totalCostValue);
    setTotalSavings(savings);
  };

  const handleShowPriceList = (item: ResultItem) => {
    const id = item.itemId ?? undefined;
    if (typeof id !== "number" || !inputDatacenter) {
      toast.showToast("No item ID or datacenter for price list.", "error");
      return;
    }
    setPriceListModal({ open: true, itemId: id, itemName: item.item, datacenter: inputDatacenter });
  };

  // List persistence helpers
  const getSavedListNames = () => {
    const names: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(LS_PREFIX)) {
        names.push(key.substring(LS_PREFIX.length));
      }
    }
    return names.sort();
  };

  const loadAllLists = () => {
    const names = getSavedListNames();
    const data: { [name: string]: { itemsText: string; datacenter: string; isHQ: boolean } } = {};
    names.forEach(name => {
      const raw = localStorage.getItem(LS_PREFIX + name);
      if (raw) {
        try {
          data[name] = JSON.parse(raw);
        } catch {
          // Ignore invalid JSON
        }
      }
    });
    setLists(names);
    setListData(data);
  };

  useEffect(() => {
    loadAllLists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Clear current list name if any input changes from loaded list
  const handleItemsChange = (items: string) => {
    setInputItems(items);
    if (
      currentListName &&
      items !== (listData[currentListName]?.itemsText || "")
    ) {
      setCurrentListName("");
    }
  };

  const handleIsHQChange = (hq: boolean) => {
    setInputIsHQ(hq);
    if (
      currentListName &&
      hq !== (listData[currentListName]?.isHQ || false)
    ) {
      setCurrentListName("");
    }
  };

  const handleSaveList = (name: string): boolean => {
    if (!name) {
      toast.showToast("Please enter a name for your list.", "error");
      return false;
    }
    if (!inputItems.trim()) {
      toast.showToast("No items to save. (inputItems is empty)", "error");
      return false;
    }
    if (lists.includes(name)) {
      if (!confirm(`A list named '${name}' already exists. Do you want to overwrite it?`)) {
        return false;
      }
    }
    const data = {
      itemsText: inputItems,
      datacenter: inputDatacenter,
      isHQ: inputIsHQ,
    };
    localStorage.setItem(LS_PREFIX + name, JSON.stringify(data));
    loadAllLists();
    setCurrentListName(name);
    toast.showToast(`List '${name}' saved locally. Items: ${inputItems}`, "success");
    return true;
  };

  const handleSelectList = (name: string) => {
    const data = listData[name];
    if (data) {
      setInputItems(data.itemsText || "");
      setInputDatacenter(data.datacenter || "");
      setInputIsHQ(!!data.isHQ);
      setCurrentListName(name);
      setSidebarOpen(false);
      toast.showToast(`List '${name}' loaded.`, "success");
    } else {
      toast.showToast("Selected list not found.", "error");
    }
  };

  const handleDeleteList = (name: string) => {
    if (confirm(`Delete list '${name}'? This cannot be undone.`)) {
      localStorage.removeItem(LS_PREFIX + name);
      loadAllLists();
      if (currentListName === name) {
        setCurrentListName("");
      }
      toast.showToast(`List '${name}' deleted.`, "success");
    }
  };

  const handleSidebarToggle = () => setSidebarOpen(open => !open);
  const handleSidebarBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) setSidebarOpen(false);
  };

  return (
    <>
      <TopMenu
        onToggleDarkMode={onToggleDarkMode}
        darkMode={darkMode}
        onOpenSidebar={handleSidebarToggle}
      />
      <div className={"app-root-with-header"}>
        {/* Sidebar and backdrop */}
        {sidebarOpen && (
          <div
            style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 1999, background: 'rgba(0,0,0,0.08)' }}
            onClick={handleSidebarBackdropClick}
          />
        )}
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          lists={lists}
          currentListName={currentListName}
          onSaveList={handleSaveList}
          onSelectList={handleSelectList}
          onDeleteList={handleDeleteList}
        />
        <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
        <SearchPrices
          items={inputItems}
          datacenter={inputDatacenter}
          isHQ={inputIsHQ}
          setItems={handleItemsChange}
          setIsHQ={handleIsHQChange}
          setResults={setResults}
          results={results}
          onFindPath={handleFindPath}
          onShowPriceList={handleShowPriceList}
          onOpenSidebar={handleSidebarToggle}
          onOpenHelp={() => setHelpOpen(true)}
        />
        <PathSection steps={pathSteps} totalCost={totalCost} totalSavings={totalSavings} />
        <Footer />
        <PriceListModal
          open={priceListModal.open}
          onClose={() => setPriceListModal(m => ({ ...m, open: false }))}
          itemId={priceListModal.itemId ?? 0}
          itemName={priceListModal.itemName}
          datacenter={priceListModal.datacenter}
        />
      </div>
    </>
  );
};







const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("ryutsu-dark-mode");
    return saved === "true";
  });

  useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "light-mode";
    localStorage.setItem("ryutsu-dark-mode", darkMode ? "true" : "false");
    injectFontAwesome();
  }, [darkMode]);

  const handleToggleDarkMode = () => setDarkMode((d) => !d);

  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage darkMode={darkMode} onToggleDarkMode={handleToggleDarkMode} />} />
          <Route path="/router" element={<RouterApp darkMode={darkMode} onToggleDarkMode={handleToggleDarkMode} />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
};

export default App;
