import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  getVariant,
  softdeleteProduct,
  updateProduct,
} from "../controllers/productController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validateIdMongo } from "../middlewares/validateIdMongo.js";

const productRouter = express.Router();

productRouter.get("/", getAllProducts);
productRouter.get("/:id", validateIdMongo, getProductById);
productRouter.post("/", protect, createProduct);
productRouter.put("/:id", validateIdMongo, protect, updateProduct);
productRouter.delete("/:id", protect, validateIdMongo, deleteProduct);
productRouter.put("/:id", protect, validateIdMongo, softdeleteProduct);
productRouter.get("/get_stock/:id", getVariant);

export default productRouter;
