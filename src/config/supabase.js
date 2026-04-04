import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Test DB connection
export const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from("roles") // simple table
      .select("*")
      .limit(1);

    if (error) {
      console.error("❌ Supabase connection failed:", error.message);
    } else {
      console.log("✅ Supabase connected successfully");
    }
  } catch (err) {
    console.error("❌ Unexpected error:", err.message);
  }
};
