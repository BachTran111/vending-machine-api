import { readData, writeData, getNextId } from "../utils/fileDb.js";
import { OK } from "../handler/success-response.js";

class SlotController {
  getAll = async (req, res, next) => {
    try {
      const data = await readData();
      res
        .status(200)
        .json(
          new OK({
            message: "Slots retrieved",
            metadata: { slots: data.slots },
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
      const slot = data.slots.find((s) => s.id === id);
      if (!slot)
        return res
          .status(404)
          .json({ status: "ERROR", message: "Slot not found" });
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
      const newSlot = {
        id,
        product_id: Number(product_id),
        quantity: Number(quantity),
      };
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
      res
        .status(200)
        .json(new OK({ message: "Slot updated", metadata: { slot } }));
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
      res
        .status(200)
        .json(new OK({ message: "Slot deleted", metadata: { slot: removed } }));
    } catch (err) {
      next(err);
    }
  };
}

export default new SlotController();
