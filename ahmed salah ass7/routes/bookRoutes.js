const express = require("express");
const {
    addBook,
    addBooksBatch,
    updateFutureBook,
    getBookByTitle,
    getBooksByYear,
    getBooksByGenre,
    getBooksSkipLimit,
    getBooksWithIntegerYear,
    getBooksWithoutGenres,
    deleteBooksBeforeYear,
    getAggregate1,
    getAggregate2,
    getAggregate3,
    getAggregate4
} = require("../controllers/bookController");

const router = express.Router();

// "/batch" is declared before "/" so it is never mixed up with another route
router.post("/batch", addBooksBatch);
router.post("/", addBook);
router.patch("/Future", updateFutureBook);
router.get("/title", getBookByTitle);
router.get("/year", getBooksByYear);
router.get("/genre", getBooksByGenre);
router.get("/skip-limit", getBooksSkipLimit);
router.get("/year-integer", getBooksWithIntegerYear);
router.get("/exclude-genres", getBooksWithoutGenres);
// Aggregation questions (Q16 - Q19)
router.get("/aggregate1", getAggregate1);
router.get("/aggregate2", getAggregate2);
router.get("/aggregate3", getAggregate3);
router.get("/aggregate4", getAggregate4);
router.delete("/before-year", deleteBooksBeforeYear);

module.exports = router;