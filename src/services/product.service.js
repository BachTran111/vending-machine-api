import { readData, writeData, getNextId } from "../utils/fileDb.js";
import Product from "../models/product.model.js";

class ProductService {
  async getAll() {
    const data = await readData();
    return data.products.map((p) => new Product(p.id, p.name, p.price));
  }

  async getById(id) {
    const data = await readData();
    const product = data.products.find((p) => p.id === id);
    if (!product) return null;
    return new Product(product.id, product.name, product.price);
  }

  async create(name, price) {
    const data = await readData();
    if (data.products.some((p) => p.name === name)) {
      throw new Error("Product name already exists");
    }

    const id = await getNextId("products");
    const newProduct = new Product(id, name, Number(price));
    data.products.push(newProduct);
    await writeData(data);

    return newProduct;
  }

  async update(id, { name, price }) {
    const data = await readData();
    const product = data.products.find((p) => p.id === id);
    if (!product) return null;

    if (name != null) product.name = name;
    if (price != null) {
      if (isNaN(Number(price)) || Number(price) <= 0) {
        throw new Error("Price must be a positive number");
      }
      product.price = Number(price);
    }

    await writeData(data);
    return new Product(product.id, product.name, product.price);
  }

  async remove(id) {
    const data = await readData();

    const used = data.slots.some((s) => s.product_id === id);
    if (used) throw new Error("Cannot delete product referenced by slot");

    const idx = data.products.findIndex((p) => p.id === id);
    if (idx === -1) return null;

    const [removed] = data.products.splice(idx, 1);
    await writeData(data);
    return new Product(removed.id, removed.name, removed.price);
  }
}

export default new ProductService();
