import express from "express";
import productController from "../controllers/product.controller.js";
import { authRequired } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", productController.getAll);
router.get("/:id", productController.getById);
router.post("/", authRequired, productController.create);
router.put("/:id", productController.update);
router.delete("/:id", productController.remove);

export default router;
