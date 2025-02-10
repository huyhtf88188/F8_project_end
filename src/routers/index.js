import { Router } from "express";
import productRoutes from "./productRouter.js";
import brandRoutes from "./brandRouter.js";
import categoryRoutes from "./categoryRouter.js";
import userRouter from "./userRouter.js";
import OderRouter from "./oderRouter.js";
import OderDetailRouter from "./oderDetailRouter.js";
import variantRouter from "./variantRouter.js";
import attributeRouter from "./attributeRouter.js";

const routes = Router();
routes.use("/products", productRoutes);
routes.use("/brand", brandRoutes);
routes.use("/category", categoryRoutes);
routes.use("/auth", userRouter);
routes.use("/oder", OderRouter);
routes.use("/oder_detail", OderDetailRouter);
routes.use("/variant", variantRouter);
routes.use("/attribute", attributeRouter);

export default routes;
