// class Product {
//   constructor(id, name, price) {
//     this.id = id;
//     this.name = name;
//     this.price = price;
//   }
// }

// export default Product;

import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const connection = mongoose.connection;
const AutoIncrement = AutoIncrementFactory(connection);

const productSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  name: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
});

productSchema.plugin(AutoIncrement, { inc_field: "product_id" });

const ProductModel = mongoose.model("Product", productSchema);
export default ProductModel;
