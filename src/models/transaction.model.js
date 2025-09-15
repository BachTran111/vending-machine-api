class Transaction {
  constructor(
    id,
    slot_id,
    product_id,
    quantity,
    total_price,
    money_received,
    created_at = new Date()
  ) {
    this.id = id;
    this.slot_id = slot_id;
    this.product_id = product_id;
    this.quantity = quantity;
    this.total_price = total_price;
    this.money_received = money_received;
    this.created_at = created_at;
  }
}

export default Transaction;
