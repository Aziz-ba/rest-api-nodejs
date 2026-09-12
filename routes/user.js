const { Router } = require("express");
const User = require("../models/user");

const router = new Router();

// Small async wrapper so thrown errors reach the error handler.
const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);

// List users (optionally filtered by query params, e.g. ?firstname=Aziz)
router.get("/users", wrap(async (req, res) => {
  const users = await User.findAll({ where: req.query });
  res.json(users);
}));

// Create a user
router.post("/users", wrap(async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  if (!firstname || !lastname || !email || !password) {
    return res.status(400).json({ error: "firstname, lastname, email and password are required" });
  }
  const user = await User.create({ firstname, lastname, email, password });
  res.status(201).json(user);
}));

// Read one user
router.get("/users/:id", wrap(async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.sendStatus(404);
  res.json(user);
}));

// Update a user
router.put("/users/:id", wrap(async (req, res) => {
  const [updated] = await User.update(req.body, { where: { id: req.params.id } });
  if (!updated) return res.sendStatus(404);
  res.json(await User.findByPk(req.params.id));
}));

// Delete a user
router.delete("/users/:id", wrap(async (req, res) => {
  const deleted = await User.destroy({ where: { id: req.params.id } });
  if (!deleted) return res.sendStatus(404);
  res.sendStatus(204);
}));

module.exports = router;
