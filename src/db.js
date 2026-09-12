const { Sequelize } = require("sequelize");

// SQLite keeps the API zero-config. Tests use an in-memory DB; production can
// point DATABASE_URL at Postgres/MariaDB/etc.
let connection;
if (process.env.NODE_ENV === "test") {
  connection = new Sequelize("sqlite::memory:", { logging: false });
} else if (process.env.DATABASE_URL) {
  connection = new Sequelize(process.env.DATABASE_URL, { logging: false });
} else {
  connection = new Sequelize({
    dialect: "sqlite",
    storage: process.env.DB_STORAGE || "database.sqlite",
    logging: false,
  });
}

module.exports = connection;
