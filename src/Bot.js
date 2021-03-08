import CachedData from "./CachedData.js";
import {kraken, log, sendError, sendOrder, setStatus} from "./index.js";
import {OrderType, Type} from "./Enums.js";

export default class Bot {
  static isRunning = false;
  static isRetrying = false;

  static sellWaitTime = 10000;
  static sellRetryTime = 5000;

  static async run() {
    if (CachedData.dirty) {
      setStatus("Cached Data is dirty, bot not running");
      log("Fetched data is dirty, bot not running");
      return;
    }
    this.isRunning = true;
    log("{#F6FF7A-fg}-> bot checks running...{/#F6FF7A-fg}");

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

      let currentPrice = CachedData.price[asset.name].a;

      let highPrice = lowestOrder == null ? CachedData.high[asset.name] : (lowestOrder.price / 1.02);
      let difference = currentPrice - highPrice;
      let percentage = (difference / highPrice) * 100;
      let color = percentage >= 0 ? "#D1FF7A-fg" : "#FFB47A-fg";
      log(`[${openOrders}/${asset.maxTrades}] {bold}${asset.name}{/bold}: {${color}}`
        + `${percentage.toFixed(2)}%{/${color}} ${lowestOrder != null ? "last order" : "24h high"}`);

      if (percentage <= -2 && openOrders < asset.maxTrades) {
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
          sendOrder(asset, buyParams);
        }).catch(error => {
          // could not create buy order, just skip
          sendError(error);
          log("{red-fg}ERROR:{/red-fg} " + error);
          log("could not create BUY order, skipping");
          log("placing a sell order just in case");
        }).then(() => {
          // create sell order after 10 seconds
          this.isRetrying = true;
          setTimeout(() => {
            kraken.api("AddOrder", sellParams).then(() => {
              this.isRetrying = false;
              log("-> SELL " + volume + " @ " + sellPrice);
              sendOrder(asset, sellParams);
            }).catch(error => {
              // could not create sell order, try again in 2 seconds
              sendError(error);
              log("{red-fg}ERROR:{/red-fg} " + error);
              log("retrying sell order in 5 seconds...");
              // try again
              setTimeout(() => {
                kraken.api("AddOrder", sellParams).then(() => {
                  log("retry successful");
                  sendOrder(asset, sellParams);
                }).catch(error => {
                  sendError(error);
                  // this is a fatal error and should be notified
                  log("COULD NOT CREATE SELL ORDER: " + error)
                }).finally(() => this.isRetrying = false);
              }, this.sellRetryTime);
            });
          }, this.sellWaitTime);
        });
      }
    }
    this.isRunning = false;
    log("{#F6FF7A-fg}-> bot finished.{/#F6FF7A-fg}");
  }
}
