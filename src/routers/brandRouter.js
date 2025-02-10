import { Router } from "express";
import {
  createBrand,
  deleteBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
} from "../controllers/brandController.js";
import { validateIdMongo } from "../middlewares/validateIdMongo.js";

const brandRoutes = Router();

brandRoutes.get("/", getAllBrands);
brandRoutes.get("/:id", validateIdMongo, getBrandById);
brandRoutes.post("/", createBrand);
brandRoutes.patch("/:id", validateIdMongo, updateBrand);
brandRoutes.delete("/:id", validateIdMongo, deleteBrand);

export default brandRoutes;
