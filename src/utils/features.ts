import mongoose from "mongoose";
import { InvalidateCacheProps } from "../types/types.js";
import { Product } from "../models/products.js";
import { myCache } from "../app.js";

export const connectDB = () => {
  mongoose
    .connect("mongodb://0.0.0.0:27017", {
      dbName: "Ecommerce_24",
    })
    .then((c) => console.log(`DB Connected to ${c.connection.host}`))
    .catch((e) => console.log("Db connection Failed", e));
};

export const invalidateCache = async ({
  product,
  order,
  admin,
}: InvalidateCacheProps) => {
  if (product) {
    const productKeys: string[] = [
      "latest-product",
      "categories",
      "all-products",
    ];

    const products = await Product.find({}).select("_id");

    products.forEach((i) => {
      productKeys.push(`product-${i._id}`);
    });

    myCache.del(productKeys);
  } else if (order) {
    return "order";
  } else if (admin) {
    return "admin";
  }
};
