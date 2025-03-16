import express from "express";

import paymentController from "../controllers/paymentController.js";

const paymentRouter = express.Router();

paymentRouter.post("/", paymentController.payment);
paymentRouter.post("/callback", paymentController.callback);

export default paymentRouter;
