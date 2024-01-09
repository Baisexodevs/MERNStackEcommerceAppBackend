import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "./error.js";

// middlewares to make sure only the admin is allowed
export const adminOnly = TryCatch(async (req, res, next) => {
  const { id } = req.query;

  if (!id)
    return next(new ErrorHandler("Unauthorized user! Please Login First", 401));

  const user = await User.findById(id);
  if (!user) return next(new ErrorHandler("User not found", 404));
  if (user.role !== "admin")
    return next(new ErrorHandler("Unauthorized user", 401));
  next();
});
