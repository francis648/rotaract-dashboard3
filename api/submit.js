import { getDB, verifyToken } from "./_db.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // ✅ Verify JWT
    verifyToken(req);

    // ✅ Parse body
    const data = req.body;
    if (!data) {
      return res.status(400).json({ message: "Missing request body" });
    }

    const sql = `
      INSERT INTO charter_members 
      (title, first_name, middle_name, last_name, gender, dob, club_name, email, phone, alt_phone, city, state, postal_code, country)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      data.title, data.first_name, data.middle_name, data.last_name,
      data.gender, data.dob, data.club_name, data.email, data.phone,
      data.alt_phone, data.city, data.state, data.postal_code, data.country
    ];

    const db = await getDB();
    await db.execute(sql, values);

    res.json({ message: "Member submitted successfully!" });
  } catch (err) {
    console.error("Error in submit.js:", err);
    res.status(500).json({ message: "Error submitting member." });
  }
}
