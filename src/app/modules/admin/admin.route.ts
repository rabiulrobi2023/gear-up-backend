import { Router } from "express";
import { AdminController } from "./admin.controller";
import auth from "../../middlewares/auth";
import { Role } from "../../../../generated/prisma/enums";

const router = Router();
router.post("/category", auth(Role.ADMIN), AdminController.createCategory);
router.get("/users", auth(Role.ADMIN), AdminController.getAllUsers);

export const adminRouter = router;
