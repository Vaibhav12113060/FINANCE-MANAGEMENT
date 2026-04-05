import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// generate token
export const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// hash password
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// compare password
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};
