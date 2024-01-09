import express from "express";
import { newProduct } from "../controllers/Product.js";
import { singleUpload } from "../middlewares/multer.js";
import { adminOnly } from "../middlewares/auth.js";
const app = express.Router();
// route - /api/v1/user/new
app.post("/new", adminOnly, singleUpload, newProduct);
export default app;
