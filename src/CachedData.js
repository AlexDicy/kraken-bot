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

  // loaded from assets.json
  static assets = [];
}
