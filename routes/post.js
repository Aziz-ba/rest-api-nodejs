const { Router } = require("express");
const Post = require("../models/post");

const router = new Router();
const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);

// List posts (optionally ?tags=tech)
router.get("/posts", wrap(async (req, res) => {
  const posts = await Post.findAll({ where: req.query });
  res.json(posts);
}));

// Create a post
router.post("/posts", wrap(async (req, res) => {
  const { title, content, tags } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "title and content are required" });
  }
  const post = await Post.create({ title, content, tags });
  res.status(201).json(post);
}));

// Read one post
router.get("/posts/:id", wrap(async (req, res) => {
  const post = await Post.findByPk(req.params.id);
  if (!post) return res.sendStatus(404);
  res.json(post);
}));

// Update a post
router.put("/posts/:id", wrap(async (req, res) => {
  const [updated] = await Post.update(req.body, { where: { id: req.params.id } });
  if (!updated) return res.sendStatus(404);
  res.json(await Post.findByPk(req.params.id));
}));

// Delete a post
router.delete("/posts/:id", wrap(async (req, res) => {
  const deleted = await Post.destroy({ where: { id: req.params.id } });
  if (!deleted) return res.sendStatus(404);
  res.sendStatus(204);
}));

module.exports = router;
