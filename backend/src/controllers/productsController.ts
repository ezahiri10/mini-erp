import { Request, Response } from "express";
import { prisma } from "../utils/prisma";

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch products" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) return res.status(404).json({ message: "Product not found" });

    return res.json(product);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch product" });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, type, price, description } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        type, // "product" | "service"
        price: Number(price),
        description,
      },
    });

    return res.status(201).json({ message: "Product created", product });
  } catch (error) {
    return res.status(500).json({ error: "Failed to create product" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { name, type, price, description } = req.body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        type,
        price: Number(price),
        description,
      },
    });

    return res.json({ message: "Product updated", product });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update product" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    await prisma.product.delete({ where: { id } });

    return res.json({ message: "Product deleted" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete product" });
  }
};
