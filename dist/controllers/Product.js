import { TryCatch } from "../middlewares/error.js";
import { Product } from "../models/products.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";
import { myCache } from "../app.js";
import { invalidateCache } from "../utils/features.js";
export const getAllProducts = TryCatch(async (req, res, next) => {
    const { search, sort, category, price } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    // This is how the skip knowledge works
    // 1, 2, 3, 4, 5, 6, 7, 8
    // 9, 10, 11, 12, 13, 14, 15, 16
    // 17, 18, 19, 20, 21, 22, 23, 24
    const skip = (page - 1) * limit;
    const baseQuery = {
    // price: {
    //   $lte: Number(price),
    // },
    // category,
    };
    if (search)
        baseQuery.name = {
            $regex: search || "",
            $options: "i",
        };
    if (price)
        baseQuery.price = {
            $lte: Number(price),
        };
    if (category)
        baseQuery.category = category;
    const productsPromise = Product.find(baseQuery)
        .sort(sort && { price: sort === "asc" ? 1 : -1 })
        .limit(limit)
        .skip(skip);
    const [products, filteredOnlyProduct] = await Promise.all([
        productsPromise,
        Product.find(baseQuery),
    ]);
    const totalPage = Math.ceil(filteredOnlyProduct.length / limit);
    return res.status(200).json({
        success: true,
        products,
        totalPage,
    });
});
// Revalidate on New, Update, Delete Product & New Order
export const getLatestProducts = TryCatch(async (req, res, next) => {
    let products = [];
    if (myCache.has("latest-product"))
        products = JSON.parse(myCache.get("latest-products"));
    else {
        products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
        myCache.set("latest-products", JSON.stringify(products));
    }
    return res.status(200).json({
        success: true,
        products,
    });
});
// Revalidate on New, Update, Delete Product & New Order
export const getAllCategories = TryCatch(async (req, res, next) => {
    let categories;
    if (myCache.has("categories"))
        categories = JSON.parse(myCache.get("categories"));
    else {
        categories = await Product.distinct("category");
        myCache.set("categories", JSON.stringify(categories));
    }
    return res.status(200).json({
        success: true,
        categories,
    });
});
// Revalidate on New, Update, Delete Product & New Order
export const getAdminProducts = TryCatch(async (req, res, next) => {
    let products;
    if (myCache.has("all-products"))
        products = JSON.parse(myCache.get("all-products"));
    else {
        products = await Product.find({});
        myCache.set("admin-products", JSON.stringify(products));
    }
    return res.status(200).json({
        success: true,
        products,
    });
});
export const getSingleProduct = TryCatch(async (req, res, next) => {
    let product;
    const id = req.params.id;
    if (myCache.has(`product-${id}`)) {
        product = JSON.parse(myCache.get(`product-${id}`));
    }
    else {
        product = await Product.findById(id);
        if (!product)
            return next(new ErrorHandler("Product Not Found", 404));
        myCache.set(`product-${id}`, JSON.stringify(product));
    }
    return res.status(200).json({
        success: true,
        product,
    });
});
export const newProduct = TryCatch(async (req, res, next) => {
    // console.log("Products");
    // const product = await Product.create(req.body);
    const { name, price, stock, category } = req.body;
    // console.log({ name, price, stock, category });
    // const photo = req.file?.path;
    const photo = req.file;
    if (!photo) {
        return next(new ErrorHandler("Please upload a photo", 400));
    }
    if (!name || !price || !stock || !category) {
        rm(photo.path, () => {
            // console.log("Photo Removed");
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
    await invalidateCache({ product: true });
    return res
        .status(201)
        .json({ success: true, message: "Product Created Successfully" });
});
export const updateProduct = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const { name, price, stock, category } = req.body;
    const photo = req.file;
    const product = await Product.findById(id);
    if (!product) {
        return next(new ErrorHandler("Invalid Product Id Or Product Not Found", 404));
    }
    if (photo) {
        rm(product.photo, () => {
            // console.log("Old Photo Removed");
        });
        product.photo = photo.path;
    }
    if (name)
        product.name = name;
    if (price)
        product.price = price;
    if (stock)
        product.stock = stock;
    if (category)
        product.category = category.toLowerCase();
    await product.save();
    await invalidateCache({ product: true, productId: String(product._id) });
    await res.status(200).json({
        success: true,
        message: "Product Updated Successfully",
    });
    return res
        .status(201)
        .json({ success: true, message: "Product Updated Successfully" });
});
export const deleteProduct = TryCatch(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Invalid Product Id Or Product Not Found", 404));
    }
    rm(product.photo, () => {
        // console.log("Product Photo Deleted");
    });
    await Product.deleteOne();
    await invalidateCache({ product: true, productId: String(product._id) });
    return res.status(200).json({
        success: true,
        message: "Product Deleted Successfully",
    });
});
// generate random products
// const generateRandomProducts = async (count: number = 10) => {
//   const products = [];
//   for (let i = 0; i < count; i++) {
//     const product = {
//       name: faker.commerce.productName(),
//       photo: "uploads\\9947a68f-dbd9-4321-a4d1-087f9c49f94a.webp",
//       price: faker.commerce.price({ min: 1500, max: 80000, dec: 0 }),
//       stock: faker.commerce.price({ min: 0, max: 100, dec: 0 }),
//       category: faker.commerce.department(),
//       createdAt: new Date(faker.date.past()),
//       updatedAt: new Date(faker.date.past()),
//       __v: 0,
//     };
//     products.push(product);
//   }
//   await Product.create(products);
//   console.log({ success: true });
// };
// delete the multiple random products
// const deleteRandomsProducts = async (count: Number = 10) => {
//   const products = await Product.find().skip(2);
//   products.forEach(async (product) => {
//     await product.deleteOne();
//   });
//   console.log({ success: true });
// };
// deleteRandomsProducts(75);
// generateRandomProducts(40)
