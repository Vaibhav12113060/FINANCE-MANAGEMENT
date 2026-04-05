import {
  createCategoryService,
  getCategoriesService,
  updateCategoryService,
  deleteCategoryService,
} from "../services/categoryService.js";

/* =====================================================
   CREATE CATEGORY
===================================================== */
export const createCategoryController = async (req, res) => {
  try {
    const { name, type } = req.body;

    if (!req.user?.id) {
      return res.status(401).send({ success: false, message: "Unauthorized" });
    }

    if (!name || !type) {
      return res.status(400).send({
        success: false,
        message: "Category name and type are required",
      });
    }

    if (!["income", "expense"].includes(type)) {
      return res.status(400).send({
        success: false,
        message: "Category type must be 'income' or 'expense'",
      });
    }

    const response = await createCategoryService(req.user.id, { name, type });

    return res.status(response.success ? 201 : 500).send(response);
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in createCategoryController",
      error: error.message,
    });
  }
};

/* =====================================================
   GET USER CATEGORIES
===================================================== */
export const getCategoriesController = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).send({ success: false, message: "Unauthorized" });
    }

    const response = await getCategoriesService(req.user.id);

    return res.status(response.success ? 200 : 500).send(response);
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in getCategoriesController",
      error: error.message,
    });
  }
};

/* =====================================================
   UPDATE CATEGORY
===================================================== */
export const updateCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!req.user?.id) {
      return res.status(401).send({ success: false, message: "Unauthorized" });
    }

    if (!id) {
      return res
        .status(400)
        .send({ success: false, message: "Category ID is required" });
    }

    if (updates.type && !["income", "expense"].includes(updates.type)) {
      return res.status(400).send({
        success: false,
        message: "Category type must be 'income' or 'expense'",
      });
    }

    const response = await updateCategoryService(id, req.user.id, updates);

    return res.status(response.success ? 200 : 404).send(response); // 404 if not found or not owned
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in updateCategoryController",
      error: error.message,
    });
  }
};

/* =====================================================
   DELETE CATEGORY
===================================================== */
export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user?.id) {
      return res.status(401).send({ success: false, message: "Unauthorized" });
    }

    if (!id) {
      return res
        .status(400)
        .send({ success: false, message: "Category ID is required" });
    }

    const response = await deleteCategoryService(id, req.user.id);

    return res.status(response.success ? 200 : 404).send(response); // 404 if not found or not owned
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in deleteCategoryController",
      error: error.message,
    });
  }
};
