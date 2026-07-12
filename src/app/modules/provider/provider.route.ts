import { Router } from "express";
import { ProviderController } from "./provider.controller";
import auth from "../../middlewares/auth";
import { Role } from "../../../../generated/prisma/enums";

const router = Router();
router.post("/gear", auth(Role.PROVIDER), ProviderController.addItem);
router.get("/orders", ProviderController.getMyIncomingOrder);
router.put("/gear/:itemId", auth(Role.PROVIDER), ProviderController.updateItem);
router.delete("/gear/:id", ProviderController.deleteGear);
router.patch("/orders/:id", ProviderController.updateOrderStatus);

export const providerRouter = router;
