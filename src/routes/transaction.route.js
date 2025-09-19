import express from "express";
import transactionController from "../controllers/transaction.controller.js";
import { authRequired } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", authRequired, transactionController.getAll);
router.post("/", transactionController.create);
router.post("/deposit", transactionController.deposit);

export default router;
