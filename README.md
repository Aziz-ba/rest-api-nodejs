# 🔌 REST API — Node.js + Express + Sequelize

A clean **RESTful CRUD API** for **Users** and **Posts**, built with **Express** and **Sequelize**. It runs **out of the box on SQLite** (no database to install) and can switch to Postgres/MariaDB with a single environment variable.

---

## ✨ Features

- 🧩 **Full CRUD** for two resources — `/users` and `/posts`
- 🗃️ **Zero-config persistence** — SQLite by default, `DATABASE_URL` for anything else
- ✅ **Validation** — required fields and email format return `400` with a clear message
- 🔒 **Safe responses** — password hashes are never serialized in JSON
- 🌱 **Seed script** — one command to load sample data
- 🧯 **Centralized error handling**

---

## 🚀 Quick start

```bash
npm install
npm run seed     # optional: load sample users & posts
npm start        # http://localhost:3000
```

Then try it (see [`api.http`](api.http) for a ready-to-run set):

```bash
curl localhost:3000/users
curl -X POST localhost:3000/posts \
  -H 'Content-Type: application/json' \
  -d '{"title":"Hello","content":"World","tags":"intro"}'
```

---

## 📚 Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/users` | List users (filter with `?firstname=...`) |
| `POST` | `/users` | Create a user |
| `GET` | `/users/:id` | Get one user |
| `PUT` | `/users/:id` | Update a user |
| `DELETE` | `/users/:id` | Delete a user |
| `GET` | `/posts` | List posts (filter with `?tags=...`) |
| `POST` | `/posts` | Create a post |
| `GET` | `/posts/:id` | Get one post |
| `PUT` | `/posts/:id` | Update a post |
| `DELETE` | `/posts/:id` | Delete a post |

**Models**
- **User** — `firstname*`, `lastname*`, `email*` (unique, validated), `password*`
- **Post** — `title*`, `content*`, `tags` (e.g. `"tech,market"`)

---

## ⚙️ Configuration

| Env var | Default | Purpose |
|---------|---------|---------|
| `PORT` | `3000` | HTTP port |
| `DB_STORAGE` | `database.sqlite` | SQLite file path |
| `DATABASE_URL` | — | Use a full DB URL (Postgres/MariaDB) instead of SQLite |

---

## 🛠️ Tech Stack

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=flat-square&logo=sequelize&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=flat-square&logo=sqlite&logoColor=white)

---

## 📄 License

Released under the [MIT License](LICENSE).
