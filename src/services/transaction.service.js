import { readData, writeData, getNextId } from "../utils/fileDb.js";
import TransactionModel from "../models/transaction.model.js";
import SlotModel from "../models/slot.model.js";
import ProductModel from "../models/product.model.js";
import MachineModel from "../models/machine.model.js";

// class TransactionService {
//   async deposit(amount) {
//     const data = await readData();
//     data.currentMoney = (data.currentMoney || 0) + Number(amount);
//     await writeData(data);
//     return data.currentMoney;
//   }

//   async getAll() {
//     const data = await readData();
//     return data.transactions.map(
//       (t) =>
//         new Transaction(
//           t.id,
//           t.slot_id,
//           t.product_id,
//           t.quantity,
//           t.total_price,
//           t.money_received,
//           t.created_at
//         )
//     );
//   }

//   async create(slot_id, quantity = 1) {
//     const data = await readData();
//     const slot = data.slots.find((s) => s.id === Number(slot_id));
//     if (!slot) throw new Error("Slot not found");

//     const product = data.products.find((p) => p.id === Number(slot.product_id));
//     if (!product) throw new Error("Product not found for this slot");

//     if (slot.quantity < quantity) throw new Error("Not enough stock");

//     const total_price = product.price * Number(quantity);

//     if ((data.currentMoney || 0) < total_price)
//       throw new Error("Not enough money in machine");

//     // update stock & money
//     slot.quantity -= Number(quantity);
//     data.currentMoney -= total_price;

//     const id = await getNextId("transactions");
//     const trx = new Transaction(
//       id,
//       slot.id,
//       product.id,
//       Number(quantity),
//       total_price,
//       total_price,
//       new Date().toISOString()
//     );

//     data.transactions.push({ ...trx });
//     await writeData(data);

//     return { trx, currentMoney: data.currentMoney };
//   }
// }

class TransactionService {
  async deposit(amount) {
    const amt = Number(amount);
    if (isNaN(amt) || amt <= 0) throw new Error("Invalid amount");
    const doc = await MachineModel.findOneAndUpdate(
      {},
      { $inc: { currentMoney: amt } },
      { upsert: true, new: true }
    );
    return doc.currentMoney;
  }

  async getCurrentMoney() {
    const doc = await MachineModel.findOne({});
    return doc && typeof doc.currentMoney === "number" ? doc.currentMoney : 0;
  }

  async getAll() {
    return TransactionModel.find().populate("product slot").lean();
  }

  async create(slot_id, quantity = 1) {
    const slot = await SlotModel.findById(slot_id);
    if (!slot) throw new Error("Slot not found");
    const product = await ProductModel.findOne({ id: slot.product_id });
    if (!product) throw new Error("Product not found for this slot");
    if (slot.quantity < quantity) throw new Error("Not enough stock");

    const total_price = product.price * Number(quantity);

    const machine = await MachineModel.findOne({});
    const currentMoney = (machine && machine.currentMoney) || 0;
    if (currentMoney < total_price)
      throw new Error("Not enough money in machine");

    slot.quantity -= Number(quantity);
    await slot.save();

    await MachineModel.findOneAndUpdate(
      {},
      { $inc: { currentMoney: -total_price } },
      { upsert: true }
    );

    const trx = await TransactionModel.create({
      slot: slot._id,
      product: product._id,
      quantity: Number(quantity),
      total_price,
      money_received: total_price,
    });

    const m = await MachineModel.findOne({});
    return { trx: trx.toObject(), currentMoney: m.currentMoney };
  }
}

export default new TransactionService();
