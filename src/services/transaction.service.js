import TransactionModel from "../models/transaction.model.js";
import SlotModel from "../models/slot.model.js";
import ProductModel from "../models/product.model.js";
import MachineModel from "../models/machine.model.js";

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
    const slot = isNaN(slot_id)
      ? await SlotModel.findById(slot_id)
      : await SlotModel.findOne({ slot_id: Number(slot_id) });

    if (!slot) throw new Error("Slot not found");

    const product = await ProductModel.findById(slot.product);
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

    const updatedMachine = await MachineModel.findOne({});
    return { trx: trx.toObject(), currentMoney: updatedMachine.currentMoney };
  }
}

export default new TransactionService();
