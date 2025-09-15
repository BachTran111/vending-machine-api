import { readData, writeData, getNextId } from "../utils/fileDb.js";
import { OK } from "../handler/success-response.js";
import Transaction from "../models/transaction.model.js";

class TransactionController {
  deposit = async (req, res, next) => {
    try {
      const { amount } = req.body;
      if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
        return res.status(400).json({
          status: "ERROR",
          message: "Amount must be a positive number",
        });
      }
      const data = await readData();
      data.currentMoney = (data.currentMoney || 0) + Number(amount);
      await writeData(data);
      res.status(200).json(
        new OK({
          message: "Money deposited",
          metadata: { currentMoney: data.currentMoney },
        })
      );
    } catch (err) {
      next(err);
    }
  };

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
      const { slot_id, quantity = 1 } = req.body;
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

      if ((data.currentMoney || 0) < total_price)
        return res
          .status(400)
          .json({ status: "ERROR", message: "Not enough money in machine" });

      // update stock
      slot.quantity -= Number(quantity);

      // update currentMoney
      data.currentMoney -= total_price;

      // create transaction
      const id = await getNextId("transactions");
      const trx = new Transaction(
        id,
        slot.id,
        product.id,
        Number(quantity),
        total_price,
        total_price, // money_received = total_price (vì lấy từ currentMoney)
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

      res.status(201).json(
        new OK({
          message: "Transaction created",
          metadata: { transaction: trx, currentMoney: data.currentMoney },
        })
      );
    } catch (err) {
      next(err);
    }
  };
}

export default new TransactionController();
