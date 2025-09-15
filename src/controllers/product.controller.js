import { readData, writeData, getNextId } from "../utils/fileDb.js";
import { OK } from "../handler/success-response.js";
import Product from "../models/product.model.js";

class ProductController {
  getAll = async (req, res, next) => {
    try {
      const data = await readData();
      const products = data.products.map(
        (p) => new Product(p.id, p.name, p.price)
      );
      res.status(200).json(
        new OK({
          message: "Products retrieved",
          metadata: { products },
        })
      );
    } catch (err) {
      next(err);
    }
  };

  getById = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const data = await readData();
      const product = data.products.find((p) => p.id === id);
      if (!product)
        return res
          .status(404)
          .json({ status: "ERROR", message: "Product not found" });
      const productInstance = new Product(
        product.id,
        product.name,
        product.price
      );
      res
        .status(200)
        .json(
          new OK({
            message: "Product retrieved",
            metadata: { product: productInstance },
          })
        );
    } catch (err) {
      next(err);
    }
  };

  create = async (req, res, next) => {
    try {
      const { name, price } = req.body;
      if (!name || price == null)
        return res
          .status(400)
          .json({ status: "ERROR", message: "Name and price required" });

      if (isNaN(Number(price)) || Number(price) <= 0)
        return res.status(400).json({
          status: "ERROR",
          message: "Price must be a positive number",
        });

      const data = await readData();
      if (data.products.some((p) => p.name === name))
        return res
          .status(400)
          .json({ status: "ERROR", message: "Product name already exists" });

      const id = await getNextId("products");
      const newProduct = new Product(id, name, Number(price));
      data.products.push({
        id: newProduct.id,
        name: newProduct.name,
        price: newProduct.price,
      });
      await writeData(data);

      res.status(201).json(
        new OK({
          message: "Product created",
          metadata: { product: newProduct },
        })
      );
    } catch (err) {
      next(err);
    }
  };

  update = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const { name, price } = req.body;
      const data = await readData();
      const product = data.products.find((p) => p.id === id);
      if (!product)
        return res
          .status(404)
          .json({ status: "ERROR", message: "Product not found" });

      if (name != null) product.name = name;
      if (price != null) {
        if (isNaN(Number(price)) || Number(price) <= 0)
          return res.status(400).json({
            status: "ERROR",
            message: "Price must be a positive number",
          });
        product.price = Number(price);
      }

      await writeData(data);
      const updatedProduct = new Product(
        product.id,
        product.name,
        product.price
      );
      res
        .status(200)
        .json(
          new OK({
            message: "Product updated",
            metadata: { product: updatedProduct },
          })
        );
    } catch (err) {
      next(err);
    }
  };

  remove = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const data = await readData();

      const used = data.slots.some((s) => s.product_id === id);
      if (used)
        return res.status(400).json({
          status: "ERROR",
          message: "Cannot delete product referenced by slot",
        });

      const idx = data.products.findIndex((p) => p.id === id);
      if (idx === -1)
        return res
          .status(404)
          .json({ status: "ERROR", message: "Product not found" });

      const [removed] = data.products.splice(idx, 1);
      await writeData(data);
      const removedProduct = new Product(
        removed.id,
        removed.name,
        removed.price
      );
      res
        .status(200)
        .json(
          new OK({
            message: "Product deleted",
            metadata: { product: removedProduct },
          })
        );
    } catch (err) {
      next(err);
    }
  };
}

export default new ProductController();
