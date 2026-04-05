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

// Admin can manage global categories
router.post("/", authMiddleware, allowRoles("admin"), createCategoryController);

router.put(
  "/:id",
  authMiddleware,
  allowRoles("admin"),
  updateCategoryController,
);

router.delete(
  "/:id",
  authMiddleware,
  allowRoles("admin"),
  deleteCategoryController,
);

// All authenticated users can view the list of categories
router.get(
  "/",
  authMiddleware,
  allowRoles("viewer", "analyst", "admin"),
  getCategoriesController,
);

export default router;
