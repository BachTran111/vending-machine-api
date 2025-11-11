import express from "express";
import slotController from "../controllers/slot.controller.js";
import { authRequired } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", slotController.getAll);
router.get("/:id", slotController.getById);
router.post("/", authRequired, slotController.create);
router.put("/:id", authRequired, slotController.update);
router.delete("/:id", authRequired, slotController.remove);

export default router;
