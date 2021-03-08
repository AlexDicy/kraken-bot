export default class CachedData {
  /**
   * @type boolean true if data should not be considered valid
   */
  static dirty = true;

  static balance = {
    equivalent: 0 // in EUR
    // additional keys are set during runtime
  };

  // last price
  static price = {
    // keys are set during runtime
  };

  // price 24h average
  static average = {
    // keys are set during runtime
  };
  // price 24h high
  static high = {
    // keys are set during runtime
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
      tradeValue: 150,
      maxTrades: 3
    },
    {
      name: "ETH",
      asset: "XETH",
      pair: "XETHZEUR",
      pairAlias: "ETHEUR",
      maxDecimals: 2,
      lotDecimals: 8,
      tradeValue: 70,
      maxTrades: 3
    },
    {
      name: "ADA",
      asset: "ADA",
      pair: "ADAEUR",
      pairAlias: "ADAEUR",
      maxDecimals: 6,
      lotDecimals: 8,
      tradeValue: 40, // keep in mind that the minimum volume for ADA is 25
      maxTrades: 1 // 0 for pause
    },
    {
      name: "DOT",
      asset: "DOT",
      pair: "DOTEUR",
      pairAlias: "DOTEUR",
      maxDecimals: 4,
      lotDecimals: 8,
      tradeValue: 70,
      maxTrades: 3
    },
    {
      name: "UNI",
      asset: "UNI",
      pair: "UNIEUR",
      pairAlias: "UNIEUR",
      maxDecimals: 3,
      lotDecimals: 8,
      tradeValue: 70,
      maxTrades: 3
    }
  ];
}
