import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productsController.ts";

import { authMiddleware } from "../middlewares/authMiddleware.ts";
// import { roleMiddleware } from "../middlewares/roleMiddleware";  
// Example: admin only → roleMiddleware("ADMIN")

const router = Router();

router.get("/", authMiddleware, getAllProducts);
router.get("/:id", authMiddleware, getProductById);
router.post("/", authMiddleware, createProduct);
router.put("/:id", authMiddleware, updateProduct);
router.delete("/:id", authMiddleware, deleteProduct);

export default router;
