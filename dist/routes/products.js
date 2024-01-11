import express from "express";
import { deleteProduct, getAdminProducts, getAllCategories, getAllProducts, getLatestProducts, getSingleProduct, newProduct, updateProduct, } from "../controllers/Product.js";
import { singleUpload } from "../middlewares/multer.js";
import { adminOnly } from "../middlewares/auth.js";
const app = express.Router();
//  Create New Product - /api/v1/product/new
app.post("/new", adminOnly, singleUpload, newProduct);
// To get all Products with filters - /api/v1/product/all
app.get('/all', getAllProducts);
// To get last 5 Products - /api/v1/product/latest
app.get("/latest", getLatestProducts);
// To get all categories - /api/v1/product/category
app.get("/category", getAllCategories);
// To get all products - /api/v1/product/admin-products
app.get("/admin-products", getAdminProducts);
// To get, update, delete Product
app
    .route("/:id")
    .get(getSingleProduct)
    .put(singleUpload, updateProduct)
    .delete(deleteProduct);
export default app;
