import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { allowRoles } from "../middlewares/roleMiddleware.js";

import {
  getDashboardController,
  getFilteredAnalysisController,
  getStatsController,
  getYearlyController,
  getTopExpensesController,
  getCategoryTrendController,
  getSpikesController,
  getRatioController,
  getRecentController,
  getRawDataController,
  downloadRawDataController,
} from "../controllers/analyticsController.js";

const router = express.Router();

/* ================= DASHBOARD ================= */
router.get(
  "/dashboard",
  authMiddleware,
  allowRoles("viewer", "analyst", "admin"),
  getDashboardController,
);

/*==================Raw Data======================= */
router.get(
  "/analysis/raw",
  authMiddleware,
  allowRoles("analyst"),
  getRawDataController,
);

/* ==============Export & Download CSV================== */

router.get(
  "/analysis/download",
  authMiddleware,
  allowRoles("analyst"),
  downloadRawDataController,
);

/* ================= ANALYST ONLY ================= */
router.get(
  "/analysis/advanced",
  authMiddleware,
  allowRoles("analyst"),
  getFilteredAnalysisController,
);

router.get(
  "/analysis/stats",
  authMiddleware,
  allowRoles("analyst"),
  getStatsController,
);

router.get(
  "/analysis/yearly",
  authMiddleware,
  allowRoles("analyst"),
  getYearlyController,
);

router.get(
  "/analysis/top-expenses",
  authMiddleware,
  allowRoles("analyst"),
  getTopExpensesController,
);

router.get(
  "/analysis/category-trend",
  authMiddleware,
  allowRoles("analyst"),
  getCategoryTrendController,
);

router.get(
  "/analysis/spikes",
  authMiddleware,
  allowRoles("analyst"),
  getSpikesController,
);

router.get(
  "/analysis/ratio",
  authMiddleware,
  allowRoles("analyst"),
  getRatioController,
);

router.get(
  "/analysis/recent",
  authMiddleware,
  allowRoles("analyst"),
  getRecentController,
);

export default router;
