import mongoose from "mongoose";
const { Schema, model } = mongoose;
const userSchema = new Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
    role: { type: String, enum: ["parent", "Tutor"], default: "parent" },
  },
  {
    timestamps: true,
  }
);

export default model("user", userSchema);
