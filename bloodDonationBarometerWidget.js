// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit:
// icon-color: deep-gray; icon-glyph: magic;

// Licence: GPL-3.0 License https://github.com/bjoerrrn/BloodDonationBarometer/blob/main/LICENSE
// Source: https://github.com/bjoerrrn/BloodDonationBarometer
// Version: 1.0.0

// Blood donation data sources categorized by organizations
const rk = {
  // Deutsches Rotes Kreuz (German Red Cross)
  bwh: { url: "https://www.blutspende.de/startseite", lbl: "DRK 🇩🇪 Ba-Wü, Hessen" },
  nstob: { url: "https://www.blutspende-leben.de/blut-spenden", lbl: "DRK 🇩🇪 NSTOB" },
  no: { url: "https://www.blutspende-nordost.de", lbl: "DRK 🇩🇪 Nord-Ost" },

  // Schweizerisches Rotes Kreuz (Swiss Red Cross)
  irb: { api: "interregional", lbl: "SRK 🇨🇭 Interregional" },
  aargau_solothurn: { api: "aargau_solothurn", lbl: "SRK 🇨🇭 Aargau - Solothurn" },
  basel: { api: "basel", lbl: "SRK 🇨🇭 Basel" },
  fribourg: { api: "fribourg", lbl: "SRK 🇨🇭 Freiburg" },
  geneve: { api: "geneve", lbl: "SRK 🇨🇭 Genf" },
  gesamt: { api: "schweiz_gesamt", lbl: "SRK 🇨🇭 Schweiz Gesamt" },
  graubuenden: { api: "graubuenden", lbl: "SRK 🇨🇭 Graubünden" },
  neuchatel_jura: { api: "neuchatel_jura", lbl: "SRK 🇨🇭 Neuchâtel-Jura" },
  nordostschweiz: { api: "nordostschweiz", lbl: "SRK 🇨🇭 Nordostschweiz" },
  svizzera_italiana: { api: "svizzera_italiana", lbl: "SRK 🇨🇭 Svizzera italiana" },
  zentralschweiz: { api: "zentralschweiz", lbl: "SRK 🇨🇭 Zentralschweiz" },
  zuerich: { api: "zuerich", lbl: "SRK 🇨🇭 Zürich" }
};

// Widget Configuration
const backgroundColor = new Color("#000", 1);
const widget = new ListWidget();
widget.setPadding(0, 0, 0, 0);
widget.backgroundColor = backgroundColor;

// Drawing Configuration
const contextSize = 282;
const drawContext = new DrawContext();
drawContext.size = new Size(contextSize, contextSize);
drawContext.opaque = false;
drawContext.setTextAlignedCenter();

// Layout Configuration
const vertPadding = 30;
const vertLabel = 110;
const hortImage1 = 78;
const hortImage2 = 193;
const symbolSize = 11;

// Define drawText()
function drawText(text, fontSize, x, y, color = Color.white(), bold = false) {
  drawContext.setFont(bold ? Font.boldSystemFont(fontSize) : Font.systemFont(fontSize));
  drawContext.setTextColor(color);
  drawContext.drawText(text.toString(), new Point(x, y));
}

// `nstob` Labels & Extraction
async function extractBloodData(payload) {
  const scriptMatch = payload.match(/<script[^>]+data-drupal-selector="drupal-settings-json"[^>]*>(.*?)<\/script>/s);
  if (!scriptMatch) throw new Error("Could not find JSON data.");

  const rawJsonString = scriptMatch[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&');
  const jsonData = JSON.parse(rawJsonString);

  if (!jsonData.blutgruppen) throw new Error("No blood data found.");

  const bloodData = jsonData.blutgruppen.default || jsonData.blutgruppen;
  console.log("✅ Extracted Blood Data:", bloodData);
  return bloodData;
}

// Swiss Red Cross API extraction
async function fetchSwissBloodData(institute) {
  const url = `https://www.blutspende.ch/api/blood_supplies/${institute}?locale=de`;
  const request = new Request(url);
  
  try {
    const jsonData = await request.loadJSON();
    console.log(`✅ Full API Response for ${institute}:`, jsonData); 

    if (!jsonData || !jsonData.blood_supplies) {
      console.log(`⚠️ No data available for ${institute}`);
      return null;
    }
    
    return jsonData.blood_supplies;

  } catch (error) {
    console.log(`❌ API Error for ${institute}:`, error);
    return null;
  }
}

// Symbol mapping (Swiss API & Numeric)
function getSymbol(loc, i) {
  if (i === undefined || i === null) {
    console.log(`⚠️ Missing Data for ${loc}`);
    return "?";
  }

  console.log(`🔍 Processing ${loc}: ${i}`);

  if (loc === "nstob") {
    return ["🔥", "🩸", "🩸🩸", "🩸🩸🩸", "🩸🩸🩸🩸"][i] || "?";
  }

  const symbols = {
    "red": "🔥",
    "yellow": "🩸",
    "green": "🩸🩸",
    "blue": "🩸🩸🩸",
    "grey": "🩸🩸🩸🩸"
  };

  if (typeof i === "string" && symbols[i]) return symbols[i];

  // Numeric Mapping for `no`, `bwh`
  const value = Number(i);
  if (!isNaN(value)) {
    if (value <= 15) return "🔥";  
    if (value <= 25) return "🩸";  
    if (value <= 50) return "🩸🩸";  
    if (value <= 75) return "🩸🩸🩸";  
    return "🩸🩸🩸🩸";  
  }

  return "?";
}

// buildWidget
async function buildWidget() {
  drawText("🩸 Barometer", 25, 35, 25, Color.red(), true);

  let loc;
  try { loc = readParams(); } catch (err) {
    console.log("❌ Error reading location:", err);
    drawText("Bitte Standort angeben.", 20, 35, vertLabel, Color.yellow());
    return;
  }

  try {
    drawText(rk[loc].lbl, 15, 35, 75, Color.white(), true);
    widget.url = rk[loc].url;

    let obj;
    if (rk[loc].api) {
      obj = await fetchSwissBloodData(rk[loc].api);
    } else {
      const request = new Request(rk[loc].url);
      const payload = await request.loadString();
      obj = await extractBloodData(payload);
    }

    if (!obj) {
      console.log(`⚠️ No valid data for ${loc}`);
      drawText("Keine Daten verfügbar.", 15, 35, vertLabel, Color.yellow());
      return;
    }

    console.log(`✅ Data Loaded for ${loc}`, obj);

    const labels = ["A+", "B+", "AB+", "0+", "A-", "B-", "AB-", "0-"];
    const keys = Object.keys(obj);

    labels.forEach((label, index) => {
      const x = index < 4 ? 35 : 150;
      const y = vertLabel + (index % 4) * vertPadding;
      const value = obj[keys[index]] || "?";

      drawText(label, 20, x, y);
      drawText(getSymbol(loc, value), symbolSize, index < 4 ? hortImage1 : hortImage2, y + vertPadding - 26);
    });

    drawText(`Stand: ${new Date().toLocaleDateString("de-DE")}`, 15, 35, vertLabel + 4 * vertPadding + 5);
  } catch (err) {
    console.log(`❌ Error loading data for ${loc}:`, err);
    drawText("Remote Daten nicht lesbar.", 20, 35, vertLabel, Color.yellow());
  }
}

// Run the script
await buildWidget();
widget.backgroundImage = drawContext.getImage();
Script.setWidget(widget);
Script.complete();
widget.presentSmall();
