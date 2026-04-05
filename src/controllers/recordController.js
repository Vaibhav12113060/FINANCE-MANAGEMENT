import {
  createRecordService,
  getRecordsService,
  updateRecordService,
  deleteRecordService,
} from "../services/recordService.js";

import { supabase } from "../config/supabase.js";

// ================= CREATE RECORD =================
export const createRecordController = async (req, res) => {
  try {
    const { amount, type, category_id, date, notes } = req.body;

    if (!req.user?.id) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!amount || !type || !category_id || !date) {
      return res.status(400).send({
        success: false,
        message: "Amount, type, category & date are required",
      });
    }

    if (amount <= 0) {
      return res.status(400).send({
        success: false,
        message: "Amount must be greater than 0",
      });
    }

    if (!["income", "expense"].includes(type)) {
      return res.status(400).send({
        success: false,
        message: "Type must be income or expense",
      });
    }

    // 🔐 Check category belongs to logged-in user
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("id", category_id)
      .eq("user_id", req.user.id)
      .single();

    if (!category) {
      return res.status(403).send({
        success: false,
        message: "Invalid category",
      });
    }

    const recordData = {
      user_id: req.user.id,
      amount,
      type,
      category_id,
      date,
      notes,
    };

    const response = await createRecordService(recordData);

    return res.status(response.success ? 201 : 500).send(response);
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in createRecordController",
      error: error.message,
    });
  }
};

// ================= GET RECORDS =================
export const getRecordsController = async (req, res) => {
  try {
    // Pass query params for filtering
    const filters = req.query;
    const response = await getRecordsService(req.user.id, filters);
    return res.status(response.success ? 200 : 500).send(response);
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in getRecordsController",
      error: error.message,
    });
  }
};

// ================= UPDATE RECORD =================
export const updateRecordController = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!id) {
      return res.status(400).send({
        success: false,
        message: "Record ID is required",
      });
    }

    // 🔐 Ownership check
    const { data: record } = await supabase
      .from("financial_records")
      .select("id")
      .eq("id", id)
      .eq("user_id", req.user.id)
      .single();

    if (!record) {
      return res.status(403).send({
        success: false,
        message: "Record not found or unauthorized",
      });
    }

    // ✨ If category is being updated, validate it belongs to the user
    if (updates.category_id) {
      const { data: category } = await supabase
        .from("categories")
        .select("id")
        .eq("id", updates.category_id)
        .eq("user_id", req.user.id)
        .single();

      if (!category) {
        return res.status(403).send({
          success: false,
          message: "Invalid category",
        });
      }
    }

    const response = await updateRecordService(id, req.user.id, updates);
    return res.status(response.success ? 200 : 500).send(response);
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in updateRecordController",
      error: error.message,
    });
  }
};

// ================= DELETE RECORD =================
export const deleteRecordController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send({
        success: false,
        message: "Record ID is required",
      });
    }

    // 🔐 Ownership check
    const { data: record } = await supabase
      .from("financial_records")
      .select("id")
      .eq("id", id)
      .eq("user_id", req.user.id)
      .single();

    if (!record) {
      return res.status(403).send({
        success: false,
        message: "Record not found or unauthorized",
      });
    }

    const response = await deleteRecordService(id, req.user.id);
    return res.status(response.success ? 200 : 500).send(response);
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in deleteRecordController",
      error: error.message,
    });
  }
};
