import express from "express";
import transactionController from "../controllers/transaction.controller.js";

const router = express.Router();

router.get("/", transactionController.getAll);
router.post("/", transactionController.create);

export default router;
