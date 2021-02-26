import KrakenClient from "./kraken.js";

const key = "***REMOVED***";
const secret = "***REMOVED***";
const kraken = new KrakenClient(key, secret);

(async () => {
  // display user's balance
  //console.log(await kraken.api("Balance"));

  console.log(await kraken.api("TradeBalance", {asset: "EUR"}));

  // get Ticker Info
  //console.log(await kraken.api("Ticker", {pair: "XXBTZEUR"}));
})();
