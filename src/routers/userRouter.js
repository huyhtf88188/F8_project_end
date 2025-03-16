import express from "express";
import {
  getAllUsers,
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
  forgotPassword,
  resetPassword,
  getProfile,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validateIdMongo } from "../middlewares/validateIdMongo.js";

const userRouter = express.Router();

userRouter.get("/", protect, getAllUsers); // Chỉ Admin mới có quyền
userRouter.get("/profile", protect, getProfile);
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.put("/profile", protect, updateUser);
userRouter.post("/forgot-password", protect, forgotPassword); // Xóa dấu / thừa
userRouter.post("/reset-password", protect, resetPassword); // Xóa dấu / thừa
userRouter.delete("/:id", protect, validateIdMongo, deleteUser); // Thêm validateIdMongo nếu cần

export default userRouter;
