import { Router } from "express";
import { login, me } from "../controllers/authController.ts";
import { authMiddleware } from "../middlewares/authMiddleware.ts";

const router = Router();

// Public routes
router.post("/login", login);

// Protected route
router.get("/me", authMiddleware, me);

export default router;
