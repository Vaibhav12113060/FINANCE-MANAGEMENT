import express from "express";
import {
  createRecordController,
  getRecordsController,
  updateRecordController,
  deleteRecordController,
} from "../controllers/recordController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { allowRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Admin can create, update, delete records
router.post("/", authMiddleware, allowRoles("admin"), createRecordController);
router.put("/:id", authMiddleware, allowRoles("admin"), updateRecordController);
router.delete(
  "/:id",
  authMiddleware,
  allowRoles("admin"),
  deleteRecordController,
);

// All authenticated users can view their own records
router.get(
  "/",
  authMiddleware,
  allowRoles("viewer", "analyst", "admin"),
  getRecordsController,
);

export default router;
