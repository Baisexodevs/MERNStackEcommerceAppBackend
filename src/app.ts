import express from "express";


// Importing Routes
import userRoute from "./routes/user.js";
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";

const port = 4000;
connectDB();
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("This is working! api/v1/user");
});

// using Routes
app.use("/api/v1/user", userRoute);

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
