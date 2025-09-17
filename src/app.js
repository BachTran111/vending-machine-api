import express from "express";
import cors from "cors";
import morgan from "morgan";

import authRouter from "./routes/auth.route.js";
import productRouter from "./routes/product.route.js";
import slotRouter from "./routes/slot.route.js";
import transactionRouter from "./routes/transaction.route.js";
import { errorHandler } from "./middlewares/error-handler.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(morgan("dev"));

// routes
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/slots", slotRouter);
app.use("/api/transactions", transactionRouter);

app.get("/", (req, res) => res.send("🚀 Vending Machine API running..."));

// error handler (cuối cùng)
app.use(errorHandler);

// start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

export default app;
