import { readData, writeData, getNextId } from "../utils/fileDb.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const SECRET = "super_secret_key"; // TODO: đưa vào biến môi trường

class AuthService {
  async register(username, password, role = "USER") {
    const data = await readData();

    const exists = data.users.find((u) => u.username === username);
    if (exists) throw new Error("Username already exists");

    const hashed = await bcrypt.hash(password, 10);
    const id = await getNextId("users");

    const user = new User(id, username, hashed, role);
    data.users.push(user);
    await writeData(data);

    return { id: user.id, username: user.username, role: user.role };
  }

  async login(username, password) {
    const data = await readData();
    const user = data.users.find((u) => u.username === username);
    if (!user) throw new Error("Invalid username or password");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid username or password");

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET, {
      expiresIn: "1h",
    });

    return { token, role: user.role };
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, SECRET);
    } catch {
      throw new Error("Invalid or expired token");
    }
  }
}

export default new AuthService();
