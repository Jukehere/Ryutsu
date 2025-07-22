export type ResultItem = {
  item: string;
  quantity: number;
  server: string;
  price: number;
  iconUrl?: string;
  itemId?: number | null;
  qty?: number;
  homeServer?: string;
  homePrice?: number;
};

interface ResultsSectionProps {
  results: ResultItem[];
  onFindPath?: () => void;
  onShowPriceList?: (item: ResultItem & { itemId?: number | null }) => void;
}

export default function ResultsSection({ results, onFindPath, onShowPriceList }: ResultsSectionProps) {
  const handleCopy = (item: string) => {
    navigator.clipboard.writeText(item);
  };

  const isHQ = (row: ResultItem) => {
    return /\(HQ\)\s*$/.test(row.item) || (row as any).hq === true;
  };

  return (
    <section className="results-section">
      <div className="section-header">
        <h2><i className="fas fa-list"></i> Shopping List</h2>
        <div className="results-info" id="results-info">
          {results.length === 0 ? "Enter your items and click Search Prices" : ""}
        </div>
      </div>
      <div className="table-container">
        <table id="results-table">
          <thead>
            <tr>
              <th>Item</th>
              <th className="quantity-cell">Qty</th>
              <th className="server-cell">Server</th>
              <th className="price-cell">Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody id="results-body">
            {results.map((row, idx) => (
              <tr key={idx}>
                <td style={{ display: "flex", alignItems: "center", gap: 8, minHeight: 32 }}>
                  {row.iconUrl && (
                    <img
                      src={row.iconUrl}
                      alt=""
                      className="item-icon"
                      style={{ width: 24, height: 24, marginRight: 2, cursor: "pointer", display: "inline-block", verticalAlign: "middle" }}
                      title="Copy item name"
                      onClick={() => handleCopy(row.item)}
                    />
                  )}
                  <span
                    className="item-name"
                    style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
                    title="Copy item name"
                    onClick={() => handleCopy(row.item)}
                  >
                    {isHQ(row) && (
                      <img
                        src="https://xivapi.com/img-misc/hq.png"
                        alt="HQ"
                        title="High Quality"
                        className="hq-icon"
                        style={{ marginRight: 4, marginLeft: 0, width: 18, height: 18, display: "inline-block", verticalAlign: "middle" }}
                      />
                    )}
                    {row.item}
                    <button
                      className="btn-universalis"
                      title="Show price list"
                      style={{ marginLeft: 8, padding: "6px 12px", fontSize: "0.92rem", background: "#222", color: "#fff", borderRadius: 6, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                      onClick={e => { e.stopPropagation(); if (onShowPriceList) onShowPriceList(row); }}
                    >
                      <i className="fas fa-tags"></i> Price List
                    </button>
                  </span>
                </td>
                <td className="quantity-cell">{row.quantity}</td>
                <td className="server-cell">{row.server}</td>
                <td className="price-cell">{row.price.toLocaleString()}</td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="button-group" id="path-btn-group" style={{ marginTop: 18 }}>
        <button
          id="path-btn"
          className="btn btn-secondary"
          disabled={results.length === 0}
          onClick={onFindPath}
        >
          <i className="fas fa-route"></i> Find Path
        </button>
      </div>
    </section>
  );
}

