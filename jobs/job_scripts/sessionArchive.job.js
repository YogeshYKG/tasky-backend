// jobs/job_scripts/sessionArchive.job.js
const cron = require("node-cron");
const { Op, Sequelize } = require("sequelize");
const db = require("../../config/db_mysql");

const Session = db.session;
const SessionArchive = db.sessionArchive;

const ARCHIVE_REASON = {
  EXPIRED_30_DAYS: "expired_30_days",
  MANUAL: "manual_cleanup",
  FORCE_LOGOUT: "force_logout",
  SECURITY_LOCK: "security_lock",
};

const BATCH_SIZE = 1000; // Adjust based on DB load

const sessionArchiveJob = () => {
  // Run every day at 00:10 AM
  cron.schedule("10 0 * * *", async () => {
    console.log("[CRON][SessionArchive] Job started...");

    const THIRTY_DAYS_AGO = new Date();
    THIRTY_DAYS_AGO.setDate(THIRTY_DAYS_AGO.getDate() - 30);

    try {
      // Step 1: Fetch sessions eligible for archival in batches
      let offset = 0;
      let totalArchived = 0;

      while (true) {
        const sessionsToArchive = await Session.findAll({
          where: {
            expiresAt: { [Op.lt]: THIRTY_DAYS_AGO },
          },
          limit: BATCH_SIZE,
          offset,
          raw: true,
        });

        if (!sessionsToArchive.length) break;

        // Step 2: Prepare bulk insert
        const archiveData = sessionsToArchive.map((s) => ({
          ...s,
          archivedAt: new Date(),
          archivedReason: ARCHIVE_REASON.EXPIRED_30_DAYS,
          createdAt: s.createdAt,
          updatedAt: s.updatedAt,
        }));

        // Step 3: Transaction-safe insert & delete
        await db.sequelize.transaction(async (t) => {
          await SessionArchive.bulkCreate(archiveData, {
            transaction: t,
            ignoreDuplicates: true,
          });

          await Session.destroy({
            where: {
              sessionId: {
                [Op.in]: sessionsToArchive.map((s) => s.sessionId),
              },
            },
            transaction: t,
          });
        });

        totalArchived += sessionsToArchive.length;
        offset += BATCH_SIZE;
        console.log(
          `[CRON][SessionArchive] Archived batch of ${sessionsToArchive.length} sessions.`
        );
      }

      console.log(
        `[CRON][SessionArchive] Job finished. Total archived: ${totalArchived}`
      );
    } catch (err) {
      console.error(
        "[CRON][SessionArchive] Error archiving sessions:",
        err.message
      );
    }
  });
};

module.exports = sessionArchiveJob;
