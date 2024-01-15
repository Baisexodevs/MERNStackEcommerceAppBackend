import express from "express";
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";
import NodeCache from "node-cache";
import { config } from "dotenv";
import morgan from "morgan";
// Importing Routes
import userRoute from "./routes/user.js";
import productRoute from "./routes/products.js";
import orderRoute from "./routes/order.js";
config({
    path: "./.env",
});
const port = process.env.PORT || 4000;
const mongoURI = process.env.MONGO_URI || "";
connectDB();
export const myCache = new NodeCache();
const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.get("/", (req, res) => {
    res.send("This is working! api/v1/user");
});
// using Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);
app.use("/uploads", express.static("uploads"));
app.use(errorMiddleware);
app.listen(port, () => {
    console.log(`Listening on port http://localhost:${port}`);
});
// The unOrganized way
// const controlerA = (req, res) => {
//     res.send('This is user!')
// }
// app.get("/users", controlerA);
// app.get(
//   "/product",
//   (req, res) => {
//     res.send("This is product!");
//   },
//   (req, res) => {
//     res.send("This is product!");
//   }
// );
// const mid = (req, res) => {
//     res.send('This is middleware!')
// }
// app.get('/product', mid,(req, res) => {
//     res.send('This is user!')
// })
