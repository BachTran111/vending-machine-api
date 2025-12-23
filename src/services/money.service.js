import MoneyModel from "../models/money.model.js";

class MoneyService {
  async create({ image, amount, confident }) {
    if (!image) throw new Error("Image URL is required");

    const money = await MoneyModel.create({
      image,
      amount: Number(amount) || 0,
      confident: Number(confident) || 0,
    });

    return money.toObject();
  }

  async getAll() {
    return await MoneyModel.find().sort({ createdAt: -1 }).lean();
  }

  async getById(id) {
    const money = await MoneyModel.findById(id).lean();
    if (!money) throw new Error("Money record not found");
    return money;
  }
}

export default new MoneyService();
