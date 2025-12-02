import { Request, Response } from "express";
import prisma from "../utils/prisma.ts";
import { hashPassword } from "../utils/hash.ts";

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
    const id = req.params.id;

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
    const id = req.params.id;
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
    const id = req.params.id;

    await prisma.lead.delete({ where: { id } });

    return res.json({ message: "Lead deleted" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete lead" });
  }
};

export const convertLeadToClient = async (req: Request, res: Response) => {
  try {
    const leadId = req.params.id;

    // Get the lead
    const lead = await prisma.lead.findUnique({ where: { id: leadId } });

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    // Check if a user with this email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: lead.email },
    });

    if (existingUser) {
      return res.status(409).json({ error: "A user with this email already exists" });
    }

    // Generate a temporary password
    const tempPassword = Math.random().toString(36).substring(2, 15);
    const hashedPassword = await hashPassword(tempPassword);

    // Create a new CLIENT user from the lead
    const newClient = await prisma.user.create({
      data: {
        name: lead.name,
        email: lead.email,
        password: hashedPassword,
        role: "CLIENT",
      },
      select: { id: true, name: true, email: true, role: true },
    });

    // Update the lead status to CONVERTED
    await prisma.lead.update({
      where: { id: leadId },
      data: { status: "CONVERTED" },
    });

    return res.json({
      message: "Lead converted to client successfully",
      client: newClient,
      tempPassword, // In production, this should be sent via email, not returned
    });
  } catch (error) {
    console.error("Convert lead to client error:", error);
    return res.status(500).json({ error: "Failed to convert lead to client" });
  }
};

