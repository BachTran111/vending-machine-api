import { readData, writeData, getNextId } from "../utils/fileDb.js";
import { OK } from "../handler/success-response.js";

class ProductController {
  getAll = async (req, res, next) => {
    try {
      const data = await readData();
      res
        .status(200)
        .json(
          new OK({
            message: "Products retrieved",
            metadata: { products: data.products },
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
      if (!name || price == null)
        return res
          .status(400)
          .json({ status: "ERROR", message: "Name and price required" });

      const data = await readData();
      const id = await getNextId("products");
      const newProduct = { id, name, price: Number(price) };
      data.products.push(newProduct);
      await writeData(data);

      res
        .status(201)
        .json(
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
      if (price != null) product.price = Number(price);

      await writeData(data);
      res
        .status(200)
        .json(new OK({ message: "Product updated", metadata: { product } }));
    } catch (err) {
      next(err);
    }
  };

  remove = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const data = await readData();

      // kiểm tra slot tham chiếu
      const used = data.slots.some((s) => s.product_id === id);
      if (used)
        return res
          .status(400)
          .json({
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
      res
        .status(200)
        .json(
          new OK({ message: "Product deleted", metadata: { product: removed } })
        );
    } catch (err) {
      next(err);
    }
  };
}

export default new ProductController();
