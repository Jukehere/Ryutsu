
function showToast(message, type = "info", duration = 3500) {
  const toastContainer = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.style.cssText = `
    min-width: 220px;
    max-width: 90vw;
    background: ${
      type === "error"
        ? "#fef2f2"
        : type === "success"
        ? "#ecfdf5"
        : "#f3f4f6"
    };
    color: ${
      type === "error"
        ? "#b91c1c"
        : type === "success"
        ? "#065f46"
        : "#222"
    };
    border: 1px solid ${
      type === "error"
        ? "#fecaca"
        : type === "success"
        ? "#a7f3d0"
        : "#d1d5db"
    };
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.10);
    padding: 14px 22px;
    font-size: 1rem;
    display: flex;
    align-items: center;
    gap: 10px;
    opacity: 0;
    pointer-events: auto;
    transition: opacity 0.25s, transform 0.25s;
    margin-bottom: 0;
  `;
  let icon = "";
  if (type === "error")
    icon = '<i class="fas fa-exclamation-triangle"></i>';
  else if (type === "success")
    icon = '<i class="fas fa-check-circle"></i>';
  else icon = '<i class="fas fa-info-circle"></i>';
  toast.innerHTML = `${icon}<span>${message}</span>`;
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = 1;
    toast.style.transform = "translateY(0)";
  }, 10);
  setTimeout(() => {
    toast.style.opacity = 0;
    toast.style.transform = "translateY(20px)";
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 250);
  }, duration);
}

