import { getDB, verifyToken } from "./_db.js";
import { Parser } from "json2csv";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    verifyToken(req);
    const db = await getDB();
    const [rows] = await db.execute("SELECT * FROM charter_members");
    if (!rows.length) return res.json({ message: "No members to export." });

    const parser = new Parser({ fields: Object.keys(rows[0]) });
    const csv = parser.parse(rows);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=charter_members.csv");
    res.send(csv);
  } catch {
    res.status(401).json({ message: "Unauthorized" });
  }
}
