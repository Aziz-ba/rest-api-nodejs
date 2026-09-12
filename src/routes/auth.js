const { Router } = require("express");
const { User } = require("../models");
const { sign } = require("../middleware/auth");

const router = new Router();
const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);

// Register a new user and return a JWT.
router.post("/auth/register", wrap(async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  if (!firstname || !lastname || !email || !password) {
    return res.status(400).json({ error: "firstname, lastname, email and password are required" });
  }
  if (String(password).length < 6) {
    return res.status(400).json({ error: "password must be at least 6 characters" });
  }
  const existing = await User.findOne({ where: { email } });
  if (existing) return res.status(409).json({ error: "email already registered" });

  const user = await User.create({ firstname, lastname, email, password });
  res.status(201).json({ user, token: sign(user) });
}));

// Log in with email + password, return a JWT.
router.post("/auth/login", wrap(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user || !(await user.validatePassword(password || ""))) {
    return res.status(401).json({ error: "invalid credentials" });
  }
  res.json({ user, token: sign(user) });
}));

module.exports = router;
