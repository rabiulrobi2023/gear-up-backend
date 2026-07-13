import { Router } from "express";
import { AdminController } from "./admin.controller";
import auth from "../../middlewares/auth";
import { Role, UserStatus } from "../../../../generated/prisma/enums";
import { PublicController } from "../public/public.controller";

const router = Router();
router.post("/category", auth(Role.ADMIN), AdminController.createCategory);
router.get("/users", auth(Role.ADMIN), AdminController.getAllUsers);
router.get("/gear", auth(Role.ADMIN), PublicController.getAllGear);
router.get("/rentals", auth(Role.ADMIN), AdminController.getAllOrders);
router.patch("/users/:id", auth(Role.ADMIN), AdminController.updateUserStatus);

export const adminRouter = router;
