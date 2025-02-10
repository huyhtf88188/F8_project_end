import express from "express";
import {
  createOrderDetail,
  deleteOrderDetail,
  getOrderDetailsByOrderId,
  updateOrderDetail,
} from "../controllers/oderDetail.js";

const OderDetailRouter = express.Router();

OderDetailRouter.get("/:orderId", getOrderDetailsByOrderId); // Lấy OrderDetails theo Order ID
OderDetailRouter.post("/", createOrderDetail); // Thêm sản phẩm vào đơn hàng
OderDetailRouter.put("/:id", updateOrderDetail); // Cập nhật OrderDetail
OderDetailRouter.delete("/:id", deleteOrderDetail); // Xóa OrderDetail

export default OderDetailRouter;
