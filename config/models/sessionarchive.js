const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const SessionArchive = sequelize.define(
    "sessionArchive",
    {
      sessionId: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ipAddress: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      userAgent: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      isBot: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      archivedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      archivedReason: {
        type: DataTypes.ENUM(
          "expired_30_days",
          "manual_cleanup",
          "force_logout",
          "security_lock"
        ),
        defaultValue: "expired_30_days",
      },
    },
    {
      tableName: "SESSION_ARCHIVE",
      timestamps: true,
      indexes: [{ fields: ["userId"] }, { fields: ["archivedAt"] }],
    }
  );

  return SessionArchive;
};
