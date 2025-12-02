import { Request, Response } from "express";
import prisma from "../utils/prisma.ts";

export const getAllLeads = async (req: Request, res: Response) => {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.json(leads);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch leads" });
  }
};

export const getLeadById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    const lead = await prisma.lead.findUnique({ where: { id } });

    if (!lead) return res.status(404).json({ message: "Lead not found" });

    return res.json(lead);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch lead" });
  }
};

export const createLead = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, status, notes } = req.body;

    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        phone,
        status: status || "NEW",
        notes,
      },
    });

    return res.status(201).json({ message: "Lead created", lead });
  } catch (error) {
    return res.status(500).json({ error: "Failed to create lead" });
  }
};

export const updateLead = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { name, email, phone, status, notes } = req.body;

    const lead = await prisma.lead.update({
      where: { id },
      data: { name, email, phone, status, notes },
    });

    return res.json({ message: "Lead updated", lead });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update lead" });
  }
};

export const deleteLead = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    await prisma.lead.delete({ where: { id } });

    return res.json({ message: "Lead deleted" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete lead" });
  }
};
