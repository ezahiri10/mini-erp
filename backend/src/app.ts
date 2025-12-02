import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import Routes
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import leadRoutes from "./routes/leadRoutes";
import claimRoutes from "./routes/claimRoutes";
import productRoutes from "./routes/productRoutes";

dotenv.config();

const app = express();

// -----------------------
// Middleware
// -----------------------
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json()); // parse JSON request bodies

// -----------------------
// Routes
// -----------------------
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/claims", claimRoutes);
app.use("/api/products", productRoutes);

// -----------------------
// 404 Handler
// -----------------------
app.use((req, res) => {
  res.status(404).json({ message: "API route not found" });
});

// -----------------------
// Error Handler
// -----------------------
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

export default app;
