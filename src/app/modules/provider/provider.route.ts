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

router.get("/my-gears", auth(Role.PROVIDER), ProviderController.getMyGears);

router.get("/orders", auth(Role.PROVIDER), ProviderController.getMyAllOrders);
router.get(
  "/pending-orders",
  auth(Role.PROVIDER),
  ProviderController.getMyPendingOrders,
);

router.put(
  "/gear/:itemId",
  auth(Role.PROVIDER),
  validationRequest(updateItemValidationSchema),
  ProviderController.updateItem,
);

router.patch("/gear/:id", auth(Role.ADMIN), ProviderController.deleteGear);

router.patch(
  "/orders/:id",
  auth(Role.PROVIDER),
  validationRequest(updateOrderStatusSchema),
  ProviderController.updateOrderStatus,
);

router.get(
  "/gear-statistics",
  auth(Role.PROVIDER),
  ProviderController.getProviderItemStatistics,
);

export const providerRouter = router;
