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
    ada: 0,
    dash: 0
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
    },
    dash: {
      a: 0,
      b: 0
    }
  };

  // price 24h average
  static average = {
    xbt: 0,
    eth: 0,
    ada: 0,
    dash: 0
  };
  // price 24h high
  static high = {
    xbt: 0,
    eth: 0,
    ada: 0,
    dash: 0
  };

  /** @type Order[] */
  static orders = [];

  static assets = [
    {
      name: "XBT",
      asset: "XXBT",
      pair: "XXBTZEUR",
      pairAlias: "XBTEUR", // used in orders
      maxDecimals: 1, // how many decimals we can use in orders
      lotDecimals: 8, // volume values
      var: "xbt",
      tradeValue: 120,
      maxTrades: 4
    },
    {
      name: "ETH",
      asset: "XETH",
      pair: "XETHZEUR",
      pairAlias: "ETHEUR",
      maxDecimals: 2,
      lotDecimals: 8,
      var: "eth",
      tradeValue: 50,
      maxTrades: 4
    },
    {
      name: "ADA",
      asset: "ADA",
      pair: "ADAEUR",
      pairAlias: "ADAEUR",
      maxDecimals: 6,
      lotDecimals: 8,
      var: "ada",
      tradeValue: 40, // keep in mind that the minimum volume for ADA is 25
      maxTrades: 1 // 0 for pause
    },
    {
      name: "DASH",
      asset: "DASH",
      pair: "DASHEUR",
      pairAlias: "DASHEUR",
      maxDecimals: 3,
      lotDecimals: 8,
      var: "ada",
      tradeValue: 40,
      maxTrades: 3
    }
  ];
}
