export type ParsedItem = { quantity: number; name: string };
export const parseItems = (text: string): ParsedItem[] => {
  const lines = text.split("\n");
  const items: ParsedItem[] = [];
  const itemPattern = /(\d+)\s*[x×]\s*(.+)|-\s*(\d+)\s*(.+)|(\d+)\s+(.+)/i;
  for (const line of lines) {
    if (!line.trim()) continue;
    const match = line.match(itemPattern);
    if (match) {
      if (match[1] && match[2]) items.push({ quantity: parseInt(match[1]), name: match[2].trim() });
      else if (match[3] && match[4]) items.push({ quantity: parseInt(match[3]), name: match[4].trim() });
      else if (match[5] && match[6]) items.push({ quantity: parseInt(match[5]), name: match[6].trim() });
    } else {
      items.push({ quantity: 1, name: line.trim() });
    }
  }
  return items;
};

const XIVAPI_SEARCH = "https://v2.xivapi.com/api/search";
const UNIVERSALIS_API = "https://universalis.app/api/v2";

export type XIVAPIResult = { id: number|null, icon: string|null, canonicalName: string };
export const fetcher = async (itemName: string): Promise<XIVAPIResult> => {
  try {
    const url = `${XIVAPI_SEARCH}?query=Name~"${encodeURIComponent(itemName)}"&sheets=Item&limit=1`;
    console.log("XIVAPI strict search URL:", url);
    let response = await fetch(url);
    if (!response.ok) {
      console.error("XIVAPI fetch failed", response.status, response.statusText);
      return { id: null, icon: null, canonicalName: itemName };
    }
    let data = await response.json();
    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      const id = result.row_id ?? result.ID ?? null;
      let iconPath = null;
      let canonicalName = itemName;
      if (result.fields) {
        if (result.fields.Name) canonicalName = result.fields.Name;
        if (result.fields.Icon) {
          if (result.fields.Icon.path_hr1) {
            iconPath = result.fields.Icon.path_hr1.replace(/^ui\/icon\//i, "").replace(/\.tex$/i, ".png");
          } else if (result.fields.Icon.path) {
            iconPath = result.fields.Icon.path.replace(/^ui\/icon\//i, "").replace(/\.tex$/i, ".png");
          }
        }
      }
      const icon = iconPath ? `https://xivapi.com/i/${iconPath}` : (result.IconHD ? `https://xivapi.com${result.IconHD}` : null);
      return { id, icon, canonicalName };
    }
    response = await fetch(url);
    if (!response.ok) {
      console.error("XIVAPI fallback fetch failed", response.status, response.statusText);
      return { id: null, icon: null, canonicalName: itemName };
    }
    data = await response.json();
    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      const id = result.row_id ?? result.ID ?? null;
      let iconPath = null;
      const canonicalName = (result.fields && result.fields.Name) ? result.fields.Name : (result.Name || itemName);
      if (result.fields && result.fields.Icon) {
        if (result.fields.Icon.path_hr1) {
          iconPath = result.fields.Icon.path_hr1.replace(/^ui\/icon\//i, "").replace(/\.tex$/i, ".png");
        } else if (result.fields.Icon.path) {
          iconPath = result.fields.Icon.path.replace(/^ui\/icon\//i, "").replace(/\.tex$/i, ".png");
        }
      } else if (result.IconHD) {
        iconPath = result.IconHD.startsWith("/") ? result.IconHD.slice(1) : result.IconHD;
      }
      const icon = iconPath ? `https://xivapi.com/i/${iconPath}` : (result.IconHD ? `https://xivapi.com${result.IconHD}` : null);
      return { id, icon, canonicalName };
    }
    return { id: null, icon: null, canonicalName: itemName };
  } catch (err) {
    console.error("XIVAPI error", err);
    return { id: null, icon: null, canonicalName: itemName };
  }
};

export type UniversalisItem = { listings: any[] };
export type UniversalisResponse = { items: { [id: string]: UniversalisItem } };
export const fetchMarketData = async (dataCenter: string, items: { itemId: number }[]): Promise<UniversalisResponse> => {
  const validItems = items.filter(item => item.itemId !== null);
  if (validItems.length === 0) {
    console.error("fetchMarketData: No valid items", items);
    throw new Error("No valid items");
  }
  const itemIds = validItems.map(item => item.itemId);
  const url = `${UNIVERSALIS_API}/${dataCenter}/${itemIds.join(",")}?listings=50`;
  console.log("Universalis API URL:", url);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const text = await response.text();
      if (response.status === 504) {
        console.error("Universalis 504 Gateway Timeout", response.status, response.statusText, text);
        throw new Error("Market data server is busy or unavailable (504 Gateway Timeout). Please try again later.");
      }
      console.error("Universalis fetch failed", response.status, response.statusText, text);
      throw new Error("Failed to fetch market data");
    }
    const data = await response.json();
    console.log("Universalis API response:", data);
    return data;
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    } else {
      throw new Error("Unknown error occurred while fetching market data");
    }
  }
};
