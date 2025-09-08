// jobs/index.js
const deactivateInactiveUsers = require("./job_scripts/deactivateInactiveUsers.job");
const sessionArchiveJob = require("./job_scripts/sessionArchive.job");

const jobs = [
  {
    name: "DeactivateInactiveUsers",
    handler: deactivateInactiveUsers,
    enabled: true,
  },
  {
    name: "SessionArchive",
    handler: sessionArchiveJob,
    enabled: true, // can toggle off if debugging
  },
  // Add more jobs here in future
];

const startAllJobs = () => {
  console.log("[CRON] Starting scheduled jobs...");
  jobs.forEach((job) => {
    job.enabled
      ? (console.log(`[CRON] ✅ Job started: ${job.name}`), job.handler())
      : console.log(`[CRON] ⏸ Job disabled: ${job.name}`);
  });
};

module.exports = { startAllJobs };
