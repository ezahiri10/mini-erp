import { Request, Response } from "express";
import { prisma } from "../utils/prisma";

export const getAllClaims = async (req: Request, res: Response) => {
  try {
    const claims = await prisma.claim.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.json(claims);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch claims" });
  }
};

export const getClaimById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    const claim = await prisma.claim.findUnique({ where: { id } });

    if (!claim) return res.status(404).json({ message: "Claim not found" });

    return res.json(claim);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch claim" });
  }
};

export const createClaim = async (req: Request, res: Response) => {
  try {
    const { title, description, status, clientId } = req.body;

    const claim = await prisma.claim.create({
      data: {
        title,
        description,
        status: status || "PENDING",
        clientId,
      },
    });

    return res.status(201).json({ message: "Claim created", claim });
  } catch (error) {
    return res.status(500).json({ error: "Failed to create claim" });
  }
};

export const updateClaim = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    const { title, description, status } = req.body;

    const claim = await prisma.claim.update({
      where: { id },
      data: { title, description, status },
    });

    return res.json({ message: "Claim updated", claim });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update claim" });
  }
};

export const deleteClaim = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    await prisma.claim.delete({ where: { id } });

    return res.json({ message: "Claim deleted" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete claim" });
  }
};
