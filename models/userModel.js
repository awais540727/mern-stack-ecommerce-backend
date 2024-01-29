import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      requied: true,
      trim: true,
    },
    email: {
      type: String,
      requied: true,
    },
    password: {
      type: String,
      requied: true,
    },
    answer: {
      type: String,
      requied: true,
    },
    phone: {
      type: String,
      requied: true,
    },
    address: {
      type: String,
      requied: true,
    },
    role: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("users", userSchema);
