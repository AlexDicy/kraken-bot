import blessed from "neo-blessed";
import Table from "neo-blessed/lib/widgets/table.js";

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

export const screen = blessed.screen({autoPadding: true, dockBorders: true});
export const topText = blessed.text({
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
export const infoTable = blessed.table({
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
export const avgTable = blessed.table({
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
export const ordersTable = blessed.table({
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
export const logText = blessed.box({
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
