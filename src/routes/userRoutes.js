import express from "express";
import {
  registerController,
  loginController,
  updateUserRoleController,
} from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { allowRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);

// Admin can change user roles
router.put(
  "/:id/role",
  authMiddleware,
  allowRoles("admin"),
  updateUserRoleController,
);

export default router;
