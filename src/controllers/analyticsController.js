import {
  getDashboardService,
  getFilteredAnalysisService,
  getStatsService,
  getYearlyService,
  getTopExpensesService,
  getCategoryService,
  getCategoryTrendService,
  getSpikesService,
  getRatioService,
  getRecentService,
  getRawDataService,
} from "../services/analyticsService.js";

/* ================= DASHBOARD ================= */
export const getDashboardController = async (req, res) => {
  try {
    const response = await getDashboardService(req.user.id, req.user.role);
    res.send(response);
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
};

/*===============Raw Data====================== */

export const getRawDataController = async (req, res) => {
  try {
    const { page = 1, limit = 10, ...filters } = req.query;
    const pagination = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      paginate: true,
    };

    const response = await getRawDataService(req.user.id, filters, pagination);

    if (!response.success) {
      return res.status(400).send(response);
    }

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error in getRawDataController:", err);
    return res
      .status(500)
      .send({ success: false, message: "Internal server error" });
  }
};

/* Export & Download*/

import { Parser } from "json2csv";

export const downloadRawDataController = async (req, res) => {
  try {
    const { page, limit, ...filters } = req.query;
    const response = await getRawDataService(req.user.id, filters, {
      paginate: false,
    });

    if (!response.success || !response.data || response.data.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No data found for the specified criteria.",
      });
    }

    const fields = [
      "date",
      "type",
      "amount",
      "category",
      "notes",
      "user_name",
      "user_email",
    ];
    const parser = new Parser({ fields });
    const csv = parser.parse(response.data);

    res.header("Content-Type", "text/csv");
    res.attachment("financial_data.csv");
    return res.send(csv);
  } catch (err) {
    console.error("Error in downloadRawDataController:", err);
    return res
      .status(500)
      .send({ success: false, message: "Failed to generate CSV." });
  }
};

/* ================= FILTERED ANALYSIS ================= */
export const getFilteredAnalysisController = async (req, res) => {
  try {
    const response = await getFilteredAnalysisService(
      req.user.id,
      req.user.role,
      req.query,
    );
    res.send(response);
  } catch (err) {
    res.status(500).send({ success: false });
  }
};

/* ================= STATS ================= */
export const getStatsController = async (req, res) => {
  try {
    const response = await getStatsService(req.user.id, req.user.role);
    res.send(response);
  } catch {
    res.status(500).send({ success: false });
  }
};

/* ================= YEARLY ================= */
export const getYearlyController = async (req, res) => {
  try {
    const response = await getYearlyService();
    res.send(response);
  } catch {
    res.status(500).send({ success: false });
  }
};

/* ================= TOP EXPENSES ================= */
export const getTopExpensesController = async (req, res) => {
  try {
    const response = await getTopExpensesService();
    res.send(response);
  } catch {
    res.status(500).send({ success: false });
  }
};

/* ================= CATEGORY ================= */
export const getCategoryController = async (req, res) => {
  try {
    const response = await getCategoryService();
    res.send(response);
  } catch {
    res.status(500).send({ success: false });
  }
};

/* ================= CATEGORY TREND ================= */
export const getCategoryTrendController = async (req, res) => {
  try {
    const response = await getCategoryTrendService();
    res.send(response);
  } catch {
    res.status(500).send({ success: false });
  }
};

/* ================= SPIKES ================= */
export const getSpikesController = async (req, res) => {
  try {
    const response = await getSpikesService();
    res.send(response);
  } catch {
    res.status(500).send({ success: false });
  }
};

/* ================= RATIO ================= */
export const getRatioController = async (req, res) => {
  try {
    const response = await getRatioService();
    res.send(response);
  } catch {
    res.status(500).send({ success: false });
  }
};

/* ================= RECENT ================= */
export const getRecentController = async (req, res) => {
  try {
    const response = await getRecentService();
    res.send(response);
  } catch {
    res.status(500).send({ success: false });
  }
};
