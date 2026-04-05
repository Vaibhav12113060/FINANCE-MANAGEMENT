import { supabase } from "../config/supabase.js";

/* ================= DASHBOARD ================= */
export const getDashboardService = async (userId, role) => {
  const { data, error } = await supabase.rpc("get_user_dashboard", {
    p_user_id: userId,
    p_role: role,
  });

  return { success: !error, data };
};

/* =================== Raw Data============================*/

export const getRawDataService = async (
  userId,
  filters = {},
  pagination = {},
) => {
  try {
    const { page = 1, limit = 10, paginate = true } = pagination;

    let query = supabase.from("financial_records").select(
      `
        date,
        type,
        amount,
        notes,
        category:categories ( name ),
        user:users ( name, email )
      `,
      { count: "exact" },
    );

    // Apply filters
    // Note: user_id filter is intentionally omitted for analysts to see all data.
    if (filters.startDate) query = query.gte("date", filters.startDate);
    if (filters.endDate) query = query.lte("date", filters.endDate);
    if (filters.type) query = query.eq("type", filters.type);
    if (filters.categoryId) query = query.eq("category_id", filters.categoryId);

    query = query.order("date", { ascending: false });

    if (paginate) {
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);
    }

    const { data, error, count } = await query;

    if (error) {
      return { success: false, message: error.message, data: null };
    }
    // Flatten the data for a cleaner CSV/JSON output
    const flattenedData = data.map((record) => ({
      date: record.date,
      type: record.type,
      amount: record.amount,
      category: record.category?.name || "N/A",
      notes: record.notes,
      user_name: record.user?.name || "N/A",
      user_email: record.user?.email || "N/A",
    }));

    if (paginate) {
      const totalPages = Math.ceil(count / limit);
      return {
        success: true,
        data: flattenedData,
        pagination: {
          currentPage: page,
          totalPages,
          totalRecords: count,
          limit,
        },
      };
    }

    return { success: true, data: flattenedData };
  } catch (err) {
    return { success: false, message: err.message, data: null };
  }
};

/* ================= FILTERED ANALYSIS ================= */
export const getFilteredAnalysisService = async (userId, role, filters) => {
  const { data, error } = await supabase.rpc("get_advanced_analysis", {
    p_user_id: userId,
    p_role: role,
    p_start_date: filters.startDate || null,
    p_end_date: filters.endDate || null,
    p_type: filters.type || null,
    p_category_id: filters.categoryId || null,
  });

  return { success: !error, data };
};

/* ================= STATS ================= */
export const getStatsService = async (userId, role) => {
  const { data, error } = await supabase.rpc("get_statistics", {
    p_user_id: userId,
    p_role: role,
  });

  return { success: !error, data };
};

/* ================= YEARLY ================= */
export const getYearlyService = async () => {
  const { data, error } = await supabase.rpc("get_yearly_analysis");
  return { success: !error, data };
};

/* ================= TOP EXPENSES ================= */
export const getTopExpensesService = async () => {
  const { data, error } = await supabase.rpc("get_top_expenses");
  return { success: !error, data };
};

/* ================= CATEGORY ================= */
export const getCategoryService = async () => {
  const { data, error } = await supabase.rpc("get_category_analysis");
  return { success: !error, data };
};

/* ================= CATEGORY TREND ================= */
export const getCategoryTrendService = async () => {
  const { data, error } = await supabase.rpc("get_category_trend");
  return { success: !error, data };
};

/* ================= SPIKES ================= */
export const getSpikesService = async () => {
  const { data, error } = await supabase.rpc("get_spikes");
  return { success: !error, data };
};

/* ================= RATIO ================= */
export const getRatioService = async () => {
  const { data, error } = await supabase.rpc("get_ratio");
  return { success: !error, data };
};

/* ================= RECENT ================= */
export const getRecentService = async () => {
  const { data, error } = await supabase.rpc("get_recent_activity");
  return { success: !error, data };
};
