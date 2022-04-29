// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: magic;

// Licence: GPL-3.0 License https://github.com/bjoerrrn/BloodDonationBarometer/blob/main/LICENSE
// Source: https://github.com/bjoerrrn/BloodDonationBarometer
// Version: 0.1.6


let rk={};

// Deutsches Rotes Kreuz
rk.bwh={};
rk.bwh.url   = `https://www.blutspende.de/startseite`;
rk.bwh.lbl   = "DRK 🇩🇪 Ba-W\u00fc, Hessen";
rk.nstob={};
rk.nstob.url = `https://www.blutspende-leben.de/blut-spenden`;
rk.nstob.lbl = "DRK 🇩🇪 NSTOB";
rk.no={};
rk.no.url    = `https://www.blutspende-nordost.de`;
rk.no.lbl    = "DRK 🇩🇪 Nord-Ost"

// Schweizerisches Rotes Kreuz
rk.irb={};
rk.irb.url                  = `https://www.blutspende.ch/de/spenderinfos/warum-blut-spenden/blutgruppenbarometer`
rk.irb.lbl                  = "SRK 🇨🇭 Interregional"
rk.aargau_solothurn={};
rk.aargau_solothurn.url     = `https://www.blutspende.ch/de/spenderinfos/warum-blut-spenden/blutgruppenbarometer`
rk.aargau_solothurn.lbl     = "SRK 🇨🇭 Aagrau - Solothurn"
rk.basel={};
rk.basel.url                = `https://www.blutspende.ch/de/spenderinfos/warum-blut-spenden/blutgruppenbarometer`
rk.basel.lbl                = "SRK 🇨🇭 Basel"
rk.fribourg={};
rk.fribourg.url             = `https://www.blutspende.ch/de/spenderinfos/warum-blut-spenden/blutgruppenbarometer`
rk.fribourg.lbl             = "SRK 🇨🇭 Freiburg"
rk.geneve={};
rk.geneve.url               = `https://www.blutspende.ch/de/spenderinfos/warum-blut-spenden/blutgruppenbarometer`
rk.geneve.lbl               = "SRK 🇨🇭 Genf"
rk.gesamt={};
rk.gesamt.url               = `https://www.blutspende.ch/de/spenderinfos/warum-blut-spenden/blutgruppenbarometer`
rk.gesamt.lbl               = "SRK 🇨🇭 Schweiz Gesamt"
rk.graubuenden={};
rk.graubuenden.url          = `https://www.blutspende.ch/de/spenderinfos/warum-blut-spenden/blutgruppenbarometer`
rk.graubuenden.lbl          = "SRK 🇨🇭 Graub\u00fcnden"
rk.neuchatel_jura={};
rk.neuchatel_jura.url       = `https://www.blutspende.ch/de/spenderinfos/warum-blut-spenden/blutgruppenbarometer`
rk.neuchatel_jura.lbl       = "SRK 🇨🇭 Neuch\u00e2tel-Jura"
rk.nordostschweiz={};
rk.nordostschweiz.url       = `https://www.blutspende.ch/de/spenderinfos/warum-blut-spenden/blutgruppenbarometer`
rk.nordostschweiz.lbl       = "SRK 🇨🇭 Nordostschweiz"
rk.svizzera_italiana={};
rk.svizzera_italiana.url    = `https://www.blutspende.ch/de/spenderinfos/warum-blut-spenden/blutgruppenbarometer`
rk.svizzera_italiana.lbl    = "SRK 🇨🇭 Svizzera italiana"
rk.zentralschweiz={};
rk.zentralschweiz.url       = `https://www.blutspende.ch/de/spenderinfos/warum-blut-spenden/blutgruppenbarometer`
rk.zentralschweiz.lbl       = "SRK 🇨🇭 Zentralschweiz"
rk.zuerich={};
rk.zuerich.url              = `https://www.blutspende.ch/de/spenderinfos/warum-blut-spenden/blutgruppenbarometer`
rk.zuerich.lbl              = "SRK 🇨🇭 Z\u00fcrich"


// configure variables and setup widget
const backgroundColor = new Color("#000", 1);
const vertDefaultPadding = 30;
const vertDefaultImage = 110;
const vertDefaultLabel = vertDefaultImage - 5;
const hortDefaultImage1 = 75;
const hortDefaultImage2 = 190;
const symbolSize = 11;
const widget = new ListWidget();
widget.setPadding(0, 0, 0, 0);
widget.backgroundColor = backgroundColor;
const contextSize = 282
let drawContext = new DrawContext();
drawContext.size = new Size(contextSize, contextSize)
drawContext.opaque = false
drawContext.setTextAlignedCenter()
let loc = "";


