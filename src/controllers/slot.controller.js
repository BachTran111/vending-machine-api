import { readData, writeData, getNextId } from "../utils/fileDb.js";
import { OK } from "../handler/success-response.js";
import Slot from "../models/slot.model.js";

class SlotController {
  getAll = async (req, res, next) => {
    try {
      const data = await readData();
      // Chuyển mỗi slot thành instance của Slot
      const slots = data.slots.map(
        (s) => new Slot(s.id, s.product_id, s.quantity)
      );
      res.status(200).json(
        new OK({
          message: "Slots retrieved",
          metadata: { slots },
        })
      );
    } catch (err) {
      next(err);
    }
  };

  getById = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const data = await readData();
      const s = data.slots.find((s) => s.id === id);
      if (!s)
        return res
          .status(404)
          .json({ status: "ERROR", message: "Slot not found" });
      const slot = new Slot(s.id, s.product_id, s.quantity);
      res
        .status(200)
        .json(new OK({ message: "Slot retrieved", metadata: { slot } }));
    } catch (err) {
      next(err);
    }
  };

  create = async (req, res, next) => {
    try {
      const { product_id, quantity = 0 } = req.body;
      const data = await readData();
      const productExists = data.products.some(
        (p) => p.id === Number(product_id)
      );
      if (!productExists)
        return res
          .status(400)
          .json({ status: "ERROR", message: "product_id not found" });

      const id = await getNextId("slots");
      const newSlot = new Slot(id, Number(product_id), Number(quantity)); // Sử dụng class
      data.slots.push(newSlot);
      await writeData(data);

      res
        .status(201)
        .json(new OK({ message: "Slot created", metadata: { slot: newSlot } }));
    } catch (err) {
      next(err);
    }
  };

  update = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const { product_id, quantity } = req.body;
      const data = await readData();
      const slot = data.slots.find((s) => s.id === id);
      if (!slot)
        return res
          .status(404)
          .json({ status: "ERROR", message: "Slot not found" });

      if (product_id != null) {
        const productExists = data.products.some(
          (p) => p.id === Number(product_id)
        );
        if (!productExists)
          return res
            .status(400)
            .json({ status: "ERROR", message: "product_id not found" });
        slot.product_id = Number(product_id);
      }
      if (quantity != null) slot.quantity = Number(quantity);

      await writeData(data);
      // Trả về instance Slot
      const updatedSlot = new Slot(slot.id, slot.product_id, slot.quantity);
      res
        .status(200)
        .json(
          new OK({ message: "Slot updated", metadata: { slot: updatedSlot } })
        );
    } catch (err) {
      next(err);
    }
  };

  remove = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const data = await readData();
      const idx = data.slots.findIndex((s) => s.id === id);
      if (idx === -1)
        return res
          .status(404)
          .json({ status: "ERROR", message: "Slot not found" });

      const [removed] = data.slots.splice(idx, 1);
      await writeData(data);
      // Trả về instance Slot
      const removedSlot = new Slot(
        removed.id,
        removed.product_id,
        removed.quantity
      );
      res
        .status(200)
        .json(
          new OK({ message: "Slot deleted", metadata: { slot: removedSlot } })
        );
    } catch (err) {
      next(err);
    }
  };
}

export default new SlotController();
