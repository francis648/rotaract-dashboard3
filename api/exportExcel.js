import { getDB, verifyToken } from "./_db.js";
import ExcelJS from "exceljs";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    verifyToken(req);
    const db = await getDB();
    const [rows] = await db.execute("SELECT * FROM charter_members");
    if (!rows.length) return res.json({ message: "No members to export." });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Charter Members");
    worksheet.columns = Object.keys(rows[0]).map(key => ({ header: key, key, width: 20 }));
    rows.forEach(row => worksheet.addRow(row));

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=charter_members.xlsx");
    await workbook.xlsx.write(res);
    res.end();
  } catch {
    res.status(401).json({ message: "Unauthorized" });
  }
}