function animateModalIn(modal) {
  setTimeout(() => {
    modal.classList.add("show");
  }, 10);
}
function animateModalOut(modal, cb) {
  modal.classList.remove("show");
  setTimeout(() => {
    if (modal.parentNode) modal.parentNode.removeChild(modal);
    if (cb) cb();
  }, 280);
}
function showHelpModal() {
  if (document.getElementById("help-modal-backdrop")) return;
  const modal = document.createElement("div");
  modal.className = "modal-backdrop";
  modal.id = "help-modal-backdrop";
  modal.innerHTML = `
    <div class="modal-box" style="max-width:540px;">
      <button class="close-btn" id="close-help-modal" title="Close">&times;</button>
      <h3><i class="fas fa-info-circle"></i> Ryutsu Help</h3>
      <div class="help-section">
        <div class="help-topic" tabindex="0">
          <div class="help-topic-header"><i class="fas fa-chevron-right"></i> How to Use</div>
          <div class="help-topic-content">
            <ol style="margin-left:1.2em;">
              <li>Paste your shopping list in the <b>Paste your items list</b> box.</li>
              <li>Select your <b>Data Center</b> and <b>Item Quality</b> (NQ/HQ).</li>
              <li>Click <b>Search Prices</b> to fetch real-time market prices.</li>
              <li>Review the <b>Shopping List</b> table for best prices per item.</li>
              <li>Click <b>Find Path</b> to get an optimal route for shopping across servers.</li>
            </ol>
          </div>
        </div>
        <div class="help-topic" tabindex="0">
          <div class="help-topic-header"><i class="fas fa-chevron-right"></i> Item List Format</div>
          <div class="help-topic-content">
            <p>You can paste items in any of these formats:</p>
            <pre>
4x Claro Walnut Lumber
1x Titanium Gold Nugget
5x Ra'Kaznar Ingot

- 10 Hoptrap Leaf
- 15 Clary Sage

8 × Effervescent Water
            </pre>
            <p>The app will automatically detect quantities and item names.</p>
          </div>
        </div>
        <div class="help-topic" tabindex="0">
          <div class="help-topic-header"><i class="fas fa-chevron-right"></i> Lists & Saving</div>
          <div class="help-topic-content">
            <ul style="margin-left:1.2em;">
              <li>Click <b>Lists</b> to open the sidebar.</li>
              <li>Save your current list with a name for later use.</li>
              <li>Load or delete saved lists from the sidebar.</li>
              <li>Lists are stored locally in your browser.</li>
            </ul>
          </div>
        </div>
        <div class="help-topic" tabindex="0">
          <div class="help-topic-header"><i class="fas fa-chevron-right"></i> Price & Path Details</div>
          <div class="help-topic-content">
            <ul style="margin-left:1.2em;">
              <li>Click <b>Price List</b> on any item to see detailed server prices.</li>
              <li>After <b>Find Path</b>, click an item icon to copy its name.</li>
              <li>Estimated savings are shown if home server prices are available.</li>
            </ul>
          </div>
        </div>
        <div class="help-topic" tabindex="0">
          <div class="help-topic-header"><i class="fas fa-chevron-right"></i> Data Sources</div>
          <div class="help-topic-content">
            <ul style="margin-left:1.2em;">
              <li>Market prices from <a href="https://universalis.app/" target="_blank">Universalis.app</a></li>
              <li>Item data from <a href="https://xivapi.com/" target="_blank">XIVAPI</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  animateModalIn(modal);
  document.getElementById("close-help-modal").onclick = () => {
    animateModalOut(modal);
  };
  modal.onclick = (e) => {
    if (e.target === modal) animateModalOut(modal);
  };

  setTimeout(() => {
    const topics = Array.from(document.querySelectorAll(".help-topic"));
    topics.forEach((topic, idx) => {
      const header = topic.querySelector(".help-topic-header");
      const content = topic.querySelector(".help-topic-content");
      header.onclick = function () {
        topics.forEach((other, i) => {
          const otherHeader = other.querySelector(".help-topic-header");
          const otherContent = other.querySelector(".help-topic-content");
          if (other === topic) {
            const expanded = topic.classList.toggle("expanded");
            if (expanded) {
              otherContent.style.maxHeight =
                otherContent.scrollHeight + "px";
              otherHeader
                .querySelector("i")
                .classList.replace("fa-chevron-right", "fa-chevron-down");
            } else {
              otherContent.style.maxHeight = null;
              otherHeader
                .querySelector("i")
                .classList.replace("fa-chevron-down", "fa-chevron-right");
            }
          } else {
            other.classList.remove("expanded");
            otherContent.style.maxHeight = null;
            otherHeader
              .querySelector("i")
              .classList.replace("fa-chevron-down", "fa-chevron-right");
          }
        });
      };
      topic.onkeydown = function (e) {
        if (e.key === "Enter" || e.key === " ") {
          header.click();
          e.preventDefault();
        }
      };
      content.style.maxHeight = null;
    });
  }, 0);
}

const itemsInput = document.getElementById("items-input");
const datacenterSelect = document.getElementById("datacenter");
const searchBtn = document.getElementById("search-btn");
const pathBtn = document.getElementById("path-btn");
const resultsInfo = document.getElementById("results-info");
const resultsBody = document.getElementById("results-body");
const pathSection = document.getElementById("path-section");
const pathSteps = document.getElementById("path-steps");
const totalCost = document.getElementById("total-cost");
const totalSavings = document.getElementById("total-savings");
const errorSection = document.getElementById("error-section");
const successSection = document.getElementById("success-section");
let shoppingList = [];
let originalHomeServerPrices = {};
let itemIdCache = {};
let itemIconCache = {};
let canonicalNameCache = {};
const XIVAPI_SEARCH = "https://v2.xivapi.com/api/search";
const UNIVERSALIS_API = "https://universalis.app/api/v2";

function parseItems(text) {
  const lines = text.split("\n");
  const items = [];
  const itemPattern =
    /(\d+)\s*[x×]\s*(.+)|-\s*(\d+)\s*(.+)|(\d+)\s+(.+)/i;
  for (const line of lines) {
    if (!line.trim()) continue;
    const match = line.match(itemPattern);
    if (match) {
      let quantity, name;
      if (match[1] && match[2]) {
        quantity = parseInt(match[1]);
        name = match[2].trim();
      } else if (match[3] && match[4]) {
        quantity = parseInt(match[3]);
        name = match[4].trim();
      } else if (match[5] && match[6]) {
        quantity = parseInt(match[5]);
        name = match[6].trim();
      } else {
        continue;
      }
      items.push({
        name: name,
        quantity: quantity,
      });
    }
  }
  return items;
}

async function fetchItemIdAndIconFromXIVAPI(itemName) {
  try {
    const cacheKey = itemName.toLowerCase();
    if (
      itemIdCache[cacheKey] &&
      itemIconCache[cacheKey] &&
      canonicalNameCache[cacheKey]
    ) {
      return {
        id: itemIdCache[cacheKey],
        icon: itemIconCache[cacheKey],
        canonicalName: canonicalNameCache[cacheKey],
      };
    }
    const url = `${XIVAPI_SEARCH}?query=Name~"${encodeURIComponent(
      itemName
    )}"&sheets=Item&limit=1`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`XIVAPI error: ${response.status}`);
    }
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const itemId = data.results[0].row_id;
      let iconPath = null;
      let canonicalName =
        data.results[0].fields && data.results[0].fields.Name
          ? data.results[0].fields.Name
          : itemName;
      if (data.results[0].fields && data.results[0].fields.Icon) {
        if (data.results[0].fields.Icon.path_hr1) {
          iconPath = data.results[0].fields.Icon.path_hr1
            .replace(/^ui\/icon\//i, "")
            .replace(/\.tex$/i, ".png");
        } else if (data.results[0].fields.Icon.path) {
          iconPath = data.results[0].fields.Icon.path
            .replace(/^ui\/icon\//i, "")
            .replace(/\.tex$/i, ".png");
        }
      }
      const iconUrl = iconPath
        ? `https://xivapi.com/i/${iconPath}`
        : null;
      itemIdCache[cacheKey] = itemId;
      itemIconCache[cacheKey] = iconUrl;
      canonicalNameCache[cacheKey] = canonicalName;
      return { id: itemId, icon: iconUrl, canonicalName };
    }
    return { id: null, icon: null, canonicalName: itemName };
  } catch (error) {
    console.error("XIVAPI fetch error:", error);
    return { id: null, icon: null, canonicalName: itemName };
  }
}

