const { Model, DataTypes } = require("sequelize");
const connection = require("../lib/db");

// Post: title (required), content (required), tags (optional, "tech,market").
class Post extends Model {}

Post.init(
  {
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    tags: { type: DataTypes.STRING, allowNull: true },
  },
  { sequelize: connection, modelName: "Post" }
);

module.exports = Post;
