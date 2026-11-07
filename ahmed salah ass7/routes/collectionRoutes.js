const express = require("express");
const {
    createBooksCollection,
    createAuthorsCollection,
    createCappedLogsCollection,
    createBooksIndex
} = require("../controllers/collectionController");

const router = express.Router();

// Q1 - Q4: create collections and the index
router.post("/books", createBooksCollection);
router.post("/authors", createAuthorsCollection);
router.post("/logs/capped", createCappedLogsCollection);
router.post("/books/index", createBooksIndex);

module.exports = router;