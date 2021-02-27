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
      var: "xbt",
    },
    {
      name: "ETH",
      asset: "XETH",
      pair: "XETHZEUR",
      var: "eth",
    },
    {
      name: "ADA",
      asset: "ADA",
      pair: "ADAEUR",
      var: "ada",
    }
  ];
}
