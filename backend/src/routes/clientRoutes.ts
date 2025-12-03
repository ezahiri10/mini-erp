import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.ts";
import { clientMiddleware } from "../middlewares/clientMiddleware.ts";
import upload from "../config/multer.ts";
import {
  clientLogin,
  getClientClaims,
  getClientClaimById,
  createClientClaim,
  uploadClaimFiles,
  removeClaimFile,
  addClaimComment,
  getClientProducts,
  getClientProductById,
  getClientDashboard,
} from "../controllers/clientController.ts";

const router = express.Router();

// Auth routes (no middleware needed for login)
router.post("/login", clientLogin);

// Protected routes - require authentication and CLIENT role
router.use(authMiddleware, clientMiddleware);

// Dashboard
router.get("/dashboard", getClientDashboard);

// Claims
router.get("/claims", getClientClaims);
router.post("/claims", createClientClaim);
router.get("/claims/:id", getClientClaimById);
router.post("/claims/:id/upload", upload.array("files", 5), uploadClaimFiles);
router.delete("/claims/:id/files", removeClaimFile);
router.post("/claims/:id/comments", addClaimComment);

// Products
router.get("/products", getClientProducts);
router.get("/products/:id", getClientProductById);

export default router;
