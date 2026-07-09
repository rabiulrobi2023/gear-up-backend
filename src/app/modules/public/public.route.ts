import { Router } from "express";
import { PublicController } from "./public.controller";

const router = Router();

router.get("/gear", PublicController.getAllGear);
router.get("/gear/:id", PublicController.getSingleGear);
router.get("/categories", PublicController.getAllCategories);

export const publicRouter = router;
