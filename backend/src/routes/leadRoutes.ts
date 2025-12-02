import { Router } from "express";
import {
  getAllLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
} from "../controllers/leadsController.ts";

import { authMiddleware } from "../middlewares/authMiddleware.ts";
// import { roleMiddleware } from "../middlewares/roleMiddleware";  // optional

const router = Router();

router.get("/", authMiddleware, getAllLeads);
router.get("/:id", authMiddleware, getLeadById);
router.post("/", authMiddleware, createLead);
router.put("/:id", authMiddleware, updateLead);
router.delete("/:id", authMiddleware, deleteLead);

export default router;
