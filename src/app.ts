import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./app/config";
import cookieParser from "cookie-parser";
import router from "./app/router";
import notFoundRoute from "./app/middlewares/notFoundRoute";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import { PaymentController } from "./app/modules/payment/payment.controller";

const app: Application = express();
app.use(
  cors({
    origin: config.FRONTEND_URL,
    credentials: true,
  }),
);

app.post(
  "/api/payments/confirm",
  express.raw({ type: "application/json" }),
  PaymentController.handleStripeWebhook,
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("Gear Up server is running...");
});

app.use("/api", router);
app.use(notFoundRoute);
app.use(globalErrorHandler);

export default app;