async function fetchMarketData(dataCenter, items) {
  try {
    const validItems = items.filter(
      (item) => item.itemId !== null && !item.error
    );
    if (validItems.length === 0) {
      throw new Error("No items with valid IDs found");
    }
    const itemIds = validItems.map((item) => item.itemId);
    const url = `${UNIVERSALIS_API}/${dataCenter}/${itemIds.join(",")}?listings=50`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Universalis API error: ${response.status}`);
    }
    const data = await response.json();
    if (!Array.isArray(itemIds) || itemIds.length === 1) {
      if (!data.items) {
        return { items: { [itemIds[0]]: data } };
      }
    }
    return data;
  } catch (error) {
    console.error("Market data error:", error);
    throw new Error(
      "Failed to fetch market data. Please try again later."
    );
  }
}

let isHQ = false;
const nqBtn = document.getElementById("nq-btn");
const hqBtn = document.getElementById("hq-btn");

function updateQualityButtons() {
  if (isHQ) {
    hqBtn.classList.add("active");
    nqBtn.classList.remove("active");
  } else {
    nqBtn.classList.add("active");
    hqBtn.classList.remove("active");
  }
}

nqBtn.addEventListener("click", () => {
  isHQ = false;
  updateQualityButtons();
});

hqBtn.addEventListener("click", () => {
  isHQ = true;
  updateQualityButtons();
});

updateQualityButtons();

function findBestServers(marketData, items, homeServer) {
  return items.map((item) => {
    if (item.error || !item.itemId) {
      return {
        ...item,
        server: "N/A",
        price: 0,
        homePrice: 0,
        error: item.error || "Invalid item ID",
      };
    }
    const itemId = item.itemId;
    if (!marketData.items || !marketData.items[itemId]) {
      return {
        ...item,
        server: "N/A",
        price: 0,
        homePrice: 0,
        hq: false,
        error: "No market data available",
      };
    }
    const itemData = marketData.items[itemId];
    if (
      !itemData ||
      !itemData.listings ||
      itemData.listings.length === 0
    ) {
      return {
        ...item,
        server: "N/A",
        price: 0,
        homePrice: 0,
        hq: false,
        error: "No market data available",
      };
    }
    const filteredListings = itemData.listings.filter(
      (l) => !!l.hq === isHQ
    );
    if (isHQ && filteredListings.length === 0) {
      const nqListings = itemData.listings.filter((l) => !l.hq);
      if (nqListings.length > 0) {
        let bestNQ = nqListings[0];
        for (const listing of nqListings) {
          if (listing.pricePerUnit < bestNQ.pricePerUnit) {
            bestNQ = listing;
          }
        }
        return {
          ...item,
          server: bestNQ.worldName,
          price: bestNQ.pricePerUnit,
          homePrice: 0,
          hq: false,
          error: undefined,
          fallbackToNQ: true,
        };
      } else {
        return {
          ...item,
          server: "N/A",
          price: 0,
          homePrice: 0,
          hq: false,
          error: "No HQ or NQ listings available",
        };
      }
    }
    if (!isHQ && filteredListings.length === 0) {
      const hqListings = itemData.listings.filter((l) => !!l.hq);
      if (hqListings.length > 0) {
        let bestHQ = hqListings[0];
        for (const listing of hqListings) {
          if (listing.pricePerUnit < bestHQ.pricePerUnit) {
            bestHQ = listing;
          }
        }
        return {
          ...item,
          server: bestHQ.worldName,
          price: bestHQ.pricePerUnit,
          homePrice: 0,
          hq: true,
          error: undefined,
          fallbackToHQ: true,
        };
      } else {
        return {
          ...item,
          server: "N/A",
          price: 0,
          homePrice: 0,
          hq: false,
          error: "No NQ or HQ listings available",
        };
      }
    }
    let bestListing = filteredListings[0];
    for (const listing of filteredListings) {
      if (listing.pricePerUnit < bestListing.pricePerUnit) {
        bestListing = listing;
      }
    }
    originalHomeServerPrices[itemId] = 0;
    return {
      ...item,
      server: bestListing.worldName,
      price: bestListing.pricePerUnit,
      homePrice: 0,
      hq: !!bestListing.hq,
      error: undefined,
      fallbackToNQ: false,
    };
  });
}

function generateItemRows(items) {
  resultsBody.innerHTML = "";
  items.forEach((item) => {
    const row = document.createElement("tr");
    if (item.error) {
      row.innerHTML = `
      <td colspan="4">
        <div class="item-name">
          <div class="item-icon" style="background: rgba(231, 76, 60, 0.3);">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <div>
            <div>
              ${
                item.hq
                  ? `<img src="https://xivapi.com/img-misc/hq.png" alt="HQ" title="HQ" style="width:16px;height:16px;vertical-align:middle;margin-right:6px;"/>`
                  : ""
              }
              ${item.name}
            </div>
            <div style="color: #e74c3c; font-size: 0.85rem; margin-top: 5px;">
              <i class="fas fa-exclamation-circle"></i> ${item.error}
            </div>
          </div>
        </div>
      </td>
    `;
      resultsBody.appendChild(row);
      return;
    }
    const hqIcon = item.hq
      ? `<img src="https://xivapi.com/img-misc/hq.png" alt="HQ" title="HQ" style="width:16px;height:16px;vertical-align:middle;margin-right:6px;"/>`
      : "";
    const itemIcon = item.icon
      ? `<img src="${item.icon}" alt="" style="width:32px;height:32px;border-radius:6px;object-fit:cover;background:#fff;"/>`
      : `<i class="fas fa-cube"></i>`;
    row.innerHTML = `
    <td>
      <div class="item-name">
        <div class="item-icon">
          ${itemIcon}
        </div>
        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            ${hqIcon}${item.name}
            <button class="btn btn-universalis" data-itemid="${
              item.itemId
            }" data-itemname="${encodeURIComponent(
      item.name
    )}" style="margin-left:8px;padding:6px 12px;font-size:0.92rem;background:#222;color:#fff;border-radius:6px;border:none;cursor:pointer;transition:background 0.2s;display:flex;align-items:center;gap:6px;">
              <i class='fas fa-tags'></i> Price List
            </button>
          </div>
        </div>
      </div>
    </td>
    <td class="quantity-cell">${item.quantity}</td>
    <td class="server-cell">${item.server}</td>
    <td class="price-cell">${item.price.toLocaleString()} Gil</td>
  `;
    resultsBody.appendChild(row);
  });
  setTimeout(() => {
    document.querySelectorAll(".btn-universalis").forEach((btn) => {
      btn.onclick = async function (e) {
        const itemId = this.getAttribute("data-itemid");
        const itemName = decodeURIComponent(
          this.getAttribute("data-itemname")
        );
        const dc = datacenterSelect.value;
        const url = `https://universalis.app/api/v2/${dc}/${itemId}?listings=20`;
        let modal = document.createElement("div");
        modal.className = "modal-backdrop";
        modal.id = "universalis-modal-backdrop";
        modal.innerHTML = `<div class='modal-box' style='max-width:480px;width:95vw;'>
          <button class='close-btn' id='close-universalis-modal'>&times;</button>
          <h3 style='margin-bottom:12px;'><i class='fas fa-tags'></i> ${itemName} Price List</h3>
          <div id='universalis-modal-content' style='min-height:80px;display:flex;align-items:center;justify-content:center;'><i class='fas fa-spinner fa-spin'></i> Loading...</div>
          <button id='open-universalis-btn' style='margin-top:18px;width:100%;padding:12px 0;background:#6366f1;color:#fff;border:none;border-radius:7px;font-weight:600;font-size:1rem;cursor:pointer;transition:background 0.2s;'><i class='fas fa-external-link-alt'></i> Open In Universalis</button>
        </div>`;
        document.body.appendChild(modal);
        animateModalIn(modal);
        document.getElementById("close-universalis-modal").onclick = () =>
          animateModalOut(modal);
        modal.onclick = (e) => {
          if (e.target === modal) animateModalOut(modal);
        };
        document.getElementById("open-universalis-btn").onclick = () => {
          window.open(
            `https://universalis.app/market/${itemId}`,
            "_blank"
          );
        };
        try {
          const resp = await fetch(url);
          if (!resp.ok) throw new Error("Failed to fetch price list");
          const data = await resp.json();
          let listings = data.listings || [];
          if (!Array.isArray(listings) || listings.length === 0) {
            document.getElementById(
              "universalis-modal-content"
            ).innerHTML = `<div style='color:#e74c3c;text-align:center;'>No price data found.</div>`;
            return;
          }
          let html = `<div style='max-height:320px;overflow-y:auto;width:100%;'><table style='width:100%;font-size:0.97rem;border-collapse:collapse;'><thead><tr><th style='text-align:left;padding:7px 6px;color:#6366f1;'>Server</th><th style='text-align:right;padding:7px 6px;color:#6366f1;'>Price</th><th style='text-align:center;padding:7px 6px;color:#6366f1;'>Qty</th><th style='text-align:center;padding:7px 6px;color:#6366f1;'>HQ</th></tr></thead><tbody>`;
          listings.forEach((l) => {
            html += `<tr><td style='padding:7px 6px;'>${
              l.worldName
            }</td><td style='padding:7px 6px;text-align:right;'>${l.pricePerUnit.toLocaleString()} Gil</td><td style='padding:7px 6px;text-align:center;'>${
              l.quantity
            }</td><td style='padding:7px 6px;text-align:center;'>${
              l.hq
                ? "<span style='color:#6366f1;font-weight:600;'>HQ</span>"
                : "NQ"
            }</td></tr>`;
          });
          html += `</tbody></table></div>`;
          document.getElementById("universalis-modal-content").innerHTML =
            html;
        } catch (err) {
          document.getElementById(
            "universalis-modal-content"
          ).innerHTML = `<div style='color:#e74c3c;text-align:center;'>Failed to load price data.</div>`;
        }
      };
    });
  }, 0);
}

