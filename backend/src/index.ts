import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.routes";
import destinationRoutes from "./routes/destinations.routes";
import blogRoutes from "./routes/blog.routes";
import bookingRoutes from "./routes/bookings.routes";
import reviewRoutes from "./routes/reviews.routes";
import adminRoutes from "./routes/admin.routes";

const app = express();
const PORT = process.env.PORT || 4000;

// CORS
const allowedOrigins = (
  process.env.CORS_ORIGIN || "http://localhost:3000"
).split(",").map((o) => o.trim());
const corsOrigins = [
  ...allowedOrigins,
  /\.vercel\.app$/,
  /^https:\/\/traveme\.(vercel\.app|onrender\.com)$/,
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const match = corsOrigins.some((o) =>
        typeof o === "string" ? o === origin : o.test(origin)
      );
      if (match) return callback(null, true);
      callback(null, false);
    },
    credentials: true,
  })
);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files - uploads directory
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
