import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.ts";
import { roleMiddleware } from "../middlewares/roleMiddleware.ts";
import {
  getOperatorLeads,
  getOperatorLeadById,
  updateLeadStatus,
  getOperatorClaims,
  getOperatorClaimById,
  updateClaimStatus,
  addClaimComment,
  addLeadComment,
  getOperatorClients,
  getOperatorClientById,
  getOperatorDashboard,
} from "../controllers/operatorController.ts";

const router = Router();

// Apply auth and role middleware
router.use(authMiddleware);
router.use(roleMiddleware(["OPERATOR"]));

// ============= DASHBOARD =============
router.get("/dashboard", getOperatorDashboard);

// ============= LEADS =============
router.get("/leads", getOperatorLeads);
router.get("/leads/:id", getOperatorLeadById);
router.patch("/leads/:id/status", updateLeadStatus);
router.post("/leads/:id/comments", addLeadComment);

// ============= CLAIMS =============
router.get("/claims", getOperatorClaims);
router.get("/claims/:id", getOperatorClaimById);
router.patch("/claims/:id/status", updateClaimStatus);
router.post("/claims/:id/comments", addClaimComment);

// ============= CLIENTS =============
router.get("/clients", getOperatorClients);
router.get("/clients/:id", getOperatorClientById);

export default router;
