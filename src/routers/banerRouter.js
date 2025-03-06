import express from "express";
import { validateIdMongo } from "../middlewares/validateIdMongo.js";
import { admin, protect } from "../middlewares/authMiddleware.js";
import {
  createBanner,
  deleteBanner,
  getAllBanners,
} from "../controllers/banner.js";

const bannerRouter = express.Router();

bannerRouter.get("/", protect, admin, getAllBanners);
bannerRouter.post("/", protect, admin, createBanner);
bannerRouter.delete("/:id", protect, admin, validateIdMongo, deleteBanner);

export default bannerRouter;
