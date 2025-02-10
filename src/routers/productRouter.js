import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controllers/productController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validateIdMongo } from "../middlewares/validateIdMongo.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", validateIdMongo, getProductById);
router.post("/", protect, createProduct);
router.put("/:id", protect, validateIdMongo, updateProduct);
router.delete("/:id", protect, validateIdMongo, deleteProduct);

export default router;
