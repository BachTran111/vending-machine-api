import { readData, writeData, getNextId } from "../utils/fileDb.js";
import Transaction from "../models/transaction.model.js";

class TransactionService {
  async deposit(amount) {
    const data = await readData();
    data.currentMoney = (data.currentMoney || 0) + Number(amount);
    await writeData(data);
    return data.currentMoney;
  }

  async getAll() {
    const data = await readData();
    return data.transactions.map(
      (t) =>
        new Transaction(
          t.id,
          t.slot_id,
          t.product_id,
          t.quantity,
          t.total_price,
          t.money_received,
          t.created_at
        )
    );
  }

  async create(slot_id, quantity = 1) {
    const data = await readData();
    const slot = data.slots.find((s) => s.id === Number(slot_id));
    if (!slot) throw new Error("Slot not found");

    const product = data.products.find((p) => p.id === Number(slot.product_id));
    if (!product) throw new Error("Product not found for this slot");

    if (slot.quantity < quantity) throw new Error("Not enough stock");

    const total_price = product.price * Number(quantity);

    if ((data.currentMoney || 0) < total_price)
      throw new Error("Not enough money in machine");

    // update stock & money
    slot.quantity -= Number(quantity);
    data.currentMoney -= total_price;

    const id = await getNextId("transactions");
    const trx = new Transaction(
      id,
      slot.id,
      product.id,
      Number(quantity),
      total_price,
      total_price,
      new Date().toISOString()
    );

    data.transactions.push({ ...trx });
    await writeData(data);

    return { trx, currentMoney: data.currentMoney };
  }
}

export default new TransactionService();
