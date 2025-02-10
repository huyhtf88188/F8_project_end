import express from "express";
import {
  createAttribute,
  deleteAttribute,
  getAllAttributes,
  getAttributeById,
  updateAttribute,
} from "../controllers/attributeController.js";
import { validateIdMongo } from "../middlewares/validateIdMongo.js";
import { protect } from "../middlewares/authMiddleware.js";

const attributeRouter = express.Router();

attributeRouter.get("/", getAllAttributes); // Lấy tất cả thuộc tính
attributeRouter.get("/:id", validateIdMongo, getAttributeById); // Lấy thuộc tính theo ID
attributeRouter.post("/", protect, createAttribute); // Tạo thuộc tính mới
attributeRouter.put("/:id", protect, validateIdMongo, updateAttribute); // Cập nhật thuộc tính
attributeRouter.delete("/:id", protect, validateIdMongo, deleteAttribute); // Xóa thuộc tính

export default attributeRouter;
