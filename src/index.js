import blessed from "neo-blessed";
import Table from "neo-blessed/lib/widgets/table.js";
import KrakenClient from "./kraken.js";
import CachedData from "./CachedData.js";
import Order from "./Order.js";
import Bot from "./Bot.js";
import {Type} from "./Enums.js";

const key = "***REMOVED***";
const secret = "***REMOVED***";
const kraken = new KrakenClient(key, secret);

// fix broken Table method
Table.prototype.oSetData = Table.prototype.setData;
Table.prototype.setData = function (rows) {
  if (rows instanceof Array) {
    for (let row of rows) {
      row[0] = " " + row[0];
    }
  }
  this.oSetData(rows);
};

const screen = blessed.screen({autoPadding: true, dockBorders: true});
const topText = blessed.text({
  parent: screen,
  width: "100%",
  tags: true,
  border: "line",
  padding: {left: 1},
  style: {
    border: {
      fg: "#508ad6"
    }
  }
});
const infoTable = blessed.table({
  parent: screen,
  top: 2,
  width: 25,
  noCellBorders: true,
  border: "line",
  scrollable: true,
  align: "left",
  tags: true,
  style: {
    border: {
      fg: "#508ad6"
    },
    header: {
      fg: "#9abf22"
    },
    cell: {
      fg: "#9abf22"
    }
  }
});
const avgTable = blessed.table({
  parent: screen,
  top: 2,
  left: 25 - 1,
  width: 45,
  noCellBorders: true,
  border: "line",
  scrollable: true,
  align: "left",
  tags: true,
  padding: {
    left: 1,
    right: -1
  },
  style: {
    border: {
      fg: "#508ad6"
    },
    header: {
      fg: "#9abf22"
    },
    cell: {
      fg: "#9abf22"
    }
  }
});
const ordersTable = blessed.table({
  parent: screen,
  top: 2,
  left: 70 - 2,
  width: 42,
  noCellBorders: true,
  border: "line",
  scrollable: true,
  align: "left",
  tags: true,
  style: {
    border: {
      fg: "#508ad6"
    },
    header: {
      bold: true
    },
    cell: {
      fg: "#9abf22"
    }
  }
});
const logText = blessed.box({
  parent: screen,
  top: 2,
  left: 112 - 3,
  right: 0,
  content: "{bold}Welcome to DicyDev Kraken Bot{/bold}",
  border: "line",
  scrollable: true,
  padding: {left: 1},
  tags: true,
  style: {
    border: {
      fg: "#508ad6"
    }
  }
});


// +4 on the rate counter
function loadOrders() {
  log("started fetching data");
  setStatus("loading orders");
  // +1 on the rate counter
  kraken.api("Balance").then(resp => {
    CachedData.balance.eur = resp.result["ZEUR"];
    CachedData.balance.xbt = resp.result["XXBT"];
    CachedData.balance.eth = resp.result["XETH"];
    CachedData.balance.ada = resp.result["ADA"];
    // +1 on the rate counter
    return kraken.api("TradeBalance", {asset: "EUR"});
  }).then(resp => {
    CachedData.balance.equivalent = resp.result.eb;

    let info = [
      ["{bold}tot.{/bold}", removeTrailingZero(CachedData.balance.equivalent) + " €"],
      ["{bold}EUR{/bold}", removeTrailingZero(CachedData.balance.eur)],
      ["{bold}XBT{/bold}", removeTrailingZero(CachedData.balance.xbt)],
      ["{bold}ETH{/bold}", removeTrailingZero(CachedData.balance.eth)],
      ["{bold}ADA{/bold}", removeTrailingZero(CachedData.balance.ada)]
    ];
    infoTable.setData(info);
    // +2 on the rate counter
    return kraken.api("Ticker", {pair: "XXBTZEUR,XETHZEUR,ADAEUR"});
  }).then(resp => {
    setStatus("loading 24h");
    let data = [["{bold}24h{/bold}", "{bold}average{/bold}", "{bold}high{/bold}"]];
    for (let asset of CachedData.assets) {
      CachedData.price[asset.var].a = resp.result[asset.pair].a[0];
      CachedData.price[asset.var].b = resp.result[asset.pair].b[0];
      CachedData.average[asset.var] = resp.result[asset.pair].p[1];
      CachedData.high[asset.var] = resp.result[asset.pair].h[1];

      data.push([
        `{bold}${asset.name}{/bold}`,
        removeTrailingZero(CachedData.average[asset.var]) + " €",
        removeTrailingZero(CachedData.high[asset.var]) + " €"
      ]);
    }

    avgTable.setData(data);

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

    let data = [["pair", "type", "volume", "price"]];
    for (let order of CachedData.orders) {
      data.push([
        order.pair,
        order.type === Type.BUY ? "buy" : "{#BFAA22-fg}sell{/#BFAA22-fg}",
        order.volume,
        order.price
      ]);
    }
    ordersTable.setData(data);
    screen.render();
    // get asset ticker for XBT, ETH and ADA
    setStatus("loading ticker");
  }).then(() => {
    log("data fetched successfully");
    // data has been loaded successfully, set as non-dirty
    CachedData.dirty = false;
  }).catch(error => {
    CachedData.dirty = true;
    setStatus("Error: " + error);
  }).finally(() => {
    setStatus("idle");
    Bot.run();
  });
}

// start
setStatus("starting");
loadOrders();
// can be called every > 8 seconds for the rate counter
setInterval(loadOrders, 10000);


export function setStatus(status) {
  topText.setContent("{bold}Status{/bold}: " + status);
  screen.render();
}

export function log(message) {
  logText.insertBottom(message);
  logText.setScrollPerc(100);
  screen.render();
}

function removeTrailingZero(value) {
  return value.replace(/([0-9])[0]+$/, "$1");
}
