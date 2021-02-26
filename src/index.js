import KrakenClient from "./kraken.js";
import CachedData from "./CachedData.js";
import Order from "./Order.js";
import {Type} from "./Enums.js";

const key = "***REMOVED***";
const secret = "***REMOVED***";
const kraken = new KrakenClient(key, secret);

// display user's balance
//console.log(await kraken.api("Balance"));

kraken.api("TradeBalance", {asset: "EUR"}).then(resp => {
  CachedData.equivalentBalance = resp.result.eb;
  return kraken.api("OpenOrders");
}).then(resp => {
  let open = resp.result.open;
  for (let id of Object.keys(open)) {
    let order = open[id];

    console.log(Type.fromString("buy"));

    let obj = new Order(
      id,
      order.descr.pair,
      order.descr.type,
      order.vol,
      order.descr.price,
      order.descr.ordertype,
      order.status,
      new Date(order.opentm * 1000)
    );
    console.dir(obj, {depth: null});
  }

  /*'OXGME7-IQ5K5-TAKTQF': {
    refid: null,
      userref: 0,
      status: 'open',
      opentm: 1614264265.009,
      starttm: 0,
      expiretm: 0,
      descr: {
      pair: 'XBTEUR',
        type: 'sell',
        ordertype: 'limit',
        price: '42341.5',
        price2: '0',
        leverage: 'none',
        order: 'sell 0.00096252 XBTEUR @ limit 42341.5',
        close: ''
    },
    vol: '0.00096252',
      vol_exec: '0.00000000',
      cost: '0.00000',
      fee: '0.00000',
      price: '0.00000',
      stopprice: '0.00000',
      limitprice: '0.00000',
      misc: '',
      oflags: 'fciq'
  }*/

});

// get Ticker Info
//console.log(await kraken.api("Ticker", {pair: "XXBTZEUR"}));
