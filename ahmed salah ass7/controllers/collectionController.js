const { getDB } = require("../config/database");
const { isObject } = require("../utils/checks");

// Q1: explicit "books" collection. Every document needs a title that is a string
// with at least one non-space character (rejects missing, empty, and spaces-only).
async function createBooksCollection(req, res) {
    const db = getDB();
    const validator = {
        $jsonSchema: {
            bsonType: "object",
            required: ["title"],
            properties: {
                title: {
                    bsonType: "string",
                    minLength: 1,
                    pattern: "\\S"
                }
            }
        }
    };

    // If books already exists (for example it was created by an index call first),
    // apply the rule to it with collMod instead of failing.
    const existing = await db.listCollections({ name: "books" }).toArray();

    if (existing.length === 0) {
        await db.createCollection("books", {
            validator,
            validationLevel: "strict",
            validationAction: "error"
        });

        return res.status(201).json({
            message: "Books collection created with title validation"
        });
    }

    await db.command({
        collMod: "books",
        validator,
        validationLevel: "strict",
        validationAction: "error"
    });

    return res.status(200).json({
        message: "Books collection already exists and the validation rule was applied"
    });
}

// Q2: implicit collection - "authors" is created by inserting the first document.
async function createAuthorsCollection(req, res) {
    const db = getDB();

    if (!isObject(req.body) || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: "Send author data in the body" });
    }

    const result = await db.collection("authors").insertOne(req.body);

    return res.status(201).json({
        message: "Author inserted and authors collection created if it did not exist",
        insertedId: result.insertedId
    });
}

// Q3: capped "logs" collection with a size limit of 1MB (1024 * 1024 bytes).
async function createCappedLogsCollection(req, res) {
    const db = getDB();
    const existing = await db.listCollections({ name: "logs" }).toArray();

    if (existing.length > 0) {
        const options = existing[0].options || {};

        if (options.capped && options.size === 1048576) {
            return res.status(200).json({
                message: "Logs is already a capped collection with a size of 1MB"
            });
        }

        return res.status(409).json({
            message: "The logs collection already exists with different options"
        });
    }

    await db.createCollection("logs", {
        capped: true,
        size: 1024 * 1024
    });

    return res.status(201).json({
        message: "Capped logs collection created with a size of 1MB"
    });
}

// Q4: ascending index on books.title.
async function createBooksIndex(req, res) {
    const db = getDB();
    const indexName = await db.collection("books").createIndex({ title: 1 });

    return res.status(200).json({
        message: "Index created on books.title",
        indexName
    });
}

module.exports = {
    createBooksCollection,
    createAuthorsCollection,
    createCappedLogsCollection,
    createBooksIndex
};