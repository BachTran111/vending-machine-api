import dotenv from "dotenv";
import mongoose from "mongoose";
import fs from "fs/promises";
import path from "path";

dotenv.config({ silent: true });

const URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  "mongodb://localhost:27017/vending";
const DATA_FILE = path.resolve("src", "data.json");

(async () => {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const data = JSON.parse(raw);
    console.log("Loaded data keys:", Object.keys(data));

    await mongoose.connect(URI, { serverSelectionTimeoutMS: 10000 });
    const db = mongoose.connection.db;

    for (const [collectionName, docs] of Object.entries(data)) {
      if (!Array.isArray(docs)) {
        console.log(`Skip ${collectionName}: not an array`);
        continue;
      }

      const coll = db.collection(collectionName);

      // WARNING: xóa dữ liệu cũ trước khi import — bỏ dòng nếu không muốn
      await coll.deleteMany({});
      console.log(`Cleared collection ${collectionName}`);

      if (docs.length === 0) {
        console.log(`No documents to insert for ${collectionName}`);
        continue;
      }

      // Nếu muốn dùng trường id từ data.json làm _id, uncomment transform below
      // const toInsert = docs.map(d => {
      //   if (d.id !== undefined) { d._id = d.id; delete d.id; }
      //   return d;
      // });

      const toInsert = docs;
      const res = await coll.insertMany(toInsert);
      console.log(
        `Inserted ${res.insertedCount} documents into ${collectionName}`
      );
    }

    await mongoose.disconnect();
    console.log("Migration finished.");
    process.exit(0);
  } catch (err) {
    console.error("Migration error:", err);
    process.exit(1);
  }
})();
