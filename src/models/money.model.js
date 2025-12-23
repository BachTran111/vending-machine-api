import mongoose from "mongoose";

const moneySchema = new mongoose.Schema(
  {
    image: {
      type: String, 
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    confident: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const MoneyModel = mongoose.model("Money", moneySchema);
export default MoneyModel;
