const { DataTypes } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const user = sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      countrycode: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING(15),
        unique: true,
        allowNull: true,
      },
      project: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      pwd: {
        type: DataTypes.STRING(255),
        allowNull: true, // if using google login only
      },
      google_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      role: {
        type: DataTypes.ENUM("user", "admin"),
        defaultValue: "user",
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
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
      tableName: "USER",
      timestamps: true,
    }
  );
  return user;
};
