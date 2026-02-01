import React, { useState, useEffect } from "react";
import purpleCrafterScrips from "../data/purple-crafter-scrips.json";
import orangeCrafterScrips from "../data/orange-crafter-scrips.json";
import purpleGathererScrips from "../data/purple-gatherer-scrips.json";
import orangeGathererScrips from "../data/orange-gatherer-scrips.json";
import { fetcher, fetchMarketData } from "../api/api";

interface UniversalisResponse {
  items?: Record<number, MarketDataEntry>;
  unresolved?: number[];
}
import TopMenu from "./TopMenu";
import Footer from "./Footer";
import PurchaseHistoryModal from "./PurchaseHistoryModal";
import ItemCalcModal from "./ItemCalcModal";
import "../styles/ScripExchange.css";

const SCRIP_TYPES = [
  "Purple Crafter Scrips",
  "Orange Crafter Scrips",
  "Purple Gatherer Scrips",
  "Orange Gatherer Scrips"
];

interface ScripItem {
  itemId: number;
  name: string;
  cost: number;
  iconUrl?: string;
}

interface MarketListing {
  pricePerUnit: number;
  quantity: number;
}

interface MarketHistory {
  quantity: number;
  timestamp?: number;
  purchaseDate?: number;
}

interface MarketDataEntry {
  listings?: MarketListing[];
  recentHistory?: MarketHistory[];
}

type MarketData = Record<number, MarketDataEntry>;

const SORTABLE_COLUMNS = [
  { key: "name", label: "Item" },
  { key: "cost", label: "Cost (Scrips)" },
  { key: "minPrice", label: "Min Price" },
  { key: "weeklySales", label: "Weekly Sales" },
  { key: "qtyPerWeek", label: "Qty/Week" },
  { key: "valuePerScrip", label: "Value/Scrip" }
];

const SERVER_LIST: string[] = [];

