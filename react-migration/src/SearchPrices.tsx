import React from "react";
import InputSection from "./InputSection";
import ResultsSection from "./ResultsSection";
import { parseItems, fetchItemIdAndIconFromXIVAPI, fetchMarketData } from "./api";
import { ToastContext } from "./ToastContext";
import type { ResultItem } from "./ResultsSection";

interface SearchPricesProps {
  items: string;
  datacenter: string;
  isHQ: boolean;
  setItems: (items: string) => void;
  setDatacenter: (dc: string) => void;
  setIsHQ: (hq: boolean) => void;
  setResults: (results: ResultItem[]) => void;
  results: ResultItem[];
  onFindPath: () => void;
  onShowPriceList: (item: ResultItem) => void;
  onOpenSidebar: () => void;
  onOpenHelp: () => void;
}

const SearchPrices: React.FC<SearchPricesProps> = ({
  items,
  datacenter,
  isHQ,
  setItems,
  setDatacenter,
  setIsHQ,
  setResults,
  results,
  onFindPath,
  onShowPriceList,
  onOpenSidebar,
  onOpenHelp,
}) => {
  const toast = React.useContext(ToastContext);

  const handleSearch = async (searchItems: string, searchDatacenter: string, searchIsHQ: boolean) => {
    setItems(searchItems);
    setDatacenter(searchDatacenter);
    setIsHQ(searchIsHQ);
    toast.showToast("Parsing items and fetching prices...", "info");
    try {
      const parsed = parseItems(searchItems);
      const xivapiResults = await Promise.all(parsed.map(item => fetchItemIdAndIconFromXIVAPI(item.name)));
      const itemsWithId = parsed.map((item, idx) => ({
        ...item,
        itemId: xivapiResults[idx].id,
        iconUrl: xivapiResults[idx].icon ?? undefined,
        canonicalName: xivapiResults[idx].canonicalName,
      }));
      const validItems = itemsWithId.filter(item => typeof item.itemId === "number");
      if (validItems.length === 0) {
        toast.showToast("No valid items found.", "error");
        setResults([]);
        return;
      }
      let marketData = await fetchMarketData(searchDatacenter, validItems.map(({ itemId }) => ({ itemId: itemId as number })));
      // Handle Universalis single-item response (no 'items' key)
      if (!('items' in marketData) && validItems.length === 1 && 'listings' in marketData) {
        const key = String(validItems[0].itemId);
        marketData = { items: { [key]: marketData } } as any;
      }
      type Listing = {
        worldName: string;
        pricePerUnit: number;
        homeWorldName?: string;
      };
      const newResults: ResultItem[] = validItems.map(item => {
        const market = marketData.items[item.itemId as number];
        const listings: Listing[] = market && market.listings ? market.listings : [];
        let bestListing: Listing | null = null;
        let homeListing: Listing | null = null;
        if (listings.length > 0) {
          bestListing = listings[0];
          // Try to find a listing from the home server (if possible)
          // Universalis does not provide home server directly, so fallback to bestListing.worldName
          homeListing = listings.find((l) => l.homeWorldName && l.homeWorldName === bestListing!.worldName) || null;
        }
        return {
          item: item.canonicalName,
          quantity: item.quantity,
          server: bestListing ? bestListing.worldName : "-",
          price: bestListing ? bestListing.pricePerUnit : 0,
          iconUrl: item.iconUrl,
          itemId: item.itemId ?? null,
          // For Find Path logic:
          qty: item.quantity,
          homeServer: bestListing ? bestListing.worldName : undefined,
          homePrice: homeListing ? homeListing.pricePerUnit : (bestListing ? bestListing.pricePerUnit : 0),
        };
      });
      setResults(newResults);
    } catch (err) {
      console.error("Error fetching prices:", err);
      toast.showToast("Error fetching prices. Please try again.", "error");
      setResults([]);
    }
  };

  return (
    <>
      <InputSection
        onSearch={handleSearch}
        items={items}
        datacenter={datacenter}
        isHQ={isHQ}
        setItems={setItems}
        setDatacenter={setDatacenter}
        setIsHQ={setIsHQ}
        onOpenSidebar={onOpenSidebar}
        onOpenHelp={onOpenHelp}
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
