# Assignment 8 - Sticky Notes API (Express + Mongoose)

## Run
```bash
npm install
copy .env.example .env
npm run dev
npm test
```
MongoDB must be running (default: `mongodb://127.0.0.1:27017/assignment8`).
`npm test` also runs an API test on a separate database (`assignment8_test`) and skips it if MongoDB is not running.

## Structure
```
config/database.js
models/            User.js, Note.js
controllers/       user.controller.js, note.controller.js
routes/            user.routes.js, note.routes.js
middlewares/       loggedUser.js, errorHandler.js
utils/helpers.js
tests/
postman/Assignment8.postman_collection.json
bonus.js
app.js, server.js
```

## Endpoints
The logged-in user id is always sent in the query: `?userId=<id>`.

| Method + URL | Notes |
|---|---|
| `POST /users/signup` | password is hashed with bcrypt |
| `POST /users/login` | body: email, password |
| `PATCH /users/:id?userId=<id>` | `:id` must equal `userId`. Password cannot be updated |
| `DELETE /users` | |
| `GET /users` | password is not returned |
| `POST /notes` | body: title, content |
| `PATCH /notes/:noteId` | owner only |
| `PUT /notes/replace/:noteId` | owner only. Sending a different `userId` in the body is rejected |
| `PATCH /notes/all` | body: title |
| `DELETE /notes/:noteId` | owner only |
| `GET /notes/paginate-sort?page=2&limit=3` | sorted by createdAt desc |
| `GET /notes/:noteId` | owner only |
| `GET /notes/note-by-content?content=...` | |
| `GET /notes/note-with-user` | populate |
| `GET /notes/aggregate?title=...` | aggregation |
| `DELETE /notes` | |
