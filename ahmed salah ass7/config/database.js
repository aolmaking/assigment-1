const { MongoClient } = require("mongodb");

let client;
let database;

async function connectDB() {
    const uri = process.env.MONGODB_URI;
    const databaseName = process.env.MONGODB_DB || "assignment7";

    if (!uri) {
        throw new Error("MONGODB_URI is missing");
    }

    client = new MongoClient(uri);
    await client.connect();
    database = client.db(databaseName);

    return database;
}

function getDB() {
    if (!database) {
        throw new Error("Database is not connected");
    }

    return database;
}

async function closeDB() {
    if (client) {
        await client.close();
        client = null;
        database = null;
    }
}

module.exports = {
    connectDB,
    getDB,
    closeDB
};