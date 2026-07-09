import { Router } from "express";
import { ProviderController } from "./provider.controller";
import auth from "../../middlewares/auth";
import { Role } from "../../../../generated/prisma/enums";

const router = Router();
router.post("/gear", auth(Role.PROVIDER), ProviderController.addItem);

export const providerRouter = router;
