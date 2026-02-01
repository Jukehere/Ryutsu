import React from "react";
import InputSection from "../InputSection";
import ResultsSection from "./ResultsSection";
import { parseItems, fetcher, fetchMarketData } from "../api/api";
import { ToastContext } from "../contexts/ToastContext";
import type { ResultItem } from "./ResultsSection";

interface SearchPricesProps {
  items: string;
  datacenter: string;
  isHQ: boolean;
  setItems: (items: string) => void;
  setIsHQ: (hq: boolean) => void;
  setResults: (results: ResultItem[]) => void;
  results: ResultItem[];
  onFindPath: () => void;
  onShowPriceList: (item: ResultItem) => void;
  onOpenSidebar: () => void;
  onOpenHelp: () => void;
  crossDCMode: boolean;
  setCrossDCMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const REGION_MAP: Record<string, string> = {
  // NA
  "Aether": "America",
  "Primal": "America",
  "Crystal": "America",
  "Dynamis": "America",
  // EU
  "Chaos": "Europe",
  "Light": "Europe",
  // JP
  "Elemental": "Japan",
  "Gaia": "Japan",
  "Mana": "Japan",
  "Meteor": "Japan",
  // OCE
  "Materia": "Oceania",
};

const SearchPrices: React.FC<SearchPricesProps> = ({
  items,
  datacenter,
  isHQ,
  setItems,
  setIsHQ,
  setResults,
  results,
  onFindPath,
  onShowPriceList,
  onOpenSidebar,
  onOpenHelp,
  crossDCMode,
  setCrossDCMode,
}) => {
  const toast = React.useContext(ToastContext);

  const handleSearch = async (searchItems: string, searchIsHQ: boolean) => {
    setItems(searchItems);
    setIsHQ(searchIsHQ);
    toast.showToast("Parsing items and fetching prices...", "info");
    try {
      const parsed = parseItems(searchItems);
      const xivapiResults = await Promise.all(parsed.map(item => fetcher(item.name.replace(/\s*\(HQ\)$|\sHQ$|★$/g, ""))));
      const itemsWithId = parsed.map((item, idx) => ({
        ...item,
        itemId: xivapiResults[idx].id,
        iconUrl: xivapiResults[idx].icon ?? undefined,
        canonicalName: xivapiResults[idx].canonicalName,
        isHQ: searchIsHQ,
      }));
      const validItems = itemsWithId.filter(item => typeof item.itemId === "number");
      if (validItems.length === 0) {
        toast.showToast("No valid items found.", "error");
        setResults([]);
        return;
      }
    let dc = typeof datacenter === "string" ? datacenter : "";
    if (!dc) {
      dc = localStorage.getItem("ryutsu_dc") || "";
    }
    if (!dc) {
      toast.showToast("No data center selected. Please select a data center from the top menu.", "error");
      setResults([]);
      return;
    }
    let endpoint = dc;
    if (crossDCMode && REGION_MAP[dc]) {
      endpoint = REGION_MAP[dc];
      toast.showToast(`Cross-DC mode enabled: Searching Region '${endpoint}'`, "info");
    }
    let marketData = await fetchMarketData(endpoint, validItems.map(({ itemId }) => ({ itemId: itemId as number })));
      if (!('items' in marketData) && validItems.length === 1 && 'listings' in marketData) {
        const key = String(validItems[0].itemId);
        marketData = { items: { [key]: marketData } } as {
          items: { [key: string]: { listings: Array<{ worldName: string; pricePerUnit: number; homeWorldName?: string; hq?: boolean }> } };
        };
      }
      type Listing = {
        worldName: string;
        pricePerUnit: number;
        homeWorldName?: string;
        hq?: boolean;
      };
      const newResults: ResultItem[] = validItems.map(item => {
        const market = marketData.items[item.itemId as number];
        const listings: Listing[] = market && market.listings ? market.listings : [];
        let filteredListings = listings.filter(l => l.hq === item.isHQ);
        let fallbackToNQ = false;
        let fallbackToHQ = false;
        if (item.isHQ && filteredListings.length === 0) {
          filteredListings = listings.filter(l => !l.hq);
          if (filteredListings.length > 0) fallbackToNQ = true;
        }
        if (!item.isHQ && filteredListings.length === 0) {
          filteredListings = listings.filter(l => l.hq);
          if (filteredListings.length > 0) fallbackToHQ = true;
        }
        let bestListing: Listing | null = null;
        let homeListing: Listing | null = null;
        if (filteredListings.length > 0) {
          bestListing = filteredListings.reduce((min, l) => l.pricePerUnit < min.pricePerUnit ? l : min, filteredListings[0]);
          homeListing = filteredListings.find((l) => l.homeWorldName && l.homeWorldName === bestListing!.worldName) || null;
        }
        return {
          item: item.canonicalName,
          quantity: item.quantity,
          server: bestListing ? bestListing.worldName : "-",
          price: bestListing ? bestListing.pricePerUnit : 0,
          iconUrl: item.iconUrl,
          itemId: item.itemId ?? null,
          qty: item.quantity,
          homeServer: bestListing ? bestListing.worldName : undefined,
          homePrice: homeListing ? homeListing.pricePerUnit : (bestListing ? bestListing.pricePerUnit : 0),
          isHQ: bestListing ? !!bestListing.hq : item.isHQ,
          hq: bestListing ? !!bestListing.hq : item.isHQ,
          fallbackToNQ,
          fallbackToHQ,
        };
      });
      setResults(newResults);
    } catch (err) {
      console.error("Error fetching prices:", err);
      if (
        (err instanceof Error && err.message && err.message.includes('No \'Access-Control-Allow-Origin\' header')) ||
        (err instanceof SyntaxError && err.message && err.message.includes('Unexpected token')) ||
        (err instanceof TypeError && err.message && err.message.includes('Failed to fetch'))
      ) {
        toast.showToast("Market data could not be loaded due to a CORS error, network error, or invalid response. This is a server-side restriction, proxy misconfiguration, or network issue. Please use a proxy or try again later.", "error");
      } else {
        toast.showToast("Error fetching prices. Please try again.", "error");
      }
      setResults([]);
    }
  };

  return (
    <>
      <InputSection
        onSearch={handleSearch}
        items={items}
        isHQ={isHQ}
        setItems={setItems}
        setIsHQ={setIsHQ}
        onOpenSidebar={onOpenSidebar}
        onOpenHelp={onOpenHelp}
        crossDCMode={crossDCMode}
        setCrossDCMode={setCrossDCMode}
      />
      <ResultsSection
        results={results}
        onFindPath={onFindPath}
        onShowPriceList={onShowPriceList}
      />
    </>
  );
};
export default SearchPrices;
