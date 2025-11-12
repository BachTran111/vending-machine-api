import express from "express";
import moneyController from "../controllers/money.controller.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.config.js";

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "vending/money",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 800, crop: "limit" }],
  },
});

const upload = multer({ storage });

router.post("/upload", upload.single("image"), moneyController.upload);
router.get("/", moneyController.getAll);
router.get("/:id", moneyController.getById);

export default router;
