import { Request, Response } from "express";
import prisma from "../utils/prisma.ts";

// ============= LEADS =============

export const getOperatorLeads = async (req: Request, res: Response) => {
  try {
    const operatorId = (req as any).user?.id;
    if (!operatorId) return res.status(401).json({ error: "Unauthorized" });

    const { page = 1, limit = 10, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { assignedTo: operatorId };
    if (status) where.status = status;

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        include: {
          assignedUser: { select: { id: true, name: true, email: true } },
          comments: { include: { author: { select: { name: true } } } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: Number(limit),
      }),
      prisma.lead.count({ where }),
    ]);

    return res.json({
      leads,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Get operator leads error:", error);
    return res.status(500).json({ error: "Failed to fetch leads" });
  }
};

export const getOperatorLeadById = async (req: Request, res: Response) => {
  try {
    const operatorId = (req as any).user?.id;
    const { id } = req.params;

    if (!operatorId) return res.status(401).json({ error: "Unauthorized" });

    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        assignedUser: { select: { id: true, name: true, email: true } },
        comments: {
          include: { author: { select: { id: true, name: true, email: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!lead) return res.status(404).json({ error: "Lead not found" });

    // Verify operator has access
    if (lead.assignedTo !== operatorId) {
      return res.status(403).json({ error: "Access denied" });
    }

    return res.json(lead);
  } catch (error) {
    console.error("Get operator lead error:", error);
    return res.status(500).json({ error: "Failed to fetch lead" });
  }
};

export const updateLeadStatus = async (req: Request, res: Response) => {
  try {
    const operatorId = (req as any).user?.id;
    const { id } = req.params;
    const { status } = req.body;

    if (!operatorId) return res.status(401).json({ error: "Unauthorized" });

    const lead = await prisma.lead.findUnique({ where: { id } });

    if (!lead) return res.status(404).json({ error: "Lead not found" });

    if (lead.assignedTo !== operatorId) {
      return res.status(403).json({ error: "Access denied" });
    }

    const updatedLead = await prisma.lead.update({
      where: { id },
      data: { status },
      include: {
        assignedUser: { select: { id: true, name: true } },
        comments: true,
      },
    });

    return res.json({
      message: "Lead status updated",
      lead: updatedLead,
    });
  } catch (error) {
    console.error("Update lead status error:", error);
    return res.status(500).json({ error: "Failed to update lead status" });
  }
};

// ============= CLAIMS =============

export const getOperatorClaims = async (req: Request, res: Response) => {
  try {
    const operatorId = (req as any).user?.id;
    if (!operatorId) return res.status(401).json({ error: "Unauthorized" });

    const { page = 1, limit = 10, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { assignedTo: operatorId };
    if (status) where.status = status;

    const [claims, total] = await Promise.all([
      prisma.claim.findMany({
        where,
        include: {
          client: { select: { id: true, name: true, email: true } },
          assignedUser: { select: { id: true, name: true } },
          comments: {
            include: { author: { select: { name: true } } },
            orderBy: { createdAt: "desc" },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: Number(limit),
      }),
      prisma.claim.count({ where }),
    ]);

    return res.json({
      claims,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Get operator claims error:", error);
    return res.status(500).json({ error: "Failed to fetch claims" });
  }
};

export const getOperatorClaimById = async (req: Request, res: Response) => {
  try {
    const operatorId = (req as any).user?.id;
    const { id } = req.params;

    if (!operatorId) return res.status(401).json({ error: "Unauthorized" });

    const claim = await prisma.claim.findUnique({
      where: { id },
      include: {
        client: { select: { id: true, name: true, email: true } },
        assignedUser: { select: { id: true, name: true } },
        comments: {
          include: { author: { select: { id: true, name: true, email: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!claim) return res.status(404).json({ error: "Claim not found" });

    if (claim.assignedTo !== operatorId) {
      return res.status(403).json({ error: "Access denied" });
    }

    return res.json(claim);
  } catch (error) {
    console.error("Get operator claim error:", error);
    return res.status(500).json({ error: "Failed to fetch claim" });
  }
};

export const updateClaimStatus = async (req: Request, res: Response) => {
  try {
    const operatorId = (req as any).user?.id;
    const { id } = req.params;
    const { status } = req.body;

    if (!operatorId) return res.status(401).json({ error: "Unauthorized" });

    const claim = await prisma.claim.findUnique({ where: { id } });

    if (!claim) return res.status(404).json({ error: "Claim not found" });

    if (claim.assignedTo !== operatorId) {
      return res.status(403).json({ error: "Access denied" });
    }

    const updatedClaim = await prisma.claim.update({
      where: { id },
      data: { status },
      include: {
        client: { select: { id: true, name: true } },
        assignedUser: { select: { id: true, name: true } },
        comments: true,
      },
    });

    return res.json({
      message: "Claim status updated",
      claim: updatedClaim,
    });
  } catch (error) {
    console.error("Update claim status error:", error);
    return res.status(500).json({ error: "Failed to update claim status" });
  }
};

// ============= COMMENTS =============

export const addClaimComment = async (req: Request, res: Response) => {
  try {
    const operatorId = (req as any).user?.id;
    const { id: claimId } = req.params;
    const { text } = req.body;

    if (!operatorId) return res.status(401).json({ error: "Unauthorized" });

    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "Comment text is required" });
    }

    const claim = await prisma.claim.findUnique({ where: { id: claimId } });

    if (!claim) return res.status(404).json({ error: "Claim not found" });

    if (claim.assignedTo !== operatorId) {
      return res.status(403).json({ error: "Access denied" });
    }

    const comment = await prisma.comment.create({
      data: {
        text,
        authorId: operatorId,
        claimId,
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
    });

    return res.status(201).json({
      message: "Comment added",
      comment,
    });
  } catch (error) {
    console.error("Add claim comment error:", error);
    return res.status(500).json({ error: "Failed to add comment" });
  }
};

export const addLeadComment = async (req: Request, res: Response) => {
  try {
    const operatorId = (req as any).user?.id;
    const { id: leadId } = req.params;
    const { text } = req.body;

    if (!operatorId) return res.status(401).json({ error: "Unauthorized" });

    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "Comment text is required" });
    }

    const lead = await prisma.lead.findUnique({ where: { id: leadId } });

    if (!lead) return res.status(404).json({ error: "Lead not found" });

    if (lead.assignedTo !== operatorId) {
      return res.status(403).json({ error: "Access denied" });
    }

    const comment = await prisma.comment.create({
      data: {
        text,
        authorId: operatorId,
        leadId,
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
    });

    return res.status(201).json({
      message: "Comment added",
      comment,
    });
  } catch (error) {
    console.error("Add lead comment error:", error);
    return res.status(500).json({ error: "Failed to add comment" });
  }
};

// ============= CLIENTS (assigned clients) =============

export const getOperatorClients = async (req: Request, res: Response) => {
  try {
    const operatorId = (req as any).user?.id;
    if (!operatorId) return res.status(401).json({ error: "Unauthorized" });

    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    // Get clients by getting unique clients from operator's claims and leads
    const claims = await prisma.claim.findMany({
      where: { assignedTo: operatorId },
      select: { clientId: true },
      distinct: ["clientId"],
    });

    const clientIds = claims.map((c) => c.clientId);

    const [clients, total] = await Promise.all([
      prisma.user.findMany({
        where: {
          id: { in: clientIds },
          role: "CLIENT",
        },
        select: {
          id: true,
          name: true,
          email: true,
          status: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: Number(limit),
      }),
      prisma.user.count({
        where: {
          id: { in: clientIds },
          role: "CLIENT",
        },
      }),
    ]);

    return res.json({
      clients,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Get operator clients error:", error);
    return res.status(500).json({ error: "Failed to fetch clients" });
  }
};

export const getOperatorClientById = async (req: Request, res: Response) => {
  try {
    const operatorId = (req as any).user?.id;
    const { id: clientId } = req.params;

    if (!operatorId) return res.status(401).json({ error: "Unauthorized" });

    // Verify operator has access to this client
    const hasClaim = await prisma.claim.findFirst({
      where: {
        assignedTo: operatorId,
        clientId,
      },
    });

    if (!hasClaim) {
      return res.status(403).json({ error: "Access denied" });
    }

    const client = await prisma.user.findUnique({
      where: { id: clientId },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        createdAt: true,
      },
    });

    if (!client) return res.status(404).json({ error: "Client not found" });

    // Get client's claims assigned to this operator
    const claims = await prisma.claim.findMany({
      where: {
        clientId,
        assignedTo: operatorId,
      },
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
      },
    });

    return res.json({
      ...client,
      claims,
    });
  } catch (error) {
    console.error("Get operator client error:", error);
    return res.status(500).json({ error: "Failed to fetch client" });
  }
};

// ============= DASHBOARD STATS =============

export const getOperatorDashboard = async (req: Request, res: Response) => {
  try {
    const operatorId = (req as any).user?.id;
    if (!operatorId) return res.status(401).json({ error: "Unauthorized" });

    const [totalLeads, totalClaims, totalClients, claimsByStatus] =
      await Promise.all([
        prisma.lead.count({ where: { assignedTo: operatorId } }),
        prisma.claim.count({ where: { assignedTo: operatorId } }),
        prisma.claim.findMany({
          where: { assignedTo: operatorId },
          select: { clientId: true },
          distinct: ["clientId"],
        }),
        prisma.claim.groupBy({
          by: ["status"],
          where: { assignedTo: operatorId },
          _count: true,
        }),
      ]);

    const statusBreakdown = claimsByStatus.reduce(
      (acc: any, item: any) => {
        acc[item.status] = item._count;
        return acc;
      },
      {}
    );

    return res.json({
      totalLeads,
      totalClaims,
      totalClients: new Set(totalClients.map((c) => c.clientId)).size,
      claimsByStatus: statusBreakdown,
    });
  } catch (error) {
    console.error("Get operator dashboard error:", error);
    return res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
};
