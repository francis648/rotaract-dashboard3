import { getDB, verifyToken } from "./_db.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    verifyToken(req);
    const db = await getDB();
    const [rows] = await db.execute("SELECT * FROM charter_members");
    res.json(rows);
  } catch {
    res.status(401).json({ message: "Unauthorized" });
  }
}
