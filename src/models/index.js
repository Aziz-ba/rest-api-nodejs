const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const connection = require("../db");

class User extends Model {
  // Compare a plaintext password against the stored hash.
  validatePassword(plain) {
    return bcrypt.compare(plain, this.password);
  }
  // Never expose the password hash.
  toJSON() {
    const values = { ...this.get() };
    delete values.password;
    return values;
  }
}

User.init(
  {
    firstname: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true } },
    lastname: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true } },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize: connection,
    modelName: "User",
    hooks: {
      // Hash the password whenever it is set.
      beforeSave: async (user) => {
        if (user.changed("password")) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
  }
);

class Post extends Model {}

Post.init(
  {
    title: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true } },
    content: { type: DataTypes.TEXT, allowNull: false, validate: { notEmpty: true } },
    tags: { type: DataTypes.STRING, allowNull: true }, // e.g. "tech,market"
  },
  { sequelize: connection, modelName: "Post" }
);

// Relationships: a user authors many posts.
User.hasMany(Post, { as: "posts", foreignKey: "authorId", onDelete: "CASCADE" });
Post.belongsTo(User, { as: "author", foreignKey: "authorId" });

module.exports = { connection, User, Post };
