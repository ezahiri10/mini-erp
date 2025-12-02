import { Router } from "express";
import {
  getAllClaims,
  getClaimById,
  createClaim,
  updateClaim,
  deleteClaim,
} from "../controllers/claimsController.ts";

import { authMiddleware } from "../middlewares/authMiddleware.ts";
// import { roleMiddleware } from "../middlewares/roleMiddleware";

const router = Router();

router.get("/", authMiddleware, getAllClaims);
router.get("/:id", authMiddleware, getClaimById);
router.post("/", authMiddleware, createClaim);
router.put("/:id", authMiddleware, updateClaim);
router.delete("/:id", authMiddleware, deleteClaim);

export default router;
