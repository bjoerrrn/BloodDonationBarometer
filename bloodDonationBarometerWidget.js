// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: magic;

// Licence: GPL-3.0 License https://github.com/dusselmann/BloodDonationBarometer/blob/main/LICENSE
// Source: https://github.com/dusselmann/BloodDonationBarometer
// Version: 0.1.0

const padding = 0;
const backgroundColor = new Color("#000", 1);
const vertDefaultPadding = 30;
const vertDefaultImage = 125;
const vertDefaultLabel = vertDefaultImage - 5;
const hortDefaultImage1 = 75;
const hortDefaultImage2 = 190;
const symbolSize = 11;

const widget = new ListWidget();
widget.setPadding(padding, padding, padding, padding);
widget.backgroundColor = backgroundColor;

const contextSize = 282
let drawContext = new DrawContext();
drawContext.size = new Size(contextSize, contextSize)
drawContext.opaque = false
drawContext.setTextAlignedCenter()


async function buildWidget() {

    try {
      
      /*
      `https://www.blutspende.de/startseite`
      "DRK Ba-Wü, Hessen"
      
      `https://www.blutspende-leben.de/blut-spenden`
      "DRK NSTOB"
      
      `https://www.blutspende-nordost.de`
      "DRK Nord-Ost"
      */
      
      drawText("🩸 Barometer",25,35,25,Color.red(),true);
      drawText("DRK Nordwest NSTOB",20,35,75,Color.white(),true);
      
      // create request object to load data from html site
      const url = `https://www.blutspende-leben.de/blut-spenden`;      
      let request = new Request(url)
      let payload = await request.loadString()
      
      // extract the json from html string with blood group data
      const jsonString = payload.substring(
        payload.indexOf(">{") + 1, 
        payload.lastIndexOf("}}<") + 2
      );
      
      // parse json data from string into js variables
      let obj=JSON.parse(jsonString).blutgruppen;
      let result={};
      
      result.a_plus=obj.default.blood_barometer_a_plus;
      result.b_plus=obj.default.blood_barometer_b_plus;
      result.ab_plus=obj.default.blood_barometer_ab_plus;
      result.zero_plus=obj.default.blood_barometer_zero_plus;
      result.a_neg=obj.default.blood_barometer_a_neg;
      result.b_neg=obj.default.blood_barometer_b_neg;
      result.ab_neg=obj.default.blood_barometer_ab_neg;
      result.zero_neg=obj.default.blood_barometer_zero_neg;
      result.changed=obj.blood_barometer_changed;
      
      // draw blood reserves and labels
      drawText("A+",20,35,vertDefaultLabel);
      drawText(getSymbol(result.a_plus),symbolSize, hortDefaultImage1, vertDefaultImage); 
      
      drawText("B+",20,35,vertDefaultLabel + vertDefaultPadding);
      drawText(getSymbol(result.b_plus),symbolSize, hortDefaultImage1, vertDefaultImage + vertDefaultPadding); 
      
      drawText("AB+",20,35,vertDefaultLabel + 2 * vertDefaultPadding);
      drawText(getSymbol(result.ab_plus),symbolSize, hortDefaultImage1, vertDefaultImage + 2 * vertDefaultPadding); 
      
      drawText("0+",20,35,vertDefaultLabel + 3 * vertDefaultPadding);
      drawText(getSymbol(result.zero_plus),symbolSize, hortDefaultImage1, vertDefaultImage + 3 * vertDefaultPadding); 
      
      drawText("A-",20,150,vertDefaultLabel);
      drawText(getSymbol(result.a_neg),symbolSize, hortDefaultImage2, vertDefaultImage); 
      
      drawText("B-",20,150,vertDefaultLabel + vertDefaultPadding);
      drawText(getSymbol(result.b_neg),symbolSize, hortDefaultImage2, vertDefaultImage + vertDefaultPadding); 
      
      drawText("AB-",20,150,vertDefaultLabel + 2 * vertDefaultPadding);
      drawText(getSymbol(result.ab_neg),symbolSize, hortDefaultImage2, vertDefaultImage + 2 * vertDefaultPadding); 
      
      drawText("0-",20,150,vertDefaultLabel + 3 * vertDefaultPadding);
      drawText(getSymbol(result.zero_neg),symbolSize, hortDefaultImage2, vertDefaultImage + 3 * vertDefaultPadding); 

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

function getSymbol(load){
  let symbols = {
    0: function(){
      return "🔥" // 􀠑􀠑􀠑􀠑
    },
    1: function(){
      return "🩸" // 􀠒􀠑􀠑􀠑
    },
    2: function(){
      return "🩸🩸" // 􀠒􀠒􀠑􀠑
    },
    3: function(){
      return "🩸🩸🩸" // 􀠒􀠒􀠒􀠑
    },
    4: function(){
      return "🩸🩸🩸🩸" // 􀠒􀠒􀠒􀠒
    }
  }
  return symbols[load]();
}

await buildWidget();

widget.backgroundImage = (drawContext.getImage())

Script.setWidget(widget);
Script.complete();
widget.presentSmall();