function generateOptimalPath(items) {
  pathSteps.innerHTML = "";
  // --- Build itemsByServer and cost ---
  const itemsByServer = {};
  let totalCostValue = 0;
  let homeServerCost = 0;
  items.forEach((item) => {
    if (item.server === "N/A" || item.error) return;
    if (!itemsByServer[item.server]) {
      itemsByServer[item.server] = [];
    }
    itemsByServer[item.server].push(item);
    totalCostValue += item.price * item.quantity;
    if (originalHomeServerPrices[item.itemId]) {
      homeServerCost += originalHomeServerPrices[item.itemId] * item.quantity;
    }
  });
  // --- Completion state ---
  let completedSteps = {};
  try {
    completedSteps = JSON.parse(sessionStorage.getItem('ryutsu-path-completed') || '{}');
  } catch (e) { completedSteps = {}; }

  // --- Only show uncompleted servers in the map ---
  const allServers = Object.keys(itemsByServer);
  const visibleServers = allServers.filter(server => !completedSteps[`step-${server}`]);

  // --- Render path steps (all, with completed state) ---
  let stepCount = 1;
  allServers.forEach((server) => {
    const stepId = `step-${server}`;
    const isCompleted = !!completedSteps[stepId];
    const step = document.createElement("div");
    step.className = "path-step" + (isCompleted ? " completed" : "");
    step.setAttribute('data-step-id', stepId);
    const serverItems = itemsByServer[server];
    const serverCost = serverItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const iconsHtml = serverItems.map((item, idx) => {
      const iconUrl = item.icon
        ? `<img src="${item.icon}" alt="" style="width:32px;height:32px;border-radius:6px;object-fit:cover;background:#fff;"/>`
        : `<i class=\"fas fa-cube\"></i>`;
      return `
        <div class="route-item-icon" data-item-name="${item.name.replace(/"/g, "&quot;")}" data-idx="${stepCount}_${idx}" tabindex="0">
          ${iconUrl}
          <span class="route-tooltip">${item.quantity}x ${item.name}</span>
        </div>
      `;
    }).join("");
    step.innerHTML = `
      <input type="checkbox" class="path-step-checkbox" id="${stepId}" ${isCompleted ? 'checked' : ''} style="margin-right:12px;transform:scale(1.3);cursor:pointer;" title="Mark as completed">
      <div class="step-number">${stepCount}</div>
      <div class="step-content">
        <div>Travel to <span class="step-server">${server}</span></div>
        <div class="route-items-row">${iconsHtml}</div>
      </div>
      <div class="step-price">${serverCost.toLocaleString()} Gil</div>
    `;
    pathSteps.appendChild(step);
    stepCount++;
  });

  let oldMap = document.getElementById('ryutsu-path-map');
  if (oldMap && oldMap.parentNode) oldMap.parentNode.removeChild(oldMap);
  if (visibleServers.length > 0) {
    const mapDiv = document.createElement('div');
    mapDiv.id = 'ryutsu-path-map';
    mapDiv.className = '';
    mapDiv.style = 'width:100%;margin:32px auto 0 auto;display:flex;justify-content:center;align-items:center;min-height:110px;max-width:100vw;overflow-x:auto;';
    const svgNS = 'http://www.w3.org/2000/svg';
    const nodeSpacing = Math.max(140, Math.min(200, Math.floor(window.innerWidth / Math.max(3, visibleServers.length + 1))));
    const width = Math.max(340, nodeSpacing * visibleServers.length);
    const height = 120;
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.classList.add('ryutsu-map-svg');
    const defs = document.createElementNS(svgNS, 'defs');
    defs.innerHTML = `
      <filter id="map-shadow-box" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#6366f1" flood-opacity="0.10"/>
      </filter>
      <filter id="map-shadow-green-box" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#10b981" flood-opacity="0.10"/>
      </filter>
    `;
    svg.appendChild(defs);
    const totalMapWidth = nodeSpacing * (visibleServers.length - 1) + 120;
    const offsetX = (width - totalMapWidth) / 2 + 60;
    for (let i = 0; i < visibleServers.length - 1; ++i) {
      const x1 = offsetX + i * nodeSpacing;
      const x2 = offsetX + (i + 1) * nodeSpacing;
      const y = height / 2;
      const line = document.createElementNS(svgNS, 'line');
      line.setAttribute('x1', x1);
      line.setAttribute('y1', y);
      line.setAttribute('x2', x2);
      line.setAttribute('y2', y);
      line.setAttribute('class', 'ryutsu-map-line');
      svg.appendChild(line);
    }
    for (let i = 0; i < visibleServers.length; ++i) {
      const server = visibleServers[i];
      const x = offsetX + i * nodeSpacing;
      const y = height / 2;
      const rect = document.createElementNS(svgNS, 'rect');
      rect.setAttribute('x', x - 40);
      rect.setAttribute('y', y - 28);
      rect.setAttribute('width', 80);
      rect.setAttribute('height', 56);
      rect.setAttribute('rx', 16);
      rect.setAttribute('class', 'ryutsu-map-node');
      rect.setAttribute('data-server', server);
      rect.style.transition = 'all 0.3s cubic-bezier(.4,0,.2,1)';
      svg.appendChild(rect);
      const label = document.createElementNS(svgNS, 'text');
      label.setAttribute('x', x);
      label.setAttribute('y', y + 4);
      label.setAttribute('class', 'ryutsu-map-label');
      label.textContent = server;
      svg.appendChild(label);
    }
    mapDiv.appendChild(svg);
    pathSection.appendChild(mapDiv);
    setTimeout(() => {
      mapDiv.querySelectorAll('.ryutsu-map-node').forEach((rect) => {
        rect.addEventListener('click', function () {
          const server = this.getAttribute('data-server');
          const stepId = `step-${server}`;
          completedSteps[stepId] = true;
          sessionStorage.setItem('ryutsu-path-completed', JSON.stringify(completedSteps));
          generateOptimalPath(items);
        });
      });
    }, 0);
  }

  setTimeout(() => {
    const checkboxes = pathSteps.querySelectorAll('.path-step-checkbox');
    checkboxes.forEach(cb => {
      cb.addEventListener('change', function() {
        const stepId = this.id;
        const parent = this.closest('.path-step');
        if (this.checked) {
          parent.classList.add('completed');
          completedSteps[stepId] = true;
        } else {
          parent.classList.remove('completed');
          delete completedSteps[stepId];
        }
        sessionStorage.setItem('ryutsu-path-completed', JSON.stringify(completedSteps));
        generateOptimalPath(items);
      });
    });
  }, 0);
  setTimeout(() => {
    document.querySelectorAll(".route-item-icon").forEach((icon) => {
      icon.addEventListener("click", async function (e) {
        const name = this.getAttribute("data-item-name");
        try {
          await navigator.clipboard.writeText(name);
          const tooltip = this.querySelector(".route-tooltip");
          const original = tooltip.textContent;
          tooltip.innerHTML = "Copied to Clipboard";
          tooltip.classList.add("copied");
          setTimeout(() => {
            tooltip.textContent = original;
            tooltip.classList.remove("copied");
          }, 1200);
        } catch (err) {}
      });
    });
  }, 0);
  if (!document.getElementById('ryutsu-path-completed-style')) {
    const style = document.createElement('style');
    style.id = 'ryutsu-path-completed-style';
    style.innerHTML = `
      .path-step.completed {
        opacity: 0.55;
        text-decoration: line-through;
        background: #e0e7ef !important;
      }
      body.dark-mode .path-step.completed {
        background: #18181b !important;
        color: #888;
      }
      .path-step-checkbox {
        vertical-align: middle;
      }
    `;
    document.head.appendChild(style);
  }
  const savings = homeServerCost - totalCostValue;
  const savingsText =
    savings > 0
      ? `Estimated Savings: ${savings.toLocaleString()} Gil`
      : "No savings estimated (home server prices unavailable)";
  totalCost.textContent = `Total Estimated Cost: ${totalCostValue.toLocaleString()} Gil`;
  totalSavings.textContent = savingsText;
  totalSavings.style.display = savings > 0 ? "flex" : "none";
  pathSection.style.display = "block";
  var pathBtnGroup = document.getElementById("path-btn-group");
  if (pathBtnGroup) pathBtnGroup.style.display = "none";
}

