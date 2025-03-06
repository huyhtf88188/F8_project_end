import { Router } from "express";
import {
  createValueAttribute,
  deleteValueAttribute,
  getValueAttributeById,
  getValueAttributes,
} from "../controllers/valueAttributeController.js";
import { validateIdMongo } from "../middlewares/validateIdMongo.js";
import { protect } from "../middlewares/authMiddleware.js";

const valueAttributeRouter = Router();

valueAttributeRouter.get("/", getValueAttributes); // Lấy danh sách giá trị
valueAttributeRouter.get("/:id", getValueAttributeById); // Lấy danh sách giá trị
valueAttributeRouter.post("/", createValueAttribute); // Tạo giá trị mới
valueAttributeRouter.delete(
  "/:id",
  protect,
  validateIdMongo,
  deleteValueAttribute
);

export default valueAttributeRouter;
