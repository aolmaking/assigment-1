require("dotenv").config();

const express = require("express");
const { connectDB } = require("./config/database");
const collectionRoutes = require("./routes/collectionRoutes");
const bookRoutes = require("./routes/bookRoutes");
const logRoutes = require("./routes/logRoutes");

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
    res.status(200).json({ message: "Server is running" });
});

app.use("/collection", collectionRoutes);
app.use("/books", bookRoutes);
app.use("/logs", logRoutes);

// Any route that is not defined above
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Central error handler (Express 5 sends async errors here automatically)
app.use((err, req, res, next) => {
    // 121 = MongoDB "Document failed validation" (for example an empty title)
    if (err.code === 121) {
        return res.status(400).json({
            message: "Document failed validation: title must be a non-empty string"
        });
    }

    // 11000 = duplicate key
    if (err.code === 11000) {
        return res.status(409).json({ message: "Duplicate value" });
    }

    const statusCode = err.statusCode || err.status || 500;
    res.status(statusCode).json({
        message: err.message || "Something went wrong"
    });
});

async function startServer() {
    try {
        await connectDB();
        const port = process.env.PORT || 3000;

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

// Start the server only when this file is run directly
if (require.main === module) {
    startServer();
}

module.exports = app;
