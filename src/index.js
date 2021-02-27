import blessed from "neo-blessed";
import KrakenClient from "./kraken.js";
import CachedData from "./CachedData.js";
import Order from "./Order.js";

const key = "***REMOVED***";
const secret = "***REMOVED***";
const kraken = new KrakenClient(key, secret);

const screen = blessed.screen({dockBorders: true});
const topText = blessed.text({
  parent: screen,
  left: 1,
  tags: true
});
setStatus("starting");
const layout = blessed.layout({
  //parent: screen,
  top: 1,
  width: "100%",
  height: "100%"
});
const infoTable = blessed.table({
  parent: screen,
  top: 1,
  width: 25,
  scrollable: true,
  noCellBorders: true,
  border: "line",
  align: "left",
  tags: true,
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
const avgTable = blessed.table({
  parent: screen,
  top: 1,
  left: 25 - 2,
  width: 25,
  scrollable: true,
  noCellBorders: true,
  border: "line",
  align: "left",
  tags: true,
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
  parent: screen,
  top: 1,
  left: 50 - 4,
  scrollable: true,
  noCellBorders: true,
  border: "line",
  align: "left",
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


// +4 on the rate counter
function loadOrders() {
  setStatus("loading orders");
  // +1 on the rate counter
  kraken.api("Balance").then(resp => {
    CachedData.eur = resp.result["ZEUR"];
    CachedData.xbt = resp.result["XXBT"];
    CachedData.eth = resp.result["XETH"];
    CachedData.ada = resp.result["ADA"];
    // +1 on the rate counter
    return kraken.api("TradeBalance", {asset: "EUR"});
  }).then(resp => {
    CachedData.equivalentBalance = resp.result.eb;
    // +2 on the rate counter
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
        removeTrailingZero(order.vol),
        order.descr.price,
        order.descr.ordertype,
        order.status,
        new Date(order.opentm * 1000)
      ));
    }
    CachedData.orders = orders;

    let info = [
      ["{bold}Tot{/bold}", removeTrailingZero(CachedData.equivalentBalance) + " €"],
      ["{bold}EUR{/bold}", removeTrailingZero(CachedData.eur)],
      ["{bold}XBT{/bold}", removeTrailingZero(CachedData.xbt)],
      ["{bold}ETH{/bold}", removeTrailingZero(CachedData.eth)],
      ["{bold}ADA{/bold}", removeTrailingZero(CachedData.ada)]
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
    // get asset ticker for XBT, ETH and ADA
    setStatus("loading ticker");
    return kraken.api("Ticker", {pair: "XXBTZEUR,XETHZEUR,ADAEUR"});
  }).then(resp => {
    setStatus("loading 24h average");
    CachedData.xbtAvg = resp.result["XXBTZEUR"].p[1];
    CachedData.ethAvg = resp.result["XETHZEUR"].p[1];
    CachedData.adaAvg = resp.result["ADAEUR"].p[1];
    let data = [
      ["{bold}24h{/bold}", "{bold}average{/bold}"],
      ["{bold}XBT{/bold}", removeTrailingZero(CachedData.xbtAvg) + " €"],
      ["{bold}ETH{/bold}", removeTrailingZero(CachedData.ethAvg) + " €"],
      ["{bold}ADA{/bold}", removeTrailingZero(CachedData.adaAvg) + " €"]
    ];

    avgTable.setData(data);
  }).then(() => {
    // data has been loaded successfully, set as non-dirty
    CachedData.dirty = false;
  }).catch(error => {
    CachedData.dirty = true;
    setStatus("Error: " + error);
    console.log("Error: " + error);
  }).finally(() => {
    setStatus("idle");
  });
}

loadOrders();
// can be called every > 8 seconds for the rate counter
setInterval(loadOrders, 10000);


function setStatus(status) {
  topText.setContent("{bold}Status{/bold}: " + status);
  screen.render();
}

function removeTrailingZero(value) {
  return value.replace(/([0-9])[0]+$/, "$1");
}
