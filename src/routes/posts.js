const { Router } = require("express");
const { Op } = require("sequelize");
const { Post, User } = require("../models");
const { authenticate } = require("../middleware/auth");

const router = new Router();
const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);

// Parse ?page & ?limit into safe Sequelize pagination.
function paginate(query) {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  return { limit, offset: (page - 1) * limit, page };
}

// GET /posts — list with pagination, optional ?tag= and ?q= (search title/content).
router.get("/posts", wrap(async (req, res) => {
  const { limit, offset, page } = paginate(req.query);
  const where = {};
  if (req.query.tag) where.tags = { [Op.like]: `%${req.query.tag}%` };
  if (req.query.q) {
    where[Op.or] = [
      { title: { [Op.like]: `%${req.query.q}%` } },
      { content: { [Op.like]: `%${req.query.q}%` } },
    ];
  }
  const { rows, count } = await Post.findAndCountAll({
    where,
    limit,
    offset,
    order: [["createdAt", "DESC"]],
    include: [{ model: User, as: "author", attributes: ["id", "firstname", "lastname"] }],
  });
  res.json({ data: rows, pagination: { page, limit, total: count, pages: Math.ceil(count / limit) } });
}));

// GET /posts/:id
router.get("/posts/:id", wrap(async (req, res) => {
  const post = await Post.findByPk(req.params.id, {
    include: [{ model: User, as: "author", attributes: ["id", "firstname", "lastname"] }],
  });
  if (!post) return res.sendStatus(404);
  res.json(post);
}));

// POST /posts — auth required; author taken from the token.
router.post("/posts", authenticate, wrap(async (req, res) => {
  const { title, content, tags } = req.body;
  if (!title || !content) return res.status(400).json({ error: "title and content are required" });
  const post = await Post.create({ title, content, tags, authorId: req.user.id });
  res.status(201).json(post);
}));

// PUT /posts/:id — auth required; only the author may edit.
router.put("/posts/:id", authenticate, wrap(async (req, res) => {
  const post = await Post.findByPk(req.params.id);
  if (!post) return res.sendStatus(404);
  if (post.authorId !== req.user.id) return res.status(403).json({ error: "not your post" });
  await post.update(req.body);
  res.json(post);
}));

// DELETE /posts/:id — auth required; only the author may delete.
router.delete("/posts/:id", authenticate, wrap(async (req, res) => {
  const post = await Post.findByPk(req.params.id);
  if (!post) return res.sendStatus(404);
  if (post.authorId !== req.user.id) return res.status(403).json({ error: "not your post" });
  await post.destroy();
  res.sendStatus(204);
}));

module.exports = router;
