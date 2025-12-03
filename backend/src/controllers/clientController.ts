import { Request, Response } from "express";
import prisma from "../utils/prisma.ts";
import { generateToken, verifyToken } from "../utils/jwt.ts";
import { comparePassword } from "../utils/hash.ts";

// ============= AUTHENTICATION =============

export const clientLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, role: true, password: true },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check if user is a CLIENT
    if (user.role !== "CLIENT") {
      return res.status(403).json({ error: "This portal is for clients only" });
    }

    // Password verification using bcrypt
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Client login error:", error);
    return res.status(500).json({ error: "Login failed" });
  }
};

// ============= CLAIMS =============

export const getClientClaims = async (req: Request, res: Response) => {
  try {
    const clientId = (req as any).clientId;
    if (!clientId) return res.status(401).json({ error: "Unauthorized" });

    const { page = 1, limit = 10, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { clientId };
    if (status) where.status = status;

    const [claims, total] = await Promise.all([
      prisma.claim.findMany({
        where,
        include: {
          assignedUser: { select: { id: true, name: true, email: true } },
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
    console.error("Get client claims error:", error);
    return res.status(500).json({ error: "Failed to fetch claims" });
  }
};

export const getClientClaimById = async (req: Request, res: Response) => {
  try {
    const clientId = (req as any).clientId;
    const { id } = req.params;

    if (!clientId) return res.status(401).json({ error: "Unauthorized" });

    const claim = await prisma.claim.findUnique({
      where: { id },
      include: {
        assignedUser: { select: { id: true, name: true, email: true } },
        comments: {
          include: { author: { select: { id: true, name: true, email: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!claim) return res.status(404).json({ error: "Claim not found" });

    // Verify claim belongs to client
    if (claim.clientId !== clientId) {
      return res.status(403).json({ error: "Access denied" });
    }

    return res.json(claim);
  } catch (error) {
    console.error("Get client claim error:", error);
    return res.status(500).json({ error: "Failed to fetch claim" });
  }
};

export const createClientClaim = async (req: Request, res: Response) => {
  try {
    const clientId = (req as any).clientId;
    const { title, description } = req.body;

    if (!clientId) return res.status(401).json({ error: "Unauthorized" });

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const claim = await prisma.claim.create({
      data: {
        title,
        description: description || "",
        clientId,
        status: "SUBMITTED",
        files: [],
      },
      include: {
        comments: true,
        assignedUser: { select: { id: true, name: true } },
      },
    });

    return res.status(201).json({
      message: "Claim created successfully",
      claim,
    });
  } catch (error) {
    console.error("Create claim error:", error);
    return res.status(500).json({ error: "Failed to create claim" });
  }
};

export const uploadClaimFiles = async (req: Request, res: Response) => {
  try {
    const clientId = (req as any).clientId;
    const { id: claimId } = req.params;

    if (!clientId) return res.status(401).json({ error: "Unauthorized" });

    const claim = await prisma.claim.findUnique({ where: { id: claimId } });

    if (!claim) return res.status(404).json({ error: "Claim not found" });

    if (claim.clientId !== clientId) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Check if files were uploaded
    const files = (req as any).files || [];
    if (files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    // Build file paths relative to the uploads directory
    const filePaths = files.map((file: any) => `claims/${claimId}/${file.filename}`);

    // Update claim with new files
    const updatedClaim = await prisma.claim.update({
      where: { id: claimId },
      data: {
        files: {
          push: filePaths,
        },
      },
      include: {
        comments: true,
        assignedUser: { select: { id: true, name: true } },
      },
    });

    return res.json({
      message: "Files uploaded successfully",
      claim: updatedClaim,
      uploadedFiles: filePaths,
    });
  } catch (error) {
    console.error("Upload claim files error:", error);
    return res.status(500).json({ error: "Failed to upload files" });
  }
};

export const removeClaimFile = async (req: Request, res: Response) => {
  try {
    const clientId = (req as any).clientId;
    const { id: claimId } = req.params;
    const { filePath } = req.body;

    if (!clientId) return res.status(401).json({ error: "Unauthorized" });

    if (!filePath) {
      return res.status(400).json({ error: "File path is required" });
    }

    const claim = await prisma.claim.findUnique({ where: { id: claimId } });

    if (!claim) return res.status(404).json({ error: "Claim not found" });

    if (claim.clientId !== clientId) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Remove file from the files array
    const updatedFiles = claim.files.filter((f: string) => f !== filePath);

    const updatedClaim = await prisma.claim.update({
      where: { id: claimId },
      data: { files: updatedFiles },
      include: {
        comments: true,
        assignedUser: { select: { id: true, name: true } },
      },
    });

    return res.json({
      message: "File removed successfully",
      claim: updatedClaim,
    });
  } catch (error) {
    console.error("Remove claim file error:", error);
    return res.status(500).json({ error: "Failed to remove file" });
  }
};

export const addClaimComment = async (req: Request, res: Response) => {
  try {
    const clientId = (req as any).clientId;
    const { id: claimId } = req.params;
    const { text } = req.body;

    if (!clientId) return res.status(401).json({ error: "Unauthorized" });

    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "Comment text is required" });
    }

    const claim = await prisma.claim.findUnique({ where: { id: claimId } });

    if (!claim) return res.status(404).json({ error: "Claim not found" });

    if (claim.clientId !== clientId) {
      return res.status(403).json({ error: "Access denied" });
    }

    const comment = await prisma.comment.create({
      data: {
        text,
        authorId: clientId,
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

// ============= PRODUCTS =============

export const getClientProducts = async (req: Request, res: Response) => {
  try {
    const clientId = (req as any).clientId;
    if (!clientId) return res.status(401).json({ error: "Unauthorized" });

    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: { clientId },
        select: {
          id: true,
          name: true,
          type: true,
          price: true,
          description: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: Number(limit),
      }),
      prisma.product.count({ where: { clientId } }),
    ]);

    return res.json({
      products,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Get client products error:", error);
    return res.status(500).json({ error: "Failed to fetch products" });
  }
};

export const getClientProductById = async (req: Request, res: Response) => {
  try {
    const clientId = (req as any).clientId;
    const { id: productId } = req.params;

    if (!clientId) return res.status(401).json({ error: "Unauthorized" });

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        type: true,
        price: true,
        description: true,
        createdAt: true,
      },
    });

    if (!product) return res.status(404).json({ error: "Product not found" });

    if (product.clientId !== clientId) {
      return res.status(403).json({ error: "Access denied" });
    }

    return res.json(product);
  } catch (error) {
    console.error("Get client product error:", error);
    return res.status(500).json({ error: "Failed to fetch product" });
  }
};

// ============= DASHBOARD STATS =============

export const getClientDashboard = async (req: Request, res: Response) => {
  try {
    const clientId = (req as any).clientId;
    if (!clientId) return res.status(401).json({ error: "Unauthorized" });

    const [totalClaims, claimsByStatus, totalProducts] = await Promise.all([
      prisma.claim.count({ where: { clientId } }),
      prisma.claim.groupBy({
        by: ["status"],
        where: { clientId },
        _count: true,
      }),
      prisma.product.count({ where: { clientId } }),
    ]);

    const statusBreakdown = claimsByStatus.reduce(
      (acc: any, item: any) => {
        acc[item.status] = item._count;
        return acc;
      },
      {}
    );

    return res.json({
      totalClaims,
      totalProducts,
      claimsByStatus: statusBreakdown,
    });
  } catch (error) {
    console.error("Get client dashboard error:", error);
    return res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
};
