// class Product {
//   constructor(id, name, price) {
//     this.id = id;
//     this.name = name;
//     this.price = price;
//   }
// }

// export default Product;

import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
});

const ProductModel = mongoose.model("Product", productSchema);
export default ProductModel;