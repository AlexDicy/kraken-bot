import {removeTrailingZero} from "./index.js";

export default class Order {
  constructor(id, pair, type, volume, price, orderType, status, openTime) {
    this.id = id;
    this.pair = pair;
    this.type = type;
    this.volume = volume;
    this.price = price;
    this.orderType = orderType;
    this.status = status;
    this.openTime = openTime;
  }

  static fromAPI(object) {
    return new Order(
      object.refid,
      object.descr.pair,
      object.descr.type,
      removeTrailingZero(object.vol),
      object.descr.price,
      object.descr.ordertype,
      object.status,
      new Date(object.opentm * 1000)
    );
  }
}
