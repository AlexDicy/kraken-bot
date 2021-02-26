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
}
