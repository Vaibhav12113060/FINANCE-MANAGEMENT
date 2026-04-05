import { supabase } from "../config/supabase.js";

// CREATE RECORD
export const createRecordService = async (recordData) => {
  try {
    const { data, error } = await supabase
      .from("financial_records")
      .insert([recordData])
      .select();

    if (error) {
      return { success: false, message: error.message };
    }

    return {
      success: true,
      message: "Record created successfully",
      data,
    };
  } catch (err) {
    return { success: false, message: err.message };
  }
};

// GET USER RECORDS
export const getRecordsService = async (userId, filters = {}) => {
  try {
    let query = supabase
      .from("financial_records")
      .select(
        `
        id,
        amount,
        type,
        date,
        notes,
        categories (
          id,
          name,
          type
        )
      `,
      )
      .eq("user_id", userId); // 🔐 ONLY OWN DATA

    // Apply dynamic filters
    if (filters.type) {
      query = query.eq("type", filters.type);
    }
    if (filters.category_id) {
      query = query.eq("category_id", filters.category_id);
    }
    if (filters.startDate) {
      query = query.gte("date", filters.startDate);
    }
    if (filters.endDate) {
      query = query.lte("date", filters.endDate);
    }

    // Add ordering and execute query
    const { data, error } = await query.order("date", { ascending: false });

    if (error) {
      return { success: false, message: error.message };
    }

    return {
      success: true,
      message: "Records fetched successfully",
      data,
    };
  } catch (err) {
    return { success: false, message: err.message };
  }
};

// UPDATE OWN RECORD ONLY
export const updateRecordService = async (recordId, userId, updates) => {
  try {
    const { data, error } = await supabase
      .from("financial_records")
      .update(updates)
      .eq("id", recordId)
      .eq("user_id", userId) // 🔐 ownership check
      .select();

    if (error) {
      return { success: false, message: error.message };
    }

    return {
      success: true,
      message: "Record updated successfully",
      data,
    };
  } catch (err) {
    return { success: false, message: err.message };
  }
};

// DELETE OWN RECORD ONLY
export const deleteRecordService = async (recordId, userId) => {
  try {
    const { data, error } = await supabase
      .from("financial_records")
      .delete()
      .eq("id", recordId)
      .eq("user_id", userId); // 🔐 ownership check

    if (error) {
      return { success: false, message: error.message };
    }

    return {
      success: true,
      message: "Record deleted successfully",
      data,
    };
  } catch (err) {
    return { success: false, message: err.message };
  }
};
