import { getDB, verifyToken } from "./_db.js";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const user = verifyToken(req);
    if (user.role !== "superadmin") return res.status(403).json({ message: "Forbidden" });

    const { username, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);

    const db = await getDB();
    await db.execute("INSERT INTO admins (username, password, role) VALUES (?, ?, 'admin')", [username, hashed]);
    res.json({ message: "Admin registered successfully!" });
  } catch {
    res.status(401).json({ message: "Unauthorized" });
  }
}
