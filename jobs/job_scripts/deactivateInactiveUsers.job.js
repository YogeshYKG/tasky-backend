// jobs/deactivateInactiveUsers.js
const cron = require("node-cron");
const { Op } = require("sequelize");
const db = require("../../config/db_mysql");

const deactivateInactiveUsers = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      const twoMonthsAgo = new Date();
      twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

      const [affectedRows] = await db.user.update(
        { isActive: false },
        {
          where: {
            updatedAt: { [Op.lt]: twoMonthsAgo },
            isActive: true,
          },
        }
      );

      console.log(`[CRON] Deactivated ${affectedRows} inactive users.`);
    } catch (err) {
      console.error("[CRON] Error deactivating users:", err.message);
    }
  });
};

module.exports = deactivateInactiveUsers;
