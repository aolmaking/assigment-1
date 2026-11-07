# Assignment 7

This folder has the two required solutions:

1. Express.js with MongoDB (folder structure: config, controllers, routes, utils).
2. MongoDB Shell commands in `mongosh-solutions.txt`.

The Bonus solution (Roman to Integer) is in `bonus.js`.

## Project structure

```text
Assignment7-Submission/
├── config/
│   └── database.js
├── controllers/
│   ├── bookController.js
│   ├── collectionController.js
│   └── logController.js
├── routes/
│   ├── bookRoutes.js
│   ├── collectionRoutes.js
│   └── logRoutes.js
├── utils/
│   └── checks.js
├── tests/
│   ├── bonus.test.js
│   └── checks.test.js
├── postman/
│   └── Assignment7.postman_collection.json
├── .env.example
├── .gitignore
├── bonus.js
├── mongosh-solutions.txt
├── package.json
├── package-lock.json
└── server.js
```

## Requirements

- Node.js 20.19.0 or newer
- MongoDB running locally or a MongoDB Atlas connection

## Run the Express project

1. Open this folder in the terminal.
2. Install the packages:

```bash
npm install
```

3. Copy `.env.example` and rename the copy to `.env`.
4. Put your MongoDB connection string in `MONGODB_URI`.
5. Run the project:

```bash
npm run dev
```

The server uses port 3000 by default.

## Endpoints

| Question | Method and URL |
|---|---|
| Q1 | POST /collection/books |
| Q2 | POST /collection/authors |
| Q3 | POST /collection/logs/capped |
| Q4 | POST /collection/books/index |
| Q5 | POST /books |
| Q6 | POST /books/batch |
| Q7 | POST /logs |
| Q8 | PATCH /books/Future |
| Q9 | GET /books/title?title=Brave New World |
| Q10 | GET /books/year?from=1990&to=2010 |
| Q11 | GET /books/genre?genre=Science Fiction |
| Q12 | GET /books/skip-limit |
| Q13 | GET /books/year-integer |
| Q14 | GET /books/exclude-genres |
| Q15 | DELETE /books/before-year?year=2000 |
| Q16 | GET /books/aggregate1 |
| Q17 | GET /books/aggregate2 |
| Q18 | GET /books/aggregate3 |
| Q19 | GET /books/aggregate4 |

## Run the tests

```bash
npm test
```

The tests check the Bonus solution and the helper functions. The API itself needs a running MongoDB database.

## Postman

Import `postman/Assignment7.postman_collection.json`.

The requests are in the same order as the questions (Q1 to Q19) and have clear names. They use `{{baseUrl}}`, and every request has a test script. To run everything, start the server and use the Collection Runner from the top.

- Q6 sends an array of books, as in the assignment. The body `{ "books": [...] }` is also accepted.
- Q6 saves the id of the book `Future` in the collection variable `futureId`, and Q7 uses it as `book_id`.
- Q13 has one extra request before the query that adds a book with a text year, to show the difference.
- The last folder has extra requests that must be rejected (missing, empty and spaces-only title, and a batch with less than three books).

Run the collection on an empty database for clean results. Running it again works, but it adds the books again.

## Notes

The books collection validator requires `title` to be a string with at least one character that is not a space. A book without a valid title is rejected and the API returns 400.

The capped logs collection uses 1,048,576 bytes, which is 1MB.

Question 19 joins the logs with the books. Each log keeps its `book_id`, and the lookup matches it with `books._id`. A `book_id` sent as a 24-character id string is saved as an ObjectId, so the match works. The result shows `action` and `book_details` for each log.

The `year-integer` query uses MongoDB `$type: "int"`.

The endpoint for Question 15 uses the DELETE HTTP method because it deletes documents, even though the assignment line also includes the word GET.

`mongosh-solutions.txt` contains the shell version of all 19 questions. Paste the commands in order into mongosh, or run `mongosh --file mongosh-solutions.txt`.
