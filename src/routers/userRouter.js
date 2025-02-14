import express from "express";
import {
  getAllUsers,
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
  forgotPassword,
  resetPassword,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.get("/", protect, getAllUsers); // Chỉ Admin mới có quyền
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.put("/profile/:id", updateUser);
userRouter.post("/forgot-password/", protect, forgotPassword);
userRouter.post("/reset-password/", protect, resetPassword);
userRouter.delete("/:id", protect, deleteUser); // Chỉ Admin mới có quyền

export default userRouter;
