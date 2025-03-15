import { Router } from "express";
import brandRoutes from "./brandRouter.js";
import categoryRoutes from "./categoryRouter.js";
import userRouter from "./userRouter.js";
import OderRouter from "./oderRouter.js";
import variantRouter from "./variantRouter.js";
import attributeRouter from "./attributeRouter.js";
import bannerRouter from "./banerRouter.js";
import productRouter from "./productRouter.js";
import valueAttributeRouter from "./valueAttributeRouter.js";
import cartRouter from "./cartRouter.js";

const routes = Router();
routes.use("/products", productRouter);
routes.use("/brands", brandRoutes);
routes.use("/category", categoryRoutes);
routes.use("/auth", userRouter);
routes.use("/oders", OderRouter);
routes.use("/variant", variantRouter);
routes.use("/attributes", attributeRouter);
routes.use("/banner", bannerRouter);
routes.use("/value-attribute", valueAttributeRouter);
routes.use("/cart", cartRouter);

export default routes;
