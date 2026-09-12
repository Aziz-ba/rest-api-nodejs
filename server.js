const express = require("express");
const connection = require("./lib/db");
const UserRouter = require("./routes/user");
const PostRouter = require("./routes/post");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => res.json({ name: "rest-api-nodejs", endpoints: ["/users", "/posts"] }));
app.use(UserRouter);
app.use(PostRouter);

// Centralized error handler (validation errors -> 400).
app.use((err, req, res, next) => {
  if (err.name && err.name.startsWith("Sequelize")) {
    return res.status(400).json({ error: err.message });
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

// Sync schema, then start.
connection.sync().then(() => {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});

module.exports = app;
