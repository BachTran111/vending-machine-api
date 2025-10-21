// import { readData, writeData, getNextId } from "../utils/fileDb.js";
import SlotModel from "../models/slot.model.js";
import ProductModel from "../models/product.model.js";

// class SlotService {
//   async getAll() {
//     const data = await readData();
//     return data.slots.map((s) => new Slot(s.id, s.product_id, s.quantity));
//   }

//   async getById(id) {
//     const data = await readData();
//     const s = data.slots.find((s) => s.id === id);
//     if (!s) return null;
//     return new Slot(s.id, s.product_id, s.quantity);
//   }

//   async create(product_id, quantity = 0) {
//     const data = await readData();
//     const productExists = data.products.some(
//       (p) => p.id === Number(product_id)
//     );
//     if (!productExists) throw new Error("product_id not found");

//     const id = await getNextId("slots");
//     const newSlot = new Slot(id, Number(product_id), Number(quantity));
//     data.slots.push(newSlot);
//     await writeData(data);
//     return newSlot;
//   }

//   async update(id, { product_id, quantity }) {
//     const data = await readData();
//     const slot = data.slots.find((s) => s.id === id);
//     if (!slot) return null;

//     if (product_id != null) {
//       const productExists = data.products.some(
//         (p) => p.id === Number(product_id)
//       );
//       if (!productExists) throw new Error("product_id not found");
//       slot.product_id = Number(product_id);
//     }
//     if (quantity != null) slot.quantity = Number(quantity);

//     await writeData(data);
//     return new Slot(slot.id, slot.product_id, slot.quantity);
//   }

//   async remove(id) {
//     const data = await readData();
//     const idx = data.slots.findIndex((s) => s.id === id);
//     if (idx === -1) return null;

//     const [removed] = data.slots.splice(idx, 1);
//     await writeData(data);
//     return new Slot(removed.id, removed.product_id, removed.quantity);
//   }
// }

class SlotService {
  async getAll() {
    return SlotModel.find().populate("product").lean();
  }

  async getById(id) {
    return SlotModel.findById(id).populate("product").lean();
  }

  async create(product_id, quantity = 0) {
    const product = await ProductModel.findById(product_id);
    if (!product) throw new Error("product_id not found");
    const s = await SlotModel.create({
      product: product._id,
      quantity: Number(quantity),
    });
    return s.toObject();
  }

  async update(id, { product_id, quantity }) {
    const slot = await SlotModel.findById(id);
    if (!slot) return null;
    if (product_id != null) {
      const product = await ProductModel.findById(product_id);
      if (!product) throw new Error("product_id not found");
      slot.product = product._id;
    }
    if (quantity != null) slot.quantity = Number(quantity);
    await slot.save();
    return slot.toObject();
  }

  async remove(id) {
    const removed = await SlotModel.findByIdAndDelete(id).lean();
    return removed;
  }
}

export default new SlotService();
