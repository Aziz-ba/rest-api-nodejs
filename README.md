# 🔌 REST API - Node.js + Express + Sequelize

A **production-style RESTful API** for a small blogging domain (**Users**, **Posts**, **JWT auth**), built with **Express** and **Sequelize**. It runs on **SQLite out of the box** (no database to install), ships with **automated tests**, **Swagger docs**, and a **Dockerfile**, and swaps to Postgres/MariaDB with one environment variable.

![tests](https://img.shields.io/badge/tests-9%20passing-brightgreen?style=flat-square)
![node](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=nodedotjs&logoColor=white)

---

## ✨ Highlights

- 🔐 **JWT authentication** - `register` / `login`, Bearer-token protected routes
- 🧂 **Password hashing** with bcrypt (hashes are never returned in responses)
- 👤 **Ownership authorization** - you can only edit/delete your **own** posts (`403` otherwise)
- 🔗 **Relations** - `User hasMany Post`; responses embed the author
- 📄 **Pagination + search** - `GET /posts?page=&limit=&tag=&q=`
- ✅ **Automated tests** - Jest + Supertest against an in-memory database (9 tests)
- 📚 **Interactive API docs** - Swagger UI at `/docs`
- 🐳 **Dockerized** - `docker compose up` and you're running
- 🧯 Centralized error handling, rate limiting

---

## 🚀 Quick start

```bash
npm install
npm run seed     # optional sample data (login: ada@example.com / secret1)
npm start        # http://localhost:3000  · docs at /docs
```

Or with Docker:

```bash
docker compose up --build
```

Run the tests:

```bash
npm test
```

---

## 🔑 Auth flow

```bash
# 1. Register (returns a JWT)
curl -X POST localhost:3000/auth/register -H 'Content-Type: application/json' \
  -d '{"firstname":"Aziz","lastname":"BENAYED","email":"aziz@example.com","password":"s3cret"}'

# 2. Use the token to create a post
curl -X POST localhost:3000/posts -H "Authorization: Bearer <TOKEN>" \
  -H 'Content-Type: application/json' \
  -d '{"title":"Hello","content":"World","tags":"intro"}'
```

---

## 📚 Endpoints

| Method | Path | Auth | Description |
|--------|------|:---:|-------------|
| `POST` | `/auth/register` | - | Create account, returns JWT |
| `POST` | `/auth/login` | - | Log in, returns JWT |
| `GET` | `/users` | - | List users |
| `GET` | `/users/me` | ✅ | Current user + their posts |
| `GET` | `/users/:id` | - | A user with their posts |
| `GET` | `/posts` | - | Paginated list (`?page`,`?limit`,`?tag`,`?q`) |
| `POST` | `/posts` | ✅ | Create a post (author = you) |
| `GET` | `/posts/:id` | - | One post with author |
| `PUT` | `/posts/:id` | ✅ | Update **your** post |
| `DELETE` | `/posts/:id` | ✅ | Delete **your** post |

---

## ⚙️ Configuration

| Env var | Default | Purpose |
|---------|---------|---------|
| `PORT` | `3000` | HTTP port |
| `JWT_SECRET` | `dev-secret-change-me` | Token signing secret (**set in production**) |
| `DB_STORAGE` | `database.sqlite` | SQLite file path |
| `DATABASE_URL` | - | Full DB URL (Postgres/MariaDB) to replace SQLite |

---

## 🏗️ Project structure

```
src/
  app.js            Express app (routes, swagger, error handling)
  db.js             Sequelize connection (sqlite / memory / DATABASE_URL)
  models/index.js   User & Post models, hooks, associations
  middleware/auth.js JWT sign + authenticate
  routes/           auth.js · users.js · posts.js
  openapi.js        Swagger spec
tests/api.test.js   Jest + Supertest suite
```

---

## 🛠️ Tech Stack

![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=flat-square&logo=sequelize&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=flat-square&logo=sqlite&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=flat-square&logo=jest&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=flat-square&logo=swagger&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)

---

## 📄 License

Released under the [MIT License](LICENSE).
