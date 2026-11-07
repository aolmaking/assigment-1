const { getDB } = require("../config/database");
const { isObject, hasValidTitle, readInteger } = require("../utils/checks");

// Q5: insert one document into the books collection.
// The collection validator (Q1) rejects a missing, empty, or spaces-only title.
async function addBook(req, res) {
    const db = getDB();

    if (!isObject(req.body)) {
        return res.status(400).json({ message: "Book data must be an object" });
    }

    const result = await db.collection("books").insertOne(req.body);

    return res.status(201).json({
        message: "Book added",
        insertedId: result.insertedId
    });
}

// Q6: insert at least three documents.
// The body can be an array of books (as in the assignment) or { "books": [...] }.
async function addBooksBatch(req, res) {
    const db = getDB();
    const books = Array.isArray(req.body) ? req.body : req.body?.books;

    if (!Array.isArray(books) || books.length < 3 || !books.every(isObject)) {
        return res.status(400).json({
            message: "Send at least three book objects (an array, or inside a books array)"
        });
    }

    // Check every title first so a bad book does not leave a half-saved batch
    const invalidIndex = books.findIndex((book) => !hasValidTitle(book));

    if (invalidIndex !== -1) {
        return res.status(400).json({
            message: `Book at index ${invalidIndex} must have a non-empty title`
        });
    }

    const result = await db.collection("books").insertMany(books);

    return res.status(201).json({
        message: "Books added",
        insertedCount: result.insertedCount,
        insertedIds: result.insertedIds
    });
}

// Q8: change the year of the book titled "Future" to 2022.
async function updateFutureBook(req, res) {
    const db = getDB();
    const result = await db.collection("books").updateOne(
        { title: "Future" },
        { $set: { year: 2022 } }
    );

    if (result.matchedCount === 0) {
        return res.status(404).json({ message: "Book with title Future was not found" });
    }

    return res.status(200).json({
        message: "Future book year updated to 2022",
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount
    });
}

// Q9: find a book by title. Example: /books/title?title=Brave New World
async function getBookByTitle(req, res) {
    const db = getDB();
    const title = req.query.title;

    if (typeof title !== "string" || title.trim() === "") {
        return res.status(400).json({ message: "title query parameter is required" });
    }

    const book = await db.collection("books").findOne({ title: title.trim() });

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json(book);
}

// Q10: books published between two years, both included.
// Example: /books/year?from=1990&to=2010
async function getBooksByYear(req, res) {
    const db = getDB();
    const from = readInteger(req.query.from, "from");
    const to = readInteger(req.query.to, "to");

    if (from > to) {
        return res.status(400).json({ message: "from must be less than or equal to to" });
    }

    const books = await db.collection("books").find({
        year: { $gte: from, $lte: to }
    }).toArray();

    return res.status(200).json(books);
}

// Q11: books whose genres array includes a genre.
// Example: /books/genre?genre=Science Fiction
async function getBooksByGenre(req, res) {
    const db = getDB();
    const genre = req.query.genre;

    if (typeof genre !== "string" || genre.trim() === "") {
        return res.status(400).json({ message: "genre query parameter is required" });
    }

    const books = await db.collection("books").find({
        genres: genre.trim()
    }).toArray();

    return res.status(200).json(books);
}

// Q12: sort by year (newest first), skip two books, then return the next three.
async function getBooksSkipLimit(req, res) {
    const db = getDB();
    const books = await db.collection("books")
        .find({})
        .sort({ year: -1 })
        .skip(2)
        .limit(3)
        .toArray();

    return res.status(200).json(books);
}

// Q13: books where the year field is stored as a 32-bit integer.
async function getBooksWithIntegerYear(req, res) {
    const db = getDB();
    const books = await db.collection("books").find({
        year: { $type: "int" }
    }).toArray();

    return res.status(200).json(books);
}

// Q14: books that have neither "Horror" nor "Science Fiction" in genres.
async function getBooksWithoutGenres(req, res) {
    const db = getDB();
    const books = await db.collection("books").find({
        genres: { $nin: ["Horror", "Science Fiction"] }
    }).toArray();

    return res.status(200).json(books);
}

// Q15: delete all books published before a year. Example: DELETE /books/before-year?year=2000
async function deleteBooksBeforeYear(req, res) {
    const db = getDB();
    const year = readInteger(req.query.year, "year");
    const result = await db.collection("books").deleteMany({
        year: { $lt: year }
    });

    return res.status(200).json({
        message: `Books published before ${year} deleted`,
        deletedCount: result.deletedCount
    });
}

// Q16: aggregation - books published after 2000, newest first.
async function getAggregate1(req, res) {
    const db = getDB();
    const books = await db.collection("books").aggregate([
        { $match: { year: { $gt: 2000 } } },
        { $sort: { year: -1 } }
    ]).toArray();

    return res.status(200).json(books);
}

// Q17: aggregation - books published after 2000, only title, author, and year.
async function getAggregate2(req, res) {
    const db = getDB();
    const books = await db.collection("books").aggregate([
        { $match: { year: { $gt: 2000 } } },
        {
            $project: {
                _id: 0,
                title: 1,
                author: 1,
                year: 1
            }
        }
    ]).toArray();

    return res.status(200).json(books);
}

// Q18: aggregation - one output document for every genre in the genres array.
async function getAggregate3(req, res) {
    const db = getDB();
    const books = await db.collection("books").aggregate([
        { $unwind: "$genres" }
    ]).toArray();

    return res.status(200).json(books);
}

// Q19: aggregation - join the logs with the books they refer to.
// Each log is matched with the book whose _id equals log.book_id.
async function getAggregate4(req, res) {
    const db = getDB();
    const logs = await db.collection("logs").aggregate([
        {
            $lookup: {
                from: "books",
                localField: "book_id",
                foreignField: "_id",
                as: "book_details"
            }
        },
        {
            $project: {
                _id: 0,
                action: 1,
                "book_details.title": 1,
                "book_details.author": 1,
                "book_details.year": 1
            }
        }
    ]).toArray();

    return res.status(200).json(logs);
}

module.exports = {
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
};
