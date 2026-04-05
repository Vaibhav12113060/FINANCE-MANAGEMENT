import {
  createUserService,
  getUserByEmailService,
  updateUserRoleService,
} from "../services/userService.js";
import {
  hashPassword,
  comparePassword,
  generateToken,
} from "../utils/authUtils.js";

// REGISTER
export const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await getUserByEmailService(email);
    if (existingUser) {
      return res.status(409).send({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await hashPassword(password);

    const response = await createUserService({
      name,
      email,
      password_hash: hashedPassword,
    });

    if (!response.success) {
      const statusCode = response.message.includes("already registered")
        ? 409
        : 400;
      return res.status(statusCode).send(response);
    }

    return res.status(201).send(response);
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Register error",
      error: err.message,
    });
  }
};

// ================= UPDATE USER ROLE (Admin only) =================
export const updateUserRoleController = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const { role } = req.body;

    if (!role) {
      return res.status(400).send({
        success: false,
        message: "Role name is required in the body",
      });
    }

    const response = await updateUserRoleService(userId, role);

    if (!response.success) {
      // Service layer provides specific messages for "Role not found" or "User not found"
      return res.status(404).send(response);
    }

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Error in updateUserRoleController",
      error: err.message,
    });
  }
};

// LOGIN
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await getUserByEmailService(email);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await comparePassword(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).send({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user);

    return res.status(200).send({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Login error",
      error: err.message,
    });
  }
};
