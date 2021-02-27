export default class CachedData {
  /**
   * @type boolean true if data should not be considered valid
   */
  static dirty = true;
  // in EUR
  static equivalentBalance = 0;
  // balance
  static eur = 0;
  static xbt = 0;
  static eth = 0;
  static ada = 0;

  // price 24h average
  static xbtAvg = 0;
  static ethAvg = 0;
  static adaAvg = 0;

  /** @type Order[] */
  static orders = [];
}
