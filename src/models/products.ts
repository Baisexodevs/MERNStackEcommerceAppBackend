import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide name"],
    },
    photo: {
      type: String,
      required: [true, "Please provide product photo"],
    },
    price: {
      type: Number,
      required: [true, "Please enter the product price"],
    },
    stock: {
      type: Number,
      required: [true, "Please enter the product stock"],
    },
    category: {
      type: String,
      required: [true, "Please enter the category"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model("Product", schema);