async function buildWidget() {

    // main headline
    drawText("🩸 Barometer",25,35,25,Color.red(),true);

    try {
      loc = readParams();
      loc.toString();
    } 
    catch (err) {
      log(err);
      drawText("pls specify location",20,35,vertDefaultLabel,Color.yellow());
      return;
    }

    try {
               
      // sub headlines
      drawText(rk[loc]["lbl"],15,35,75,Color.white(),true);
      
      // create request object to load data from html site
      let request = new Request(rk[loc]["url"])
      let payload = await request.loadString()
      
      // extract the json from html string with blood group data
      const jsonString = payload.substring(
        payload.indexOf(">{") + 1, 
        payload.lastIndexOf("}}<") + 2
      );
      
      // parse json data from string into js variables
      let obj=JSON.parse(jsonString).blutgruppen;
      let result={};
      
      // as rk provides data differently, distinguish between solutions
      if (loc == "nstob") { 
          tmpObj=obj.default;
      } else {
          tmpObj=obj;
      }
      
      if (tmpObj.blood_barometer_a_plus != null) { // verify if object exists
          result.a_plus     = tmpObj.blood_barometer_a_plus;
          result.b_plus     = tmpObj.blood_barometer_b_plus;
          result.ab_plus    = tmpObj.blood_barometer_ab_plus;
          result.zero_plus  = tmpObj.blood_barometer_zero_plus;
          result.a_neg      = tmpObj.blood_barometer_a_neg;
          result.b_neg      = tmpObj.blood_barometer_b_neg;
          result.ab_neg     = tmpObj.blood_barometer_ab_neg;
          result.zero_neg   = tmpObj.blood_barometer_zero_neg;
          result.changed    = obj.blood_barometer_changed;
          
      } else if (tmpObj[loc]["a+"] != null) { // verify if object exists
          result.a_plus     = tmpObj[loc]["a+"];
          result.b_plus     = tmpObj[loc]["b+"];
          result.ab_plus    = tmpObj[loc]["ab+"];
          result.zero_plus  = tmpObj[loc]["0+"];
          result.a_neg      = tmpObj[loc]["a-"];
          result.b_neg      = tmpObj[loc]["b-"];
          result.ab_neg     = tmpObj[loc]["ab-"];
          result.zero_neg   = tmpObj[loc]["0-"];
          result.changed    = obj.blood_barometer_changed;
      }
      
      // draw blood reserves and labels
      drawText("A+",20,35,vertDefaultLabel);
      drawText(getSymbol(loc,result.a_plus),symbolSize, hortDefaultImage1, vertDefaultImage); 
      drawText("B+",20,35,vertDefaultLabel + vertDefaultPadding);
      drawText(getSymbol(loc,result.b_plus),symbolSize, hortDefaultImage1, vertDefaultImage + vertDefaultPadding); 
      drawText("AB+",20,35,vertDefaultLabel + 2 * vertDefaultPadding);
      drawText(getSymbol(loc,result.ab_plus),symbolSize, hortDefaultImage1, vertDefaultImage + 2 * vertDefaultPadding); 
      drawText("0+",20,35,vertDefaultLabel + 3 * vertDefaultPadding);
      drawText(getSymbol(loc,result.zero_plus),symbolSize, hortDefaultImage1, vertDefaultImage + 3 * vertDefaultPadding); 
      drawText("A-",20,150,vertDefaultLabel);
      drawText(getSymbol(loc,result.a_neg),symbolSize, hortDefaultImage2, vertDefaultImage); 
      drawText("B-",20,150,vertDefaultLabel + vertDefaultPadding);
      drawText(getSymbol(loc,result.b_neg),symbolSize, hortDefaultImage2, vertDefaultImage + vertDefaultPadding); 
      drawText("AB-",20,150,vertDefaultLabel + 2 * vertDefaultPadding);
      drawText(getSymbol(loc,result.ab_neg),symbolSize, hortDefaultImage2, vertDefaultImage + 2 * vertDefaultPadding); 
      drawText("0-",20,150,vertDefaultLabel + 3 * vertDefaultPadding);
      drawText(getSymbol(loc,result.zero_neg),symbolSize, hortDefaultImage2, vertDefaultImage + 3 * vertDefaultPadding); 
      
      let tmpChanged = "Stand: ";
      tmpChanged += result.changed;
      drawText(tmpChanged,15,35,vertDefaultLabel + 4 * vertDefaultPadding + 5);

    } catch (err) {
      log(err)
      drawText("Reading remote",20,35,vertDefaultLabel,Color.yellow());
      drawText("data failed...",20,35,vertDefaultLabel + vertDefaultPadding,Color.yellow());
    }
}


function drawText(text, fontSize, x, y, color = Color.white(), bold = false){
  if (bold) { 
    drawContext.setFont(Font.boldSystemFont(fontSize)); 
  } else { 
    drawContext.setFont(Font.systemFont(fontSize));
  }
  drawContext.setTextColor(color);
  drawContext.drawText(new String(text).toString(), new Point(x, y));
}

function getSymbol(l,i){
    let symbols;
    if (l == "nstob") {
        symbols = {
            0: function(){ return "🔥"; },
            1: function(){ return "🩸"; },
            2: function(){ return "🩸🩸"; },
            3: function(){ return "🩸🩸🩸"; },
            4: function(){ return "🩸🩸🩸🩸"; }
        }
        return symbols[i]();
    } else if (typeof i === 'string') {
        symbols = {
            "red":      function(){ return "🔥"; },
            "yellow":   function(){ return "🩸"; },
            "green":    function(){ return "🩸🩸"; },
            "blue":     function(){ return "🩸🩸🩸"; },
            "grey":     function(){ return "🩸🩸🩸🩸"; }
        }
        return symbols[i]();
    } else {
        if      (i <=  15){ return "🔥"; }
        else if (i <=  25){ return "🩸"; }
        else if (i <=  50){ return "🩸🩸"; }
        else if (i <=  75){ return "🩸🩸🩸"; }
        else if (i <= 100){ return "🩸🩸🩸🩸"; }
    } 
    return "?";
}

function readParams () {
  let params = args.widgetParameter;
  // test data during editing
  if (!config.runsInWidget) {
    params = "nstob";
  }
  return params;
}

await buildWidget();
widget.backgroundImage = (drawContext.getImage())
Script.setWidget(widget);
Script.complete();
widget.presentSmall();
