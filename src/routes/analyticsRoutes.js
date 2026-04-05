import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { allowRoles } from "../middlewares/roleMiddleware.js";
import { getSummaryController } from "../controllers/analyticsController.js";

const router = express.Router();

router.get(
  "/summary",
  authMiddleware,
  allowRoles("admin", "analyst", "viewer"), // Allow all roles to view their own summary
  getSummaryController,
);

export default router;
