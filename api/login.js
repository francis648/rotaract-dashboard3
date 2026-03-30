import { getDB } from "./_db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { username, password } = req.body;
  const db = await getDB();
  const [rows] = await db.execute("SELECT * FROM admins WHERE username = ?", [username]);
  if (!rows.length) return res.status(401).json({ message: "Invalid credentials." });

  const match = await bcrypt.compare(password, rows[0].password);
  if (!match) return res.status(401).json({ message: "Invalid credentials." });

  const token = jwt.sign({ id: rows[0].id, role: rows[0].role }, process.env.JWT_SECRET, { expiresIn: "2h" });
  res.json({ message: "Login successful!", role: rows[0].role, token });
}
