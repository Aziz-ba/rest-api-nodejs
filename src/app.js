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

// Centralized error handler (Sequelize validation/unique -> 400).
app.use((err, req, res, next) => {
  if (err.name && err.name.startsWith("Sequelize")) {
    return res.status(400).json({ error: err.errors ? err.errors.map((e) => e.message) : err.message });
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

// Helper so tests can await a ready DB.
app.ready = connection.sync();

module.exports = app;
