import ProductModel from "../models/product.model.js";

class ProductService {
  async getAll() {
    return ProductModel.find().lean();
  }

  async getById(id) {
    if (!id) return null;

    if (!isNaN(id)) {
      return ProductModel.findOne({ product_id: Number(id) }).lean();
    }

    return ProductModel.findById(id).lean();
  }

  async create(name, price) {
    if (await ProductModel.exists({ name })) {
      throw new Error("Product name already exists");
    }

    const p = await ProductModel.create({ name, price: Number(price) });
    return p.toObject();
  }

  async update(id, { name, price }) {
    const upd = {};
    if (name != null) upd.name = name;
    if (price != null) {
      if (isNaN(Number(price)) || Number(price) <= 0)
        throw new Error("Price must be a positive number");
      upd.price = Number(price);
    }

    const product = isNaN(id)
      ? await ProductModel.findByIdAndUpdate(id, upd, { new: true }).lean()
      : await ProductModel.findOneAndUpdate({ product_id: Number(id) }, upd, {
          new: true,
        }).lean();

    return product;
  }

  async remove(id) {
    const SlotModel = (await import("../models/slot.model.js")).default;

    const used = isNaN(id)
      ? await SlotModel.exists({ product: id })
      : await SlotModel.exists({
          product: await ProductModel.findOne({ product_id: Number(id) }),
        });

    if (used) throw new Error("Cannot delete product referenced by slot");

    const removed = isNaN(id)
      ? await ProductModel.findByIdAndDelete(id).lean()
      : await ProductModel.findOneAndDelete({ product_id: Number(id) }).lean();

    return removed;
  }
}

export default new ProductService();
