import mongoose from "mongoose";

const machineSchema = new mongoose.Schema({
  currentMoney: { type: Number, default: 0 },
});

const MachineModel = mongoose.model("Machine", machineSchema);
export default MachineModel;
