import { readData, writeData, getNextId } from "../utils/fileDb.js";
import { OK } from "../handler/success-response.js";

class TransactionController {
  getAll = async (req, res, next) => {
    try {
      const data = await readData();
      res
        .status(200)
        .json(
          new OK({
            message: "Transactions retrieved",
            metadata: { transactions: data.transactions },
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
        return res
          .status(400)
          .json({
            status: "ERROR",
            message: "slot_id and money_received are required",
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
        return res
          .status(404)
          .json({
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
      const trx = {
        id,
        slot_id: slot.id,
        product_id: product.id,
        quantity: Number(quantity),
        total_price,
        money_received: Number(money_received),
        created_at: new Date().toISOString(),
      };

      data.transactions.push(trx);
      await writeData(data);

      const change = Number(money_received) - total_price;
      res
        .status(201)
        .json(
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
