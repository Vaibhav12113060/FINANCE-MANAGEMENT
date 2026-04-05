import { supabase } from "../config/supabase.js";

/* =====================================================
   CREATE USER  (always viewer by default)
===================================================== */
export const createUserService = async (userData) => {
  try {
    // 1️⃣ Get default role (viewer)
    const { data: viewerRole, error: roleError } = await supabase
      .from("roles")
      .select("id")
      .eq("name", "viewer")
      .single();

    if (!viewerRole) {
      return {
        success: false,
        message:
          roleError?.message || "Default 'viewer' role not found. Seed roles.",
      };
    }

    // 2️⃣ Insert user
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          name: userData.name,
          email: userData.email.toLowerCase(),
          password_hash: userData.password_hash,
          role_id: viewerRole.id,
          status: "active",
        },
      ])
      .select()
      .single();

    // unique email error
    if (error?.code === "23505") {
      return { success: false, message: "Email already registered" };
    }

    if (error) {
      return { success: false, message: error.message };
    }

    return {
      success: true,
      message: "User created successfully",
      data,
    };
  } catch (err) {
    return { success: false, message: err.message };
  }
};

/* =====================================================
   GET USER BY EMAIL (WITH ROLE JOIN)
===================================================== */
export const getUserByEmailService = async (email) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select(
        `
        id,
        name,
        email,
        password_hash,
        roles:role_id (
          name
        )
      `,
      )
      .eq("email", email.toLowerCase())
      .single();

    // no user found
    if (error?.code === "PGRST116") return null;

    if (error) {
      console.error("getUserByEmail error:", error);
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      role: data.roles?.name || "viewer",
    };
  } catch (err) {
    console.error(err);
    return null;
  }
};

/* =====================================================
   UPDATE USER ROLE (FOR ADMINS)
===================================================== */
export const updateUserRoleService = async (userId, newRoleName) => {
  try {
    // 1. Find the ID of the new role
    const { data: roleData, error: roleError } = await supabase
      .from("roles")
      .select("id")
      .eq("name", newRoleName.toLowerCase())
      .single();

    if (roleError || !roleData) {
      return { success: false, message: `Role '${newRoleName}' not found.` };
    }

    // 2. Update the user's role_id
    const { data: userData, error: userError } = await supabase
      .from("users")
      .update({ role_id: roleData.id })
      .eq("id", userId)
      .select()
      .single();

    // Handle case where user with that ID doesn't exist (returns no rows)
    if (userError?.code === "PGRST116") {
      return { success: false, message: `User with ID '${userId}' not found.` };
    }

    if (userError) {
      return { success: false, message: userError.message };
    }

    return {
      success: true,
      message: `User role updated successfully to '${newRoleName}'.`,
      data: userData,
    };
  } catch (err) {
    return { success: false, message: err.message };
  }
};
