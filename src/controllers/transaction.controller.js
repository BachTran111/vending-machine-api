import TransactionService from "../services/transaction.service.js";
import { OK } from "../handler/success-response.js";

class TransactionController {
  getCurrentMoney = async (req, res, next) => {
    try {
      const currentMoney = await TransactionService.getCurrentMoney();
      res
        .status(200)
        .json(
          new OK({
            message: "Current machine balance",
            metadata: { currentMoney },
          })
        );
    } catch (err) {
      next(err);
    }
  };

  deposit = async (req, res, next) => {
    try {
      const { amount } = req.body;
      if (!amount || isNaN(Number(amount)) || Number(amount) <= 0)
        return res
          .status(400)
          .json({
            status: "ERROR",
            message: "Amount must be a positive number",
          });

      const currentMoney = await TransactionService.deposit(amount);
      res
        .status(200)
        .json(
          new OK({ message: "Money deposited", metadata: { currentMoney } })
        );
    } catch (err) {
      next(err);
    }
  };

  getAll = async (req, res, next) => {
    try {
      const transactions = await TransactionService.getAll();
      res
        .status(200)
        .json(
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
      const { slot_id, quantity } = req.body;
      if (!slot_id)
        return res
          .status(400)
          .json({ status: "ERROR", message: "slot_id is required" });

      const { trx, currentMoney } = await TransactionService.create(
        slot_id,
        quantity
      );
      res.status(201).json(
        new OK({
          message: "Transaction created",
          metadata: { transaction: trx, currentMoney },
        })
      );
    } catch (err) {
      if (/(not found|stock|money)/i.test(err.message)) {
        return res.status(400).json({ status: "ERROR", message: err.message });
      }
      next(err);
    }
  };
}

export default new TransactionController();
