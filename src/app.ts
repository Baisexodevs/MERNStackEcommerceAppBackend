import express from "express";
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";
import NodeCache from "node-cache";


// Importing Routes
import userRoute from "./routes/user.js";
import productRoute from './routes/products.js'

const port = 4000;
connectDB();
export const myCache = new NodeCache();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("This is working! api/v1/user");
});

// using Routes
app.use("/api/v1/user", userRoute);
app.use('/api/v1/product', productRoute)

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
