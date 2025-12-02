import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/usersController.ts";

import { authMiddleware } from "../middlewares/authMiddleware.ts";
// import { roleMiddleware } from "../middlewares/roleMiddleware"; // optional

const router = Router();

router.get("/", authMiddleware, getAllUsers);
router.get("/:id", authMiddleware, getUserById);
router.put("/:id", authMiddleware, updateUser);

// Admin-only? Uncomment if needed
// router.delete("/:id", authMiddleware, roleMiddleware(["ADMIN"]), deleteUser);

router.delete("/:id", authMiddleware, deleteUser);

export default router;
