import express from "express";
import {
  createCategoryController,
  getCategoriesController,
  updateCategoryController,
  deleteCategoryController,
} from "../controllers/categoryController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { allowRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// All authenticated users can manage their own categories
router.post(
  "/",
  authMiddleware,
  allowRoles("viewer", "analyst", "admin"),
  createCategoryController,
);
router.get(
  "/",
  authMiddleware,
  allowRoles("viewer", "analyst", "admin"),
  getCategoriesController,
);
router.put(
  "/:id",
  authMiddleware,
  allowRoles("viewer", "analyst", "admin"),
  updateCategoryController,
);
router.delete(
  "/:id",
  authMiddleware,
  allowRoles("viewer", "analyst", "admin"),
  deleteCategoryController,
);

export default router;
