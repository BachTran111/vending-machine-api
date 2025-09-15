import express from "express";
import slotController from "../controllers/slot.controller.js";

const router = express.Router();

router.get("/", slotController.getAll);
router.get("/:id", slotController.getById);
router.post("/", slotController.create);
router.put("/:id", slotController.update);
router.delete("/:id", slotController.remove);

export default router;
