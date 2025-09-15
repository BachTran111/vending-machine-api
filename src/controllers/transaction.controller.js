import { readData, writeData, getNextId } from "../utils/fileDb.js";
import { OK } from "../handler/success-response.js";
import Transaction from "../models/transaction.model.js";

class TransactionController {
  getAll = async (req, res, next) => {
    try {
      const data = await readData();
      const transactions = data.transactions.map(
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
      res.status(200).json(
        new OK({
          message: "Transactions retrieved",
          metadata: { transactions },
        })
      );
    } catch (err) {
      next(err);
    }
  };

  create = async (req, res, next) => {
    try {
      const { slot_id, quantity = 1, money_received } = req.body;
      if (slot_id == null || money_received == null) {
        return res.status(400).json({
          status: "ERROR",
          message: "slot and money are required",
        });
      }

      const data = await readData();
      const slot = data.slots.find((s) => s.id === Number(slot_id));
      if (!slot)
        return res
          .status(404)
          .json({ status: "ERROR", message: "Slot not found" });

      const product = data.products.find(
        (p) => p.id === Number(slot.product_id)
      );
      if (!product)
        return res.status(404).json({
          status: "ERROR",
          message: "Product not found for this slot",
        });

      if (slot.quantity < quantity)
        return res
          .status(400)
          .json({ status: "ERROR", message: "Not enough stock" });

      const total_price = product.price * Number(quantity);
      if (Number(money_received) < total_price)
        return res
          .status(400)
          .json({ status: "ERROR", message: "Not enough money" });

      // update stock
      slot.quantity -= Number(quantity);

      // create transaction
      const id = await getNextId("transactions");
      const trx = new Transaction(
        id,
        slot.id,
        product.id,
        Number(quantity),
        total_price,
        Number(money_received),
        new Date().toISOString()
      );

      data.transactions.push({
        id: trx.id,
        slot_id: trx.slot_id,
        product_id: trx.product_id,
        quantity: trx.quantity,
        total_price: trx.total_price,
        money_received: trx.money_received,
        created_at: trx.created_at,
      });
      await writeData(data);

      const change = Number(money_received) - total_price;
      res.status(201).json(
        new OK({
          message: "Transaction created",
          metadata: { transaction: trx, change },
        })
      );
    } catch (err) {
      next(err);
    }
  };
}

export default new TransactionController();