function showError(message) {
  showToast(message, "error");
}

function showSuccess(message) {
  showToast(message, "success");
}

function hideMessages() {}

const modeToggleBtn = document.getElementById("mode-toggle");

function setMode(mode) {
  document.body.classList.remove("dark-mode", "light-mode");
  document.body.classList.add(mode + "-mode");
  localStorage.setItem("ryutsu-mode", mode);

  if (mode === "dark") {
    modeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
  } else {
    modeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
  }
}

let savedMode = localStorage.getItem("ryutsu-mode");
if (!savedMode) savedMode = "light";
setMode(savedMode);

modeToggleBtn.addEventListener("click", () => {
  const current = document.body.classList.contains("dark-mode")
    ? "dark"
    : "light";
  const newMode = current === "dark" ? "light" : "dark";
  setMode(newMode);
});

searchBtn.addEventListener("click", async function () {
  var pathBtnGroup = document.getElementById("path-btn-group");
  if (pathBtnGroup) pathBtnGroup.style.display = "flex";
  const itemsText = itemsInput.value;
  const dc = datacenterSelect.value;
  if (!itemsText) {
    showError("Please enter your items list");
    return;
  }
  if (!dc) {
    showError("Please select a data center");
    return;
  }
  searchBtn.disabled = true;
  searchBtn.innerHTML =
    '<i class="fas fa-spinner fa-spin"></i> Searching...';
  pathBtn.disabled = true;
  resultsInfo.textContent = "Parsing items...";
  resultsBody.innerHTML = "";
  pathSection.style.display = "none";
  hideMessages();
  try {
    const parsedItems = parseItems(itemsText);
    if (parsedItems.length === 0) {
      throw new Error("No valid items found. Please check your format.");
    }
    resultsInfo.textContent = `Found ${parsedItems.length} items. Fetching item IDs...`;
    const itemsWithIds = [];
    for (const item of parsedItems) {
      const {
        id: itemId,
        icon,
        canonicalName,
      } = await fetchItemIdAndIconFromXIVAPI(item.name);
      if (itemId) {
        itemsWithIds.push({ ...item, name: canonicalName, itemId, icon });
      } else {
        itemsWithIds.push({
          ...item,
          name: canonicalName,
          itemId: null,
          icon: null,
          error: "Item not found in XIVAPI",
        });
      }
    }
    const validItems = itemsWithIds.filter(
      (item) => item.itemId && !item.error
    ).length;
    resultsInfo.textContent = `Fetched IDs for ${validItems} items. Getting market data...`;
    if (validItems < itemsWithIds.length) {
      resultsInfo.textContent += ` (${ 
        itemsWithIds.length - validItems
      } items had issues)`;
    }
    const marketData = await fetchMarketData(dc, itemsWithIds);
    showSuccess(`Fetched real-time market data from ${dc} data center`);
    shoppingList = findBestServers(marketData, itemsWithIds, null);
    const validMarketItems = shoppingList.filter(
      (item) => !item.error
    ).length;
    resultsInfo.textContent = `${validMarketItems} items with prices found on ${dc} Data Center`;
    if (validMarketItems < shoppingList.length) {
      resultsInfo.textContent += ` (${ 
        shoppingList.length - validMarketItems
      } items had issues)`;
    }
    generateItemRows(shoppingList);
    pathBtn.disabled = false;
  } catch (error) {
    console.error("Error:", error);
    resultsInfo.textContent = "Error processing data. See details below.";
    showError(
      error.message || "An unexpected error occurred. Please try again."
    );
  } finally {
    searchBtn.disabled = false;
    searchBtn.innerHTML = '<i class="fas fa-search"></i> Search Prices';
  }
});

