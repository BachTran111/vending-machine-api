import productService from "../services/product.service.js";
import { OK } from "../handler/success-response.js";

class ProductController {
  getAll = async (req, res, next) => {
    try {
      const products = await productService.getAll();
      res
        .status(200)
        .json(
          new OK({ message: "Products retrieved", metadata: { products } })
        );
    } catch (err) {
      next(err);
    }
  };

  getById = async (req, res, next) => {
    try {
      const id = req.params.id;
      const product = await productService.getById(id);
      if (!product) {
        return res
          .status(404)
          .json({ status: "ERROR", message: "Product not found" });
      }
      res
        .status(200)
        .json(new OK({ message: "Product retrieved", metadata: { product } }));
    } catch (err) {
      next(err);
    }
  };

  create = async (req, res, next) => {
    try {
      const { name, price } = req.body;
      if (!name || price == null) {
        return res
          .status(400)
          .json({ status: "ERROR", message: "Name and price required" });
      }
      const product = await productService.create(name, price);
      res
        .status(201)
        .json(new OK({ message: "Product created", metadata: { product } }));
    } catch (err) {
      res.status(400).json({ status: "ERROR", message: err.message });
    }
  };

  update = async (req, res, next) => {
    try {
      const id = req.params.id;
      const { name, price } = req.body;
      const product = await productService.update(id, { name, price });
      if (!product) {
        return res
          .status(404)
          .json({ status: "ERROR", message: "Product not found" });
      }
      res
        .status(200)
        .json(new OK({ message: "Product updated", metadata: { product } }));
    } catch (err) {
      res.status(400).json({ status: "ERROR", message: err.message });
    }
  };

  remove = async (req, res, next) => {
    try {
      const id = req.params.id;
      const product = await productService.remove(id);
      if (!product) {
        return res
          .status(404)
          .json({ status: "ERROR", message: "Product not found" });
      }
      res
        .status(200)
        .json(new OK({ message: "Product deleted", metadata: { product } }));
    } catch (err) {
      res.status(400).json({ status: "ERROR", message: err.message });
    }
  };
}

export default new ProductController();
