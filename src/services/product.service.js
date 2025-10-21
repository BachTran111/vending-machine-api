import { readData, writeData, getNextId } from "../utils/fileDb.js";
import ProductModel from "../models/product.model.js";

// class ProductService {
//   async getAll() {
//     const data = await readData();
//     return data.products.map((p) => new Product(p.id, p.name, p.price));
//   }

//   async getById(id) {
//     const data = await readData();
//     const product = data.products.find((p) => p.id === id);
//     if (!product) return null;
//     return new Product(product.id, product.name, product.price);
//   }

//   async create(name, price) {
//     const data = await readData();
//     if (data.products.some((p) => p.name === name)) {
//       throw new Error("Product name already exists");
//     }

//     const id = await getNextId("products");
//     const newProduct = new Product(id, name, Number(price));
//     data.products.push(newProduct);
//     await writeData(data);

//     return newProduct;
//   }

//   async update(id, { name, price }) {
//     const data = await readData();
//     const product = data.products.find((p) => p.id === id);
//     if (!product) return null;

//     if (name != null) product.name = name;
//     if (price != null) {
//       if (isNaN(Number(price)) || Number(price) <= 0) {
//         throw new Error("Price must be a positive number");
//       }
//       product.price = Number(price);
//     }

//     await writeData(data);
//     return new Product(product.id, product.name, product.price);
//   }

//   async remove(id) {
//     const data = await readData();

//     const used = data.slots.some((s) => s.product_id === id);
//     if (used) throw new Error("Cannot delete product referenced by slot");

//     const idx = data.products.findIndex((p) => p.id === id);
//     if (idx === -1) return null;

//     const [removed] = data.products.splice(idx, 1);
//     await writeData(data);
//     return new Product(removed.id, removed.name, removed.price);
//   }
// }

class ProductService {
  async getAll() {
    return ProductModel.find().lean();
  }

  async getById(id) {
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
    const product = await ProductModel.findByIdAndUpdate(id, upd, {
      new: true,
    }).lean();
    return product;
  }

  async remove(id) {
    const SlotModel = (await import("../models/slot.mongo.js")).default;
    const used = await SlotModel.exists({ product: id });
    if (used) throw new Error("Cannot delete product referenced by slot");
    const removed = await ProductModel.findByIdAndDelete(id).lean();
    return removed;
  }
}

export default new ProductService();
