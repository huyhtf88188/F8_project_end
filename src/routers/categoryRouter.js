import { Router } from "express";

import { validateIdMongo } from "../middlewares/validateIdMongo.js";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  getCategoryById,
  updateCategory,
} from "../controllers/categoryController.js";

const categoryRoutes = Router();

categoryRoutes.get("/", getAllCategory);
categoryRoutes.get("/:id", validateIdMongo, getCategoryById);
categoryRoutes.post("/", createCategory);
categoryRoutes.patch("/:id", validateIdMongo, updateCategory);
categoryRoutes.delete("/:id", validateIdMongo, deleteCategory);

export default categoryRoutes;