const ScripExchange: React.FC<{ darkMode: boolean; onToggleDarkMode: () => void }> = ({ darkMode, onToggleDarkMode }) => {
  const [scripType, setScripType] = useState<string>(SCRIP_TYPES[0]);
  const [items, setItems] = useState<ScripItem[]>([]);
  const [marketData, setMarketData] = useState<MarketData>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [datacenter, setDatacenter] = useState<string>(() => localStorage.getItem("ryutsu_dc") || "");
  const [server, setServer] = useState<string>(() => localStorage.getItem("ryutsu_server") || SERVER_LIST[0]);
  const [sortBy, setSortBy] = useState<string>("weeklySales");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [calculatorItem, setCalculatorItem] = useState<null | typeof displayItems[0]>(null);
  const [itemCount, setItemCount] = useState<number>(1);
  const [calcRevenue, setCalcRevenue] = useState<number>(0);
  const [calcModalOpen, setCalcModalOpen] = useState(false);

  const handleSearchItems = () => {
    setLoading(true);
    const fileMap: Record<string, Array<{ name: string; cost: number }>> = {
      "Purple Crafter Scrips": purpleCrafterScrips,
      "Orange Crafter Scrips": orangeCrafterScrips,
      "Purple Gatherer Scrips": purpleGathererScrips,
      "Orange Gatherer Scrips": orangeGathererScrips
    };
    const loaded = fileMap[scripType] || [];
    Promise.all(
      loaded.map(async (item) => {
        const xivapi = await fetchItemIdAndIconFromXIVAPI(item.name);
        return {
          itemId: xivapi.id ?? 0,
          name: xivapi.canonicalName ?? item.name,
          cost: item.cost,
          iconUrl: xivapi.icon ?? undefined
        };
      })
    ).then((itemsWithId) => {
      setItems(itemsWithId);
      setLoading(false);
    }).catch(() => {
      setItems([]);
      setLoading(false);
    });
  };

  useEffect(() => {
    setDatacenter(localStorage.getItem("ryutsu_dc") || "");
  }, [setDatacenter]);

  useEffect(() => {
    const handleStorage = () => {
      setServer(localStorage.getItem("ryutsu_server") || SERVER_LIST[0]);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const currentServer = localStorage.getItem("ryutsu_server") || SERVER_LIST[0];
        const validItems = items.filter(i => i.itemId && typeof i.itemId === "number");
        if (validItems.length === 0) {
          setMarketData({});
          setLoading(false);
          return;
        }
        const batchSize = 100;
        let mergedMarketData: MarketData = {};
        for (let i = 0; i < validItems.length; i += batchSize) {
          const batch = validItems.slice(i, i + batchSize);
          const data = await fetchMarketData(currentServer, batch.map(i => ({ itemId: i.itemId }))) as UniversalisResponse;
          let batchMarketData = data.items || {};
          const unresolved: number[] | undefined = data.unresolved;
          if (unresolved && Array.isArray(unresolved) && unresolved.length > 0) {
            const retryItems = batch.filter(i => unresolved.includes(i.itemId));
            if (retryItems.length > 0) {
              const retryData = await fetchMarketData(currentServer, retryItems.map(i => ({ itemId: i.itemId })));
              batchMarketData = { ...batchMarketData, ...(retryData.items || {}) };
            }
          }
          mergedMarketData = { ...mergedMarketData, ...batchMarketData };
        }

        let historyData: Record<string, { entries?: MarketHistory[] }> = {};
        for (let i = 0; i < validItems.length; i += batchSize) {
          const batch = validItems.slice(i, i + batchSize);
          const batchItemIds = batch.map(item => item.itemId).join(",");
          const historyUrl = `https://universalis.app/api/v2/history/${currentServer}/${batchItemIds}`;
          try {
            const resp = await fetch(historyUrl);
            if (resp.ok) {
              const data = await resp.json();
              if (data.items) {
                historyData = { ...historyData, ...data.items };
              }
            }
          } catch {
            console.error(`Failed to fetch history for items: ${batchItemIds}`);
          }
        }

        Object.entries(historyData).forEach(([itemId, entry]) => {
          if (!mergedMarketData[Number(itemId)]) mergedMarketData[Number(itemId)] = {};
          mergedMarketData[Number(itemId)].recentHistory = Array.isArray(entry.entries) ? entry.entries : [];
        });

        setMarketData(mergedMarketData);
      } catch {
        setMarketData({});
      }
      setLoading(false);
    };
    if ((localStorage.getItem("ryutsu_server") || SERVER_LIST[0]) && items.length > 0) fetchData();
  }, [server, items, setLoading, setMarketData]);

  const displayItems = items.map(item => {
    const market = marketData[item.itemId] || {};
    const minPrice = market.listings && market.listings.length > 0 ? market.listings[0].pricePerUnit : 0;
    let weeklySales = 0;
    let qtyPerWeek = 0;
    if (market.recentHistory && Array.isArray(market.recentHistory)) {
      const now = Date.now() / 1000;
      const recent = market.recentHistory.filter(h => {
        const ts = h.timestamp ?? h.purchaseDate;
        return ts && (now - ts <= 604800); // within 7 days
      });
      weeklySales = recent.length;
      qtyPerWeek = recent.reduce((sum: number, h: MarketHistory) => sum + h.quantity, 0);
    }
    const valuePerScrip = item.cost ? (minPrice / item.cost) : 0;
    return {
      ...item,
      minPrice,
      weeklySales,
      qtyPerWeek,
      valuePerScrip
    };
  });


  const sortedItems = [...displayItems].sort((a, b) => {
    const aVal = a[sortBy as keyof typeof a];
    const bVal = b[sortBy as keyof typeof b];
    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    } else if (typeof aVal === "number" && typeof bVal === "number") {
      return sortDir === "asc" ? aVal - bVal : bVal - aVal;
    }
    return 0;
  });

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortDir("asc");
    }
  };

  const [priceListModal, setPriceListModal] = React.useState<{ open: boolean; itemId?: number; itemName: string; datacenter: string }>({ open: false, itemId: undefined, itemName: "", datacenter: "" });

  const handleShowPriceList = (item: typeof sortedItems[0]) => {
    if (!item.itemId || !datacenter) return;
    setPriceListModal({ open: true, itemId: item.itemId, itemName: item.name, datacenter });
  };

  const handleCalculatorOpen = (item: typeof displayItems[0]) => {
    setCalculatorItem(item);
    setItemCount(1);
    setCalcRevenue(item.minPrice ? item.minPrice : 0);
    setCalcModalOpen(true);
  };

  const handleCalculatorClose = () => {
    setCalculatorItem(null);
    setItemCount(1);
    setCalcRevenue(0);
    setCalcModalOpen(false);
  };

  const handleItemCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(1, Math.floor(Number(e.target.value) || 1));
    setItemCount(val);
    if (calculatorItem && calculatorItem.minPrice && calculatorItem.cost) {
      setCalcRevenue(val * calculatorItem.minPrice);
    } else {
      setCalcRevenue(0);
    }
  };
  
  const scripIcons: Record<string, string> = {
    "Purple Crafter Scrips": "https://xivapi.com/i/065000/065088.png",
    "Orange Crafter Scrips": "https://xivapi.com/i/065000/065110.png",
    "Purple Gatherer Scrips": "https://xivapi.com/i/065000/065087.png",
    "Orange Gatherer Scrips": "https://xivapi.com/i/065000/065109.png"
  };

  return (
    <>
      <TopMenu darkMode={darkMode} onToggleDarkMode={onToggleDarkMode} onOpenSidebar={() => {}} />
      <div className={`root app-root-with-header${darkMode ? ' dark' : ''}`}> 
        <div className={`card${darkMode ? ' dark' : ''}`}> 
          <h2 className={`title${darkMode ? ' dark' : ''}`}>Scrip Exchange</h2>
          <div className="controls" style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 18 }}>
            <div style={{ display: 'flex', gap: 14 }}>
              {SCRIP_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => setScripType(type)}
                  style={{
                    background: scripType === type ? (darkMode ? '#6366f1' : '#6366f1') : (darkMode ? '#23232b' : '#fff'),
                    border: scripType === type ? '2px solid #a5b4fc' : '2px solid #c7d2fe',
                    borderRadius: 12,
                    padding: '8px',
                    boxShadow: scripType === type ? '0 2px 8px #6366f1' : '0 1px 4px #e0e7ff',
                    cursor: 'pointer',
                    outline: 'none',
                    transition: 'background 0.18s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 54,
                    height: 54
                  }}
                  title={type}
                >
                  {scripIcons[type] && (
                    <img
                      src={scripIcons[type]}
                      alt={type}
                      style={{ width: 38, height: 38, borderRadius: 8, boxShadow: '0 1px 4px #e0e7ff', background: darkMode ? '#23232b' : '#fff' }}
                    />
                  )}
                </button>
              ))}
            </div>
            <button
              className={`button${darkMode ? ' dark' : ''}`}
              style={{ padding: "0.7rem 1.2rem", fontSize: "1.08rem", borderRadius: 10, fontWeight: 600, border: "none", background: darkMode ? "#6366f1" : "#6366f1", color: "#fff", boxShadow: "0 2px 8px #e0e7ff", cursor: "pointer" }}
              onClick={handleSearchItems}
              disabled={loading}
            >
              <i className="fas fa-search" style={{ marginRight: 8 }}></i> Search
            </button>
          </div>
          {loading ? (
            <div className={`loading${darkMode ? ' dark' : ''}`}>Loading market data...</div>
          ) : (
            <div className={`tableWrap compact${darkMode ? ' dark' : ''}`}> 
              <table className="compact-table">
                <thead>
                  <tr className={darkMode ? 'dark' : ''}>
                    {SORTABLE_COLUMNS.map(col => (
                      <th
                        key={col.key}
                        className={darkMode ? 'dark' : ''}
                        style={{textAlign: col.key === "name" ? 'left' : 'center', cursor: "pointer", userSelect: "none", padding: "0.6rem 0.3rem", fontSize: "1rem"}}
                        onClick={() => handleSort(col.key)}
                      >
                        {col.label}
                        {sortBy === col.key && (
                          <span style={{ marginLeft: 4, fontSize: "1em", color: darkMode ? "#a5b4fc" : "#6366f1" }}>
                            {sortDir === "asc" ? "▲" : "▼"}
                          </span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedItems.map((item) => (
                    <tr
                      key={item.itemId}
                      className={darkMode ? 'dark' : ''}
                      style={{cursor: 'pointer', fontSize: "0.98rem", height: "38px"}}
                      onClick={() => handleCalculatorOpen(item)}
                      onMouseEnter={e => (e.currentTarget.style.background = darkMode ? '#18181b' : '#e0e7ff')}
                      onMouseLeave={e => (e.currentTarget.style.background = darkMode ? '#23232b' : '#fff')}
                    >
                      <td style={{ display: "flex", alignItems: "center", gap: 8, padding: "0.5rem 0.3rem" }}>
                        {item.iconUrl && <img src={item.iconUrl} alt="icon" style={{ width: 22, height: 22, marginRight: 4, verticalAlign: 'middle', borderRadius: 4, boxShadow: '0 1px 4px #e0e7ff' }} />}
                        <span style={{ fontWeight: 600 }}>{item.name}</span>
                        <button
                          className="btn-universalis"
                          title="Show purchase history"
                          style={{ marginLeft: 8, padding: "6px 12px", fontSize: "0.92rem", background: darkMode ? "#222" : "#6366f1", color: darkMode ? "#fff" : "#fff", borderRadius: 6, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                          onClick={e => { e.stopPropagation(); handleShowPriceList(item); }}
                        >
                          <i className="fas fa-history"></i> Purchase History
                        </button>
                      </td>
                      <td style={{textAlign: 'center', padding: "0.5rem 0.3rem"}}>{item.cost}</td>
                      <td style={{textAlign: 'center', padding: "0.5rem 0.3rem"}}>{item.minPrice}</td>
                      <td style={{textAlign: 'center', padding: "0.5rem 0.3rem"}}>{item.weeklySales}</td>
                      <td style={{textAlign: 'center', padding: "0.5rem 0.3rem"}}>{item.qtyPerWeek}</td>
                      <td style={{textAlign: 'center', color: darkMode ? '#a5b4fc' : '#6366f1', padding: "0.5rem 0.3rem"}}>{item.valuePerScrip ? item.valuePerScrip.toFixed(2) : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <ItemCalcModal
        open={calcModalOpen}
        item={calculatorItem}
        itemCount={itemCount}
        calcRevenue={calcRevenue}
        onItemCountChange={handleItemCountChange}
        onClose={handleCalculatorClose}
        darkMode={darkMode}
      />
      <Footer />
      {priceListModal.open && (
        <PurchaseHistoryModal
          open={priceListModal.open}
          onClose={() => setPriceListModal({ ...priceListModal, open: false })}
          itemId={priceListModal.itemId!}
          itemName={priceListModal.itemName}
          server={server}
        />
      )}
    </>
  );
};

export default ScripExchange;
