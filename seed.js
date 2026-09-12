// Populate the database with sample data: node seed.js
const connection = require("./lib/db");
const User = require("./models/user");
const Post = require("./models/post");

async function seed() {
  await connection.sync({ force: true });
  await User.bulkCreate([
    { firstname: "Ada", lastname: "Lovelace", email: "ada@example.com", password: "secret1" },
    { firstname: "Alan", lastname: "Turing", email: "alan@example.com", password: "secret2" },
  ]);
  await Post.bulkCreate([
    { title: "Hello World", content: "First post!", tags: "intro" },
    { title: "On Data", content: "Pipelines everywhere.", tags: "tech,data" },
  ]);
  console.log("Seeded 2 users and 2 posts.");
  await connection.close();
}

seed();
