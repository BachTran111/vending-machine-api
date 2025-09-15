import User from "./models/user.model.js";
import Product from "./models/product.model.js";
import Slot from "./models/slot.model.js";
import Transaction from "./models/transaction.model.js";

export const users = [
  new User(1, "admin", "123456", "ADMIN"),
  new User(2, "guest", "123456", "USER"),
];

export const products = [
  new Product(1, "Coca Cola", 15000),
  new Product(2, "Pepsi", 14000),
  new Product(3, "Snack", 10000),
];

export const slots = [
  new Slot(1, 1, 10),
  new Slot(2, 2, 8),
  new Slot(3, 3, 15),
];

export const transactions = [
  // để trống, sẽ push khi có giao dịch
];
