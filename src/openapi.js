// Minimal OpenAPI 3 spec served at /docs via swagger-ui.
module.exports = {
  openapi: "3.0.0",
  info: {
    title: "rest-api-nodejs",
    version: "2.0.0",
    description: "Users, Posts and JWT auth. Register/login, then use the Bearer token to create posts.",
  },
  components: {
    securitySchemes: { bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" } },
  },
  paths: {
    "/auth/register": { post: { summary: "Register + get JWT", tags: ["Auth"] } },
    "/auth/login": { post: { summary: "Login + get JWT", tags: ["Auth"] } },
    "/users": { get: { summary: "List users", tags: ["Users"] } },
    "/users/me": { get: { summary: "Current user (auth)", tags: ["Users"], security: [{ bearerAuth: [] }] } },
    "/users/{id}": { get: { summary: "Get a user with their posts", tags: ["Users"] } },
    "/posts": {
      get: { summary: "List posts (paginated; ?page, ?limit, ?tag, ?q)", tags: ["Posts"] },
      post: { summary: "Create a post (auth)", tags: ["Posts"], security: [{ bearerAuth: [] }] },
    },
    "/posts/{id}": {
      get: { summary: "Get a post", tags: ["Posts"] },
      put: { summary: "Update own post (auth)", tags: ["Posts"], security: [{ bearerAuth: [] }] },
      delete: { summary: "Delete own post (auth)", tags: ["Posts"], security: [{ bearerAuth: [] }] },
    },
  },
};
