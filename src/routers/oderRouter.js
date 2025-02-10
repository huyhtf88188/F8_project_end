import express from "express";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
} from "../controllers/oderController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validateIdMongo } from "../middlewares/validateIdMongo.js";

const OderRouter = express.Router();

OderRouter.get("/", protect, getAllOrders); // Lấy tất cả đơn hàng (Admin)
OderRouter.get("/:id", validateIdMongo, getOrderById); // Lấy đơn hàng theo ID
OderRouter.post("/", createOrder); // Tạo đơn hàng mới
OderRouter.put("/:id", validateIdMongo, updateOrder); // Cập nhật đơn hàng
OderRouter.delete("/:id", validateIdMongo, deleteOrder); // Xóa đơn hàng

export default OderRouter;
