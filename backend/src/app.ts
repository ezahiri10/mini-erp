import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import Routes
import authRoutes from "./routes/authRoutes.ts";
import userRoutes from "./routes/userRoutes.ts";
import leadRoutes from "./routes/leadRoutes.ts";
import claimRoutes from "./routes/claimRoutes.ts";
import productRoutes from "./routes/productRoutes.ts";
import operatorRoutes from "./routes/operatorRoutes.ts";
import clientRoutes from "./routes/clientRoutes.ts";

dotenv.config();

const app = express();

// -----------------------
// Middleware
// -----------------------
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || "http://localhost:3000",
    "http://localhost:3000",
    "http://127.0.0.1:3000"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json()); // parse JSON request bodies
app.use(express.static("uploads")); // Serve uploaded files

// -----------------------
// Routes
// -----------------------
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/claims", claimRoutes);
app.use("/api/products", productRoutes);
app.use("/api/operator", operatorRoutes);
app.use("/api/client", clientRoutes);

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
