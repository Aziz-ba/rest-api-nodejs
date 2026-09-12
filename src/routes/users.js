const { Router } = require("express");
const { User, Post } = require("../models");
const { authenticate } = require("../middleware/auth");

const router = new Router();
const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);

// GET /users/me — the authenticated user's profile.
router.get("/users/me", authenticate, wrap(async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    include: [{ model: Post, as: "posts", attributes: ["id", "title"] }],
  });
  if (!user) return res.sendStatus(404);
  res.json(user);
}));

// GET /users — public list (no password exposed).
router.get("/users", wrap(async (req, res) => {
  const users = await User.findAll({ attributes: ["id", "firstname", "lastname", "email"] });
  res.json(users);
}));

// GET /users/:id
router.get("/users/:id", wrap(async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    include: [{ model: Post, as: "posts", attributes: ["id", "title"] }],
  });
  if (!user) return res.sendStatus(404);
  res.json(user);
}));

module.exports = router;
