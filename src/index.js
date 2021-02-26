import blessed from "neo-blessed";
import KrakenClient from "./kraken.js";
import CachedData from "./CachedData.js";
import Order from "./Order.js";

const key = "***REMOVED***";
const secret = "***REMOVED***";
const kraken = new KrakenClient(key, secret);

const screen = blessed.screen({smartCSR: true});
const layout = blessed.layout({
  parent: screen,
  width: "100%",
  height: "100%"
});
const infoTable = blessed.table({
  parent: layout,
  scrollable: true,
  noCellBorders: true,
  align: "left",
  border: "line",
  style: {
    border: {
      fg: "#0000ff"
    },
    header: {
      fg: "#ccFFcc"
    },
    cell: {
      fg: "#ccFFcc"
    }
  }
});
const ordersTable = blessed.table({
  parent: layout,
  scrollable: true,
  noCellBorders: true,
  border: "line",
  style: {
    border: {
      fg: "#0000ff"
    },
    header: {
      bold: true
    },
    cell: {
      fg: "#ccFFcc"
    }
  }
});

function loadOrders() {
  kraken.api("Balance").then(resp => {
    CachedData.eur = resp.result["ZEUR"];
    CachedData.xbt = resp.result["XXBT"];
    CachedData.eth = resp.result["XETH"];
    CachedData.ada = resp.result["ADA"];
    return kraken.api("TradeBalance", {asset: "EUR"});
  }).then(resp => {
    CachedData.equivalentBalance = resp.result.eb;
    return kraken.api("OpenOrders");
  }).then(resp => {
    let open = resp.result.open;
    let orders = [];
    for (let id of Object.keys(open)) {
      let order = open[id];

      orders.push(new Order(
        id,
        order.descr.pair,
        order.descr.type,
        order.vol,
        order.descr.price,
        order.descr.ordertype,
        order.status,
        new Date(order.opentm * 1000)
      ));
    }
    CachedData.orders = orders;

    let info = [
      ["Tot", removeTrailingZero(CachedData.equivalentBalance) + " €"],
      ["EUR", removeTrailingZero(CachedData.eur)],
      ["XBT", removeTrailingZero(CachedData.xbt)],
      ["ETH", removeTrailingZero(CachedData.eth)],
      ["ADA", removeTrailingZero(CachedData.ada)]
    ];
    infoTable.setData(info);

    let data = [["Pair", "Type", "Order Type", "Volume", "Price", "Time"]];
    for (let order of CachedData.orders) {
      data.push([
        order.pair,
        order.type,
        order.orderType,
        order.volume,
        order.price,
        order.openTime.toLocaleString()
      ]);
    }
    ordersTable.setData(data);
    screen.render();
  });
}

loadOrders();
setInterval(loadOrders, 10000);


// get Ticker Info
//console.log(await kraken.api("Ticker", {pair: "XXBTZEUR"}));

function removeTrailingZero(value) {
  return value.replace(/([0-9])[0]+$/, "$1");
}
