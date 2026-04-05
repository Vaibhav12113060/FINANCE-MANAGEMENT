import express from "express";
import cors from "cors";
import morgan from "morgan";

import userRoutes from "./routes/userRoutes.js";
import recordRoutes from "./routes/recordRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

export const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/records", recordRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/analytics", analyticsRoutes);

// Test Route
app.get("/", (req, res) => {
  res.status(200).send(" Finance Backend Running");
});
