import express from "express";
import { deleteUser, getAllUsers, getUser, newUser } from "../controllers/user.js";
import { adminOnly } from "../middlewares/auth.js";
const app = express.Router();
// route - /api/v1/user/new
app.post("/new", newUser);
// Route - /api/v1/user/all
app.get("/all", adminOnly, getAllUsers);
// Route - /api/v1/user/dynamicID
// app.get("/:id", getUser);
// app.get("/:id", deleteUser);
app.route("/:id").get(getUser).delete(adminOnly, deleteUser); //if the route is same then we can use this chaining technique
export default app;
