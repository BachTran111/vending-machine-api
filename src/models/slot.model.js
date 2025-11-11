// class Slot {
//   constructor(id, product_id, quantity = 0) {
//     this.id = id;
//     this.product_id = product_id;
//     this.quantity = quantity;
//   }
// }

// export default Slot;

import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const connection = mongoose.connection;
const AutoIncrement = AutoIncrementFactory(connection);

const slotSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },
    quantity: { type: Number, default: 0 },
  },
  { timestamps: true }
);

slotSchema.plugin(AutoIncrement, { inc_field: "id", start_seq: 1 });

const SlotModel = mongoose.model("Slot", slotSchema);
export default SlotModel;
