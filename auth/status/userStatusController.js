const db = require("../../config/db_mysql");

const userStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute(
      `SELECT id, name, email, role, isActive FROM users WHERE id = ?`,
      [id]
    );
    const user = rows[0];

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Could not fetch status" });
  }
};

module.exports = userStatusController;
