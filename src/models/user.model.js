// class User {
//   constructor(id, username, password, role = "USER") {
//     this.id = id;
//     this.username = username;
//     this.password = password; 
//     this.role = role;
//   }
// }

// export default User;

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "USER" },
});

const UserModel = mongoose.model("User", userSchema);
export default UserModel;