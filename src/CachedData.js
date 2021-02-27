export default class CachedData {
  /**
   * @type boolean true if data should not be considered valid
   */
  static dirty = true;

  static balance = {
    equivalent: 0, // in EUR
    eur: 0,
    xbt: 0,
    eth: 0,
    ada: 0
  };

  // last price
  static price = {
    xbt: {
      a: 0,
      b: 0
    },
    eth: {
      a: 0,
      b: 0
    },
    ada: {
      a: 0,
      b: 0
    }
  };

  // price 24h average
  static average = {
    xbt: 0,
    eth: 0,
    ada: 0
  };
  // price 24h high
  static high = {
    xbt: 0,
    eth: 0,
    ada: 0
  };

  /** @type Order[] */
  static orders = [];

  static assets = [
    {
      name: "XBT",
      asset: "XXBT",
      pair: "XXBTZEUR",
      pairAlias: "XBTEUR", // used in orders
      var: "xbt",
      tradeValue: 70,
      maxTrades: 7
    },
    {
      name: "ETH",
      asset: "XETH",
      pair: "XETHZEUR",
      pairAlias: "ETHEUR",
      var: "eth",
      tradeValue: 50,
      maxTrades: 4
    },
    {
      name: "ADA",
      asset: "ADA",
      pair: "ADAEUR",
      pairAlias: "ADAEUR",
      var: "ada",
      tradeValue: 20,
      maxTrades: 5
    }
  ];
}
