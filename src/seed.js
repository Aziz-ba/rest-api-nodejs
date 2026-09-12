// Populate the database with sample data: npm run seed
const { connection, User, Post } = require("./models");

async function seed() {
  await connection.sync({ force: true });
  const ada = await User.create({ firstname: "Ada", lastname: "Lovelace", email: "ada@example.com", password: "secret1" });
  const alan = await User.create({ firstname: "Alan", lastname: "Turing", email: "alan@example.com", password: "secret2" });
  await Post.bulkCreate([
    { title: "Hello World", content: "First post!", tags: "intro", authorId: ada.id },
    { title: "On Computation", content: "Machines that think.", tags: "tech,ai", authorId: alan.id },
    { title: "On Data", content: "Pipelines everywhere.", tags: "tech,data", authorId: ada.id },
  ]);
  console.log("Seeded 2 users and 3 posts. Login with ada@example.com / secret1");
  await connection.close();
}
seed();