pathBtn.addEventListener("click", function () {
  if (shoppingList.length === 0) {
    showError("No shopping list data available");
    return;
  }
  this.disabled = true;
  this.innerHTML =
    '<i class="fas fa-spinner fa-spin"></i> Calculating...';
  hideMessages();
  setTimeout(() => {
    generateOptimalPath(shoppingList);
    this.disabled = false;
    this.innerHTML = '<i class="fas fa-route"></i> Find Path';
  }, 500);
});

const LS_PREFIX = "ryutsu-list-";
const listsSidebar = document.getElementById("lists-sidebar");
const listsBtn = document.getElementById("lists-btn");
const closeListsSidebar = document.getElementById("close-lists-sidebar");
const sidebarListName = document.getElementById("sidebar-list-name");
const sidebarSaveListBtn = document.getElementById(
  "sidebar-save-list-btn"
);
const sidebarListsList = document.getElementById("sidebar-lists-list");
const sidebarSuccessSection = document.getElementById(
  "sidebar-success-section"
);
const sidebarErrorSection = document.getElementById(
  "sidebar-error-section"
);

function getSavedListNames() {
  const names = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith(LS_PREFIX)) {
      names.push(key.substring(LS_PREFIX.length));
    }
  }
  return names.sort();
}
function showSidebarSuccess(message) {
  showToast(message, "success");
}
function showSidebarError(message) {
  showToast(message, "error");
}
function updateSidebarLists() {
  const names = getSavedListNames();
  sidebarListsList.innerHTML =
    names.length === 0
      ? `<li style='color:#888;font-size:0.97rem;padding:10px 0;'>No saved lists.</li>`
      : "";
  names.forEach((n) => {
    const li = document.createElement("li");
    li.className = "sidebar-list-item";
    li.innerHTML = `
      <span class="sidebar-list-label" title="Load list"><i class="fas fa-folder"></i> ${n}</span>
      <span class="sidebar-list-actions">
        <button class="sidebar-list-btn" title="Delete" data-listname="${n}"><i class="fas fa-trash"></i></button>
      </span>
    `;
    li.querySelector(".sidebar-list-label").onclick = () =>
      loadSidebarList(n);
    li.querySelector(".sidebar-list-btn").onclick = () =>
      deleteSidebarList(n);
    sidebarListsList.appendChild(li);
  });
}
function saveSidebarList() {
  const name = sidebarListName.value.trim();
  if (!name) {
    showSidebarError("Please enter a name for your list.");
    return;
  }
  const itemsText = itemsInput.value;
  const dc = datacenterSelect.value;
  if (!itemsText) {
    showSidebarError("No items to save.");
    return;
  }
  const data = {
    itemsText,
    datacenter: dc,
    isHQ,
  };
  localStorage.setItem(LS_PREFIX + name, JSON.stringify(data));
  showSidebarSuccess(`List '<b>${name}</b>' saved locally.`);
  updateSidebarLists();
}
function loadSidebarList(name) {
  const raw = localStorage.getItem(LS_PREFIX + name);
  if (!raw) {
    showSidebarError("Selected list not found.");
    return;
  }
  try {
    const data = JSON.parse(raw);
    itemsInput.value = data.itemsText || "";
    datacenterSelect.value = data.datacenter || "";
    isHQ = !!data.isHQ;
    updateQualityButtons();
    sidebarListName.value = name;
    showSidebarSuccess(`List '<b>${name}</b>' loaded.`);
  } catch (e) {
    showSidebarError("Failed to load list data.");
  }
}
function deleteSidebarList(name) {
  if (confirm(`Delete list '${name}'? This cannot be undone.`)) {
    localStorage.removeItem(LS_PREFIX + name);
    showSidebarSuccess(`List '<b>${name}</b>' deleted.`);
    updateSidebarLists();
    if (sidebarListName.value === name) sidebarListName.value = "";
  }
}
listsBtn.onclick = function () {
  listsSidebar.classList.add("open");
  updateSidebarLists();
  hideSidebarMessages();
};
closeListsSidebar.onclick = function () {
  listsSidebar.classList.remove("open");
};
sidebarSaveListBtn.onclick = saveSidebarList;
document.addEventListener("mousedown", function (e) {
  if (
    listsSidebar.classList.contains("open") &&
    !listsSidebar.contains(e.target) &&
    e.target !== listsBtn
  ) {
    listsSidebar.classList.remove("open");
  }
});
document.addEventListener("DOMContentLoaded", () => {
  itemsInput.value = "";
  document.getElementById("help-btn").onclick = showHelpModal;
});