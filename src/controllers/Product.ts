import { Request } from "express";
import { NewProductRequestBody } from "../types/types.js";
import { TryCatch } from "../middlewares/error.js";
import { Product } from "../models/products.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";

export const newProduct = TryCatch(
  async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
    console.log("Products");

    // const product = await Product.create(req.body);
    const { name, price, stock, category } = req.body;
    console.log({ name, price, stock, category });

    // const photo = req.file?.path;
    const photo = req.file;

    if (!photo) {
      return next(new ErrorHandler("Please upload a photo", 400));
    }
    if (!name || !price || !stock || !category) {
      rm(photo.path, () => {
        console.log("Photo Removed");
      });
      return next(new ErrorHandler("Please Fill All fields", 400));
    }

    await Product.create({
      name,
      price,
      stock,
      category: category.toLowerCase(),
      photo: photo.path,
    });

    return res
      .status(201)
      .json({ success: true, message: "Product Created Successfully" });
  }
);
