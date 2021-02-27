import CachedData from "./CachedData.js";
import {kraken, log, setStatus} from "./index.js";
import {OrderType, Type} from "./Enums.js";

export default class Bot {
  static async run() {
    if (CachedData.dirty) {
      setStatus("Cached Data is dirty, bot not running");
      return;
    }
    log("{#BFAA22-fg}-> bot checks running...{/#BFAA22-fg}");

    // controllare se esiste già un ordine nelle ultime 12h
    // e prendo quello acquistato al prezzo più basso
    // altrimenti uso il prezzo altro 24h
    // se il prezzo è sotto il 2% compro.
    for (let asset of CachedData.assets) {
      // skip asset if max trades is 0
      if (asset.maxTrades <= 0) {
        return;
      }
      // keep track of the open orders
      let openOrders = 0;

      /** @type Order */
      let lowestOrder = null;
      for (let order of CachedData.orders) {
        // only if it's the asset we're looking for
        if (order.pair === asset.pairAlias) {
          openOrders++;
          let hours = (Date.now() - order.openTime.getTime()) / 1000 / 60 / 60;
          if (hours <= 24 && (lowestOrder == null || lowestOrder.price > order.price)) {
            lowestOrder = order;
          }
        }
      }

      let currentPrice = CachedData.price[asset.var].a;

      let highPrice = lowestOrder == null ? CachedData.high[asset.var] : (lowestOrder.price / 1.02);
      let difference = currentPrice - highPrice;
      let percentage = (difference / highPrice) * 100;
      let color = percentage >= 0 ? "#9ABF22-fg" : "#BF6B22-fg";
      log(`[${openOrders}/${asset.maxTrades}] {bold}${asset.name}{/bold}: {${color}}`
        + `${percentage.toFixed(2)}%{/${color}} ${lowestOrder != null ? "last order" : "24h high"}`);

      if (percentage <= -2 && openOrders <= asset.maxTrades) {
        // start creating order
        let volume = (asset.tradeValue / currentPrice).toFixed(asset.lotDecimals);
        let sellPrice = (currentPrice * 1.02).toFixed(asset.maxDecimals);
        let buyParams = {
          pair: asset.pair,
          type: Type.BUY,
          ordertype: OrderType.MARKET,
          volume: volume
        };
        let sellParams = {
          pair: asset.pair,
          type: Type.SELL,
          ordertype: OrderType.LIMIT,
          price: sellPrice,
          volume: volume
        };

        // create buy order
        await kraken.api("AddOrder", buyParams).then(() => {
          log("-> BUY " + volume + " @ " + currentPrice);
        }).catch(error => {
          // could not create buy order, just skip
          log("{red-fg}ERROR:{/red-fg} " + error);
          log("could not create BUY order, skipping");
          log("placing a sell order just in case");
        }).then(() => {
          // create sell order after 10 seconds
          setTimeout(() => {
            kraken.api("AddOrder", sellParams).then(() => {
              log("-> SELL " + volume + " @ " + sellPrice);
            }).catch(error => {
              // could not create sell order, try again in 2 seconds
              log("{red-fg}ERROR:{/red-fg} " + error);
              log("retrying sell order in 2 seconds...");
              // try again
              setTimeout(() => {
                kraken.api("AddOrder", sellParams).then(() => {
                  log("retry successful");
                }).catch(error => {
                  // this is a fatal error and should be notified
                  log("COULD NOT CREATE SELL ORDER: " + error)
                });
              }, 2000);
            });
          }, 10000);
        });
      }
    }
    log("{#BFAA22-fg}-> bot finished.{/#BFAA22-fg}");
  }
}
