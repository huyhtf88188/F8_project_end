// Backend: routes/cartRouter.js
import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
} from "../controllers/cartController.js";
import { protect } from "../middlewares/authMiddleware.js";

const cartRouter = express.Router();

// Lấy thông tin giỏ hàng của người dùng
cartRouter.get("/", protect, getCart);

// Thêm sản phẩm vào giỏ hàng
cartRouter.post("/add", protect, addToCart);

// Cập nhật số lượng sản phẩm trong giỏ hàng
cartRouter.patch("/update", protect, updateCartItem);

// Xóa sản phẩm khỏi giỏ hàng
cartRouter.delete("/remove", protect, removeFromCart);

export default cartRouter;
