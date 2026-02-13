// lib/jwt.js
import jwt from "jsonwebtoken";

export const signToken = (admin) =>
  jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
