import CachedData from "./CachedData.js";
import {log, setStatus} from "./index.js";

export default class Bot {
  static run() {
    if (CachedData.dirty) {
      setStatus("Cached Data is dirty, bot not running");
      return;
    }

    log("ask price for XBT: " + CachedData.price.xbt.a);
  }
}
