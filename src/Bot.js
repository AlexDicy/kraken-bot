import CachedData from "./CachedData.js";
import {log, setStatus} from "./index.js";

export default class Bot {
  static run() {
    if (CachedData.dirty) {
      setStatus("Cached Data is dirty, bot not running");
      return;
    }
    log("{#BFAA22-fg}Bot checks running...{/#BFAA22-fg}");

    // controllare se esiste già un ordine nelle ultime 12h
    // e prendo quello acquistato al prezzo più basso
    // altrimenti uso il prezzo altro 24h
    // se il prezzo è sotto il 2% compro.
    for (let asset of CachedData.assets) {
      // keep track of the open orders
      let openOrders = 0;

      /** @type Order */
      let lowestOrder = null;
      for (let order of CachedData.orders) {
        // only if it's the asset we're looking for
        if (order.pair === asset.pairAlias) {
          openOrders++;
          let hours = (Date.now() - order.openTime.getTime()) / 1000 / 60 / 60;
          if (hours <= 12 && (lowestOrder == null || lowestOrder.price > order.price)) {
            lowestOrder = order;
          }
        }
      }

      let highPrice = lowestOrder == null ? CachedData.high[asset.var] : lowestOrder.price;
      let difference = CachedData.price[asset.var].a - highPrice;
      let percentage = (difference / highPrice) * 100;
      let color = percentage >= 0 ? "#9ABF22-fg" : "#BF6B22-fg";
      log(`[${openOrders}/${asset.maxTrades}] {bold}${asset.name}{/bold}: {${color}}`
        + `${percentage.toFixed(2)}%{/${color}} ${lowestOrder != null ? "last order" : "24h high"}`);

      if (percentage <= -2 && openOrders <= asset.maxTrades) {
        log("Open order for " + asset.name + " (" + asset.tradeValue + " €)");
      }
    }
  }
}
