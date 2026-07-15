import { Router } from "express";
import { ProviderController } from "./provider.controller";
import auth from "../../middlewares/auth";
import { Role } from "../../../../generated/prisma/enums";
import validationRequest from "../../middlewares/validationRequest";
import {
  addItemValidationSchema,
  updateItemValidationSchema,
  updateOrderStatusSchema,
} from "./provider.validation";

const router = Router();
router.post(
  "/gear",
  auth(Role.PROVIDER),
  validationRequest(addItemValidationSchema),
  ProviderController.addItem,
);
router.get("/orders", ProviderController.getMyIncomingOrder);

router.put(
  "/gear/:itemId",
  auth(Role.PROVIDER),
  validationRequest(updateItemValidationSchema),
  ProviderController.updateItem,
);

router.delete("/gear/:id", ProviderController.deleteGear);

router.patch(
  "/orders/:id",
  auth(Role.PROVIDER),
  validationRequest(updateOrderStatusSchema),
  ProviderController.updateOrderStatus,
);

export const providerRouter = router;
