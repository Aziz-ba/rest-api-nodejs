const express = require("express");
const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");

const { connection } = require("./models");
const openapi = require("./openapi");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const postRoutes = require("./routes/posts");

const app = express();
app.use(express.json());

// Basic protection: rate-limit all requests.
app.use(rateLimit({ windowMs: 60 * 1000, max: 120 }));

app.get("/", (req, res) =>
  res.json({ name: "rest-api-nodejs", version: "2.0.0", docs: "/docs" })
);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapi));

app.use(authRoutes);
app.use(userRoutes);
app.use(postRoutes);

/**
 * Centralized error-handling middleware. Express requires the 4-parameter signature
 * `(err, req, res, next)` to register this as an error handler rather than standard middleware.
 * Maps Sequelize validation and constraint errors to HTTP 400 with error details,
 * and falls back to HTTP 500 for unexpected errors.
 */
app.use((err, req, res, next) => {
  if (err.name?.startsWith("Sequelize")) {
    return res.status(400).json({ error: err.errors ? err.errors.map((e) => e.message) : err.message });
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

/**
 * Synchronize the database models with the database.
 * We attach the resulting promise to the app object so that the server
 * entry point (server.js) and tests can ensure the DB is ready before starting.
 */
app.ready = connection.sync();

module.exports = app;
