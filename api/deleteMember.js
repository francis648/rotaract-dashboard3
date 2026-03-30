import { getDB, verifyToken } from "./_db.js";

export default async function handler(req, res) {
  if (req.method !== "DELETE") return res.status(405).end();

  try {
    verifyToken(req);
    const { id } = req.query;
    const db = await getDB();
    const [result] = await db.execute("DELETE FROM charter_members WHERE id = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Member not found." });
    res.json({ message: "Member deleted successfully!" });
  } catch {
    res.status(401).json({ message: "Unauthorized" });
  }
}
