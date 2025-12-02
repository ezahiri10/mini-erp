import { Request, Response } from "express";
import prisma from "../utils/prisma.ts";
import { hashPassword, comparePassword } from "../utils/hash.ts";
import { generateToken } from "../utils/jwt.ts";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // check if user exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: "Email already used" });

    const hashed = await hashPassword(password);

    const user = await prisma.user.create({
      data: { name, email, password: hashed },
    });

    return res.json({ message: "User registered", user });
  } catch (err) {
    return res.status(500).json({ error: "Server error", details: err });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await comparePassword(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken({ id: user.id, role: user.role });

    return res.json({ message: "Login successful", token });
  } catch (err) {
    return res.status(500).json({ error: "Server error", details: err });
  }
};

export const me = async (req: Request, res: Response) => {
  try {
    // added by authMiddleware
    // @ts-ignore
    const user = req.user;

    return res.json({ user });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
};
