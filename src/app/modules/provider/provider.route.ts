import { Router } from "express";
import { ProviderController } from "./provider.controller";
import auth from "../../middlewares/auth";
import { Role } from "../../../../generated/prisma/enums";

const router = Router();
router.post("/gear", auth(Role.PROVIDER), ProviderController.addItem);
router.post("/gear/:itemId", auth(Role.PROVIDER), ProviderController.updateItem);
router.delete("/gear/:id",ProviderController.deleteGear)

export const providerRouter = router;
