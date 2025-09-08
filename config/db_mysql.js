require("dotenv").config();
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME, // database name
  process.env.DB_USER, // username
  process.env.DB_PASS, // password
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    logging: true, // set to console.log for debugging
  }
);

const database = {};
database.sequelize = sequelize;
database.Sequelize = Sequelize;

// Load models
database.user = require("./models/user")(sequelize, Sequelize);
database.session = require("./models/session")(sequelize, Sequelize);
database.sessionArchive = require("./models/sessionarchive")(
  sequelize,
  Sequelize
);

// 🔗 Define associations
database.user.hasMany(database.session, {
  foreignKey: "userId",
  onDelete: "CASCADE", // deletes sessions when user is deleted
});

database.session.belongsTo(database.user, {
  foreignKey: "userId",
});

database.sessionArchive.belongsTo(database.user, {
  foreignKey: "userId",
});

module.exports = database;
