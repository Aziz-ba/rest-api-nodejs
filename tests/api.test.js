const request = require("supertest");
const app = require("../src/app");

let token;

beforeAll(async () => {
  await app.ready;
});

describe("Auth", () => {
  test("register returns a user + token, password hidden", async () => {
    const res = await request(app).post("/auth/register").send({
      firstname: "Aziz", lastname: "BENAYED", email: "aziz@example.com", password: "s3cret",
    });
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.password).toBeUndefined();
    token = res.body.token;
  });

  test("duplicate email is rejected (409)", async () => {
    const res = await request(app).post("/auth/register").send({
      firstname: "A", lastname: "B", email: "aziz@example.com", password: "s3cret",
    });
    expect(res.status).toBe(409);
  });

  test("login with wrong password fails (401)", async () => {
    const res = await request(app).post("/auth/login").send({ email: "aziz@example.com", password: "nope" });
    expect(res.status).toBe(401);
  });
});

describe("Posts", () => {
  let postId;

  test("creating a post without a token is rejected (401)", async () => {
    const res = await request(app).post("/posts").send({ title: "x", content: "y" });
    expect(res.status).toBe(401);
  });

  test("authenticated create works and sets the author", async () => {
    const res = await request(app).post("/posts").set("Authorization", `Bearer ${token}`)
      .send({ title: "My post", content: "Hello", tags: "tech,intro" });
    expect(res.status).toBe(201);
    expect(res.body.authorId).toBeDefined();
    postId = res.body.id;
  });

  test("list is paginated and includes the author", async () => {
    const res = await request(app).get("/posts?limit=5&page=1");
    expect(res.status).toBe(200);
    expect(res.body.pagination.limit).toBe(5);
    expect(res.body.data[0].author).toBeDefined();
  });

  test("search by ?q filters results", async () => {
    const res = await request(app).get("/posts?q=My%20post");
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test("another user cannot delete someone else's post (403)", async () => {
    const other = await request(app).post("/auth/register").send({
      firstname: "Eve", lastname: "X", email: "eve@example.com", password: "s3cret",
    });
    const res = await request(app).delete(`/posts/${postId}`).set("Authorization", `Bearer ${other.body.token}`);
    expect(res.status).toBe(403);
  });

  test("owner can delete their post (204)", async () => {
    const res = await request(app).delete(`/posts/${postId}`).set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(204);
  });
});
