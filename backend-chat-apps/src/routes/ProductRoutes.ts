import { Router } from "express";
import ProductController from "../controllers/ProductController";

const router = Router();

router.get("/", ProductController.index);
router.post("/create", ProductController.create);
router.delete("/delete/:id", ProductController.destroy);

export default router;