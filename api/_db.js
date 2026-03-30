import mysql from "mysql2/promise";
import jwt from "jsonwebtoken";

export async function getDB() {
  return mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });
}

export function verifyToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) throw new Error("Missing token");
  const token = authHeader.split(" ")[1];
  return jwt.verify(token, process.env.JWT_SECRET);
}
