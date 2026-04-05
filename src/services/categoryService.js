import { supabase } from "../config/supabase.js";

/* =====================================================
   CREATE CATEGORY
===================================================== */
export const createCategoryService = async (categoryData) => {
  try {
    const { name, type } = categoryData;

    const { data, error } = await supabase
      .from("categories")
      .insert([{ name, type }])
      .select()
      .single();

    if (error) {
      return { success: false, message: error.message };
    }

    return {
      success: true,
      message: "Category created successfully",
      data,
    };
  } catch (err) {
    return { success: false, message: err.message };
  }
};

/* =====================================================
   GET USER CATEGORIES
===================================================== */
export const getCategoriesService = async () => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, type")
      .order("name", { ascending: true });

    if (error) {
      return { success: false, message: error.message };
    }

    return {
      success: true,
      message: "Categories fetched successfully",
      data,
    };
  } catch (err) {
    return { success: false, message: err.message };
  }
};

/* =====================================================
   UPDATE CATEGORY
===================================================== */
export const updateCategoryService = async (categoryId, updates) => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .update(updates)
      .eq("id", categoryId)
      .select()
      .single();

    if (error) {
      return { success: false, message: error.message };
    }

    return {
      success: true,
      message: "Category updated successfully",
      data,
    };
  } catch (err) {
    return { success: false, message: err.message };
  }
};

/* =====================================================
   DELETE CATEGORY
===================================================== */
export const deleteCategoryService = async (categoryId) => {
  try {
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", categoryId);

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: "Category deleted successfully" };
  } catch (err) {
    return { success: false, message: err.message };
  }
};
