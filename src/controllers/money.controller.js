import moneyService from "../services/money.service.js";
import transactionService from "../services/transaction.service.js";
import { OK } from "../handler/success-response.js";

class MoneyController {
  // upload = async (req, res) => {
  //   try {
  //     if (!req.file) throw new Error("No image uploaded");

  //     const { amount, confident } = req.body;

  //     const money = await moneyService.create({
  //       image: req.file.path,
  //       amount,
  //       confident,
  //     });

  //     res.status(201).json(
  //       new OK({
  //         message: "Image uploaded successfully",
  //         metadata: { money },
  //       })
  //     );
  //   } catch (err) {
  //     res.status(400).json({
  //       status: "ERROR",
  //       message: err.message || "Upload failed",
  //     });
  //   }
  // };

  upload = async (req, res) => {
    try {
      if (!req.file) throw new Error("No image uploaded");

      const { amount, confident } = req.body;
      const amt = Number(amount);
      if (isNaN(amt) || amt <= 0) throw new Error("Invalid amount");

      // Lưu bản ghi tiền nhận 
      const money = await moneyService.create({
        image: req.file.path,
        amount: amt,
        confident,
      });

      const newTotal = await transactionService.deposit(amt);

      res.status(201).json(
        new OK({
          message: "Image uploaded successfully",
          metadata: {
            money,
            currentMoney: newTotal,
          },
        })
      );
    } catch (err) {
      console.error(err);
      res.status(400).json({
        status: "ERROR",
        message: err.message || "Upload failed",
      });
    }
  };

  getAll = async (req, res) => {
    try {
      const list = await moneyService.getAll();
      res.status(200).json(new OK({ metadata: { list } }));
    } catch (err) {
      res.status(400).json({ status: "ERROR", message: err.message });
    }
  };

  getById = async (req, res) => {
    try {
      const { id } = req.params;
      const money = await moneyService.getById(id);
      res.status(200).json(new OK({ metadata: { money } }));
    } catch (err) {
      res.status(404).json({ status: "ERROR", message: err.message });
    }
  };
}

export default new MoneyController();
