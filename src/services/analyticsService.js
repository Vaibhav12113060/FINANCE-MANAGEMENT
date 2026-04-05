import { supabase } from "../config/supabase.js";

export const getSummaryService = async (userId) => {
  try {
    // Fetch all records for the user
    const { data: records, error } = await supabase
      .from("financial_records")
      .select("amount, type, categories(name)")
      .eq("user_id", userId);

    if (error) {
      return { success: false, message: error.message };
    }

    // Process the data
    const summary = records.reduce(
      (acc, record) => {
        if (record.type === "income") {
          acc.totalIncome += record.amount;
        } else if (record.type === "expense") {
          acc.totalExpenses += record.amount;
          const categoryName = record.categories?.name || "Uncategorized";
          acc.categoryTotals[categoryName] =
            (acc.categoryTotals[categoryName] || 0) + record.amount;
        }
        return acc;
      },
      {
        totalIncome: 0,
        totalExpenses: 0,
        netBalance: 0,
        categoryTotals: {},
      },
    );

    summary.netBalance = summary.totalIncome - summary.totalExpenses;

    return {
      success: true,
      message: "Analytics summary fetched successfully",
      data: summary,
    };
  } catch (err) {
    return {
      success: false,
      message: "Error in getSummaryService",
      error: err.message,
    };
  }
};
