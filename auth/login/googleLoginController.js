const db = require("../../config/db_mysql");

const googleLoginController = async (req, res) => {
  try {
    const { google_id, email, name } = req.body;

    if (!google_id || !email) {
      return res
        .status(400)
        .json({ success: false, message: "Missing google_id or email" });
    }

    const [rows] = await db.execute(`SELECT * FROM users WHERE google_id = ?`, [
      google_id,
    ]);
    let user = rows[0];

    if (!user) {
      const [result] = await db.execute(
        `INSERT INTO users (name, email, google_id) VALUES (?, ?, ?)`,
        [name, email, google_id]
      );
      user = { id: result.insertId, name, email, google_id };
    }

    res.json({
      success: true,
      message: "Google login successful",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Google login failed" });
  }
};

module.exports = googleLoginController;
