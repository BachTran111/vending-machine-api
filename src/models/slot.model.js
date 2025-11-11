// class Slot {
//   constructor(id, product_id, quantity = 0) {
//     this.id = id;
//     this.product_id = product_id;
//     this.quantity = quantity;
//   }
// }

// export default Slot;

import mongoose from "mongoose";

const slotSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },
    quantity: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const SlotModel = mongoose.model("Slot", slotSchema);
export default SlotModel;
