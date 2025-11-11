import SlotModel from "../models/slot.model.js";
import ProductModel from "../models/product.model.js";

class SlotService {
  async getAll() {
    return SlotModel.find().populate("product").lean();
  }

  async getById(id) {
    if (!id) return null;
    return isNaN(id)
      ? SlotModel.findById(id).populate("product").lean()
      : SlotModel.findOne({ id: Number(id) })
          .populate("product")
          .lean();
  }

  async create(product_id = null, quantity = 0) {
    let product = null;

    if (product_id) {
      if (isNaN(product_id)) {
        product = await ProductModel.findById(product_id);
      } else {
        product = await ProductModel.findOne({ id: Number(product_id) });
      }
      if (!product) throw new Error("Product not found");
    }

    const s = await SlotModel.create({
      product: product ? product._id : null,
      quantity: Number(quantity) || 0,
    });

    return s.toObject();
  }

  async update(id, { product_id, quantity }) {
    const slot = isNaN(id)
      ? await SlotModel.findById(id)
      : await SlotModel.findOne({ id: Number(id) });

    if (!slot) return null;

    if (product_id != null) {
      let product = null;
      if (isNaN(product_id)) {
        product = await ProductModel.findById(product_id);
      } else {
        product = await ProductModel.findOne({ id: Number(product_id) });
      }
      if (!product) throw new Error("product_id not found");
      slot.product = product._id;
    }

    if (quantity != null) slot.quantity = Number(quantity);
    await slot.save();
    return slot.toObject();
  }

  async remove(id) {
    return isNaN(id)
      ? await SlotModel.findByIdAndDelete(id).lean()
      : await SlotModel.findOneAndDelete({ id: Number(id) }).lean();
  }
}

export default new SlotService();
