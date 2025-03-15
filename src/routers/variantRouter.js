import express from "express";
import {
  createVariant,
  deleteVariant,
  getAllVariant,
  getVariantsByProductId,
  updateVariant,
} from "../controllers/variantController.js";
import { validateIdMongo } from "../middlewares/validateIdMongo.js";
import { protect } from "../middlewares/authMiddleware.js";

const variantRouter = express.Router();

variantRouter.get("/", protect, getAllVariant);
variantRouter.get("/:productId", protect, getVariantsByProductId); // Lấy tất cả biến thể của một sản phẩm
variantRouter.post("/", protect, createVariant); // Thêm biến thể sản phẩm
variantRouter.put("/:id", protect, validateIdMongo, updateVariant); // Cập nhật biến thể sản phẩm
variantRouter.delete("/:id", protect, validateIdMongo, deleteVariant); // Xóa biến thể sản phẩm

export default variantRouter;
