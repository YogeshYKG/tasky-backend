const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const Session = sequelize.define(
    "session",
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
        type: DataTypes.STRING(45), // supports IPv4 + IPv6
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
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "SESSION",
      timestamps: true,
    }
  );

  return Session;
};
