const { Sequelize } = require("sequelize");

// SQLite keeps the API zero-config: no external database to install or run.
// Override with DATABASE_URL (e.g. a Postgres/MariaDB URL) in production.
const connection = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, { logging: false })
  : new Sequelize({
      dialect: "sqlite",
      storage: process.env.DB_STORAGE || "database.sqlite",
      logging: false,
    });

module.exports = connection;
