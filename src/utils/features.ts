import mongoose from "mongoose";
import { InvalidateCacheProps, OrderItemType } from "../types/types.js";
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

// Product
// export const invalidateCache = async ({
//   product,
//   order,
//   admin,
// }: InvalidateCacheProps) => {
//   if (product) {
//     const productKeys: string[] = [
//       "latest-product",
//       "categories",
//       "all-products",
//     ];

//     const products = await Product.find({}).select("_id");

//     products.forEach((i) => {
//       productKeys.push(`product-${i._id}`);
//     });

//     myCache.del(productKeys);
//   } else if (order) {
//     return "order";
//   } else if (admin) {
//     return "admin";
//   }
// };
export const invalidateCache = ({
  product,
  order,
  admin,
  userId,
  orderId,
  productId,
}: InvalidateCacheProps) => {
  if (product) {
    const productKeys: string[] = [
      "latest-products",
      "categories",
      "all-products",
    ];

    if (typeof productId === "string") productKeys.push(`product-${productId}`);

    if (typeof productId === "object")
      productId.forEach((i) => productKeys.push(`product-${i}`));

    myCache.del(productKeys);
  }
  if (order) {
    const ordersKeys: string[] = [
      "all-orders",
      `my-orders-${userId}`,
      `order-${orderId}`,
    ];

    myCache.del(ordersKeys);
  }
  if (admin) {
    myCache.del([
      "admin-stats",
      "admin-pie-charts",
      "admin-bar-charts",
      "admin-line-charts",
    ]);
  }
};

// Orders
export const reduceStock = async (orderItems: OrderItemType[]) => {
  orderItems.forEach(async (order) => {
    const product = await Product.findById(order.productId);
    if (!product) throw new Error("Product Not Found");
    product.stock -= order.quantity;
    await product.save();
  });
};
