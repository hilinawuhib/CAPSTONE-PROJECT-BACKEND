import mongoose from "mongoose";
const { Schema, model } = mongoose;
const courseSchema = new Schema(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
  },
  {
    content: { type: String, required: true },
    timestamps: true,
  }
);


export default model("course", courseSchema);
