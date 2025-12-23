import express from "express";
import cors from "cors";
import morgan from "morgan";

import instanceMongoDB from "./config/db.config.js";
import authRouter from "./routes/auth.route.js";
import productRouter from "./routes/product.route.js";
import slotRouter from "./routes/slot.route.js";
import transactionRouter from "./routes/transaction.route.js";
import moneyRoute from "./routes/money.route.js";
import { errorHandler } from "./middlewares/error-handler.js";

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(morgan("dev"));

app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/slots", slotRouter);
app.use("/api/transactions", transactionRouter);
app.use("/api/money", moneyRoute);

app.get("/", (req, res) => res.send("🚀 Vending Machine API running..."));

app.use(errorHandler);

(async () => {
  try {
    await instanceMongoDB();
    const PORT = process.env.PORT || 5000;
    app.listen(5000, "0.0.0.0", () => {
      console.log("Server running on http://0.0.0.0:5000");
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
})();

export default app;
