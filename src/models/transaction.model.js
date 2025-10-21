// class Transaction {
//   constructor(
//     id,
//     slot_id,
//     product_id,
//     quantity,
//     total_price,
//     money_received,
//     created_at = new Date()
//   ) {
//     this.id = id;
//     this.slot_id = slot_id;
//     this.product_id = product_id;
//     this.quantity = quantity;
//     this.total_price = total_price;
//     this.money_received = money_received;
//     this.created_at = created_at;
//   }
// }

// export default Transaction;

import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  slot: { type: mongoose.Schema.Types.ObjectId, ref: "Slot", required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  total_price: { type: Number, required: true },
  money_received: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },
});

const TransactionModel = mongoose.model("Transaction", transactionSchema);
export default TransactionModel;