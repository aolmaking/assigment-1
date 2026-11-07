const { ObjectId } = require("mongodb");
const { getDB } = require("../config/database");
const { isObject } = require("../utils/checks");

// Q7: insert a new log into the capped "logs" collection.
async function addLog(req, res) {
    const db = getDB();

    if (!isObject(req.body) || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: "Log data must be a non-empty object" });
    }

    const collection = await db.listCollections({ name: "logs" }).toArray();

    // The logs collection must be created first as a capped collection (Q3)
    if (collection.length === 0) {
        return res.status(409).json({
            message: "Create the capped logs collection before adding logs"
        });
    }

    if (!collection[0].options || !collection[0].options.capped) {
        return res.status(409).json({
            message: "The logs collection must be capped"
        });
    }

    const log = {
        ...req.body,
        createdAt: req.body.createdAt ? new Date(req.body.createdAt) : new Date()
    };

    if (Number.isNaN(log.createdAt.getTime())) {
        return res.status(400).json({ message: "createdAt must be a valid date" });
    }

    // JSON has no ObjectId type, so a 24-character hex book_id is stored as an
    // ObjectId. This lets Q19 join logs.book_id with books._id.
    if (typeof log.book_id === "string" && /^[0-9a-fA-F]{24}$/.test(log.book_id)) {
        log.book_id = new ObjectId(log.book_id);
    }

    const result = await db.collection("logs").insertOne(log);

    return res.status(201).json({
        message: "Log added",
        insertedId: result.insertedId
    });
}

module.exports = {
    addLog
};
