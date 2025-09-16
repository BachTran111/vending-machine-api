import slotService from "../services/slot.service.js";
import { OK } from "../handler/success-response.js";

class SlotController {
  getAll = async (req, res, next) => {
    try {
      const slots = await slotService.getAll();
      res
        .status(200)
        .json(new OK({ message: "Slots retrieved", metadata: { slots } }));
    } catch (err) {
      next(err);
    }
  };

  getById = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const slot = await slotService.getById(id);
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
      const { product_id, quantity } = req.body;
      const slot = await slotService.create(product_id, quantity);
      res
        .status(201)
        .json(new OK({ message: "Slot created", metadata: { slot } }));
    } catch (err) {
      res.status(400).json({ status: "ERROR", message: err.message });
    }
  };

  update = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const { product_id, quantity } = req.body;
      const slot = await slotService.update(id, { product_id, quantity });
      if (!slot)
        return res
          .status(404)
          .json({ status: "ERROR", message: "Slot not found" });

      res
        .status(200)
        .json(new OK({ message: "Slot updated", metadata: { slot } }));
    } catch (err) {
      res.status(400).json({ status: "ERROR", message: err.message });
    }
  };

  remove = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const slot = await slotService.remove(id);
      if (!slot)
        return res
          .status(404)
          .json({ status: "ERROR", message: "Slot not found" });

      res
        .status(200)
        .json(new OK({ message: "Slot deleted", metadata: { slot } }));
    } catch (err) {
      next(err);
    }
  };
}

export default new SlotController();
