function notFound(req, res) {
    res.status(404).json({ message: "Route not found" });
}

function errorHandler(err, req, res, next) {
    if (err.type === "entity.parse.failed") {
        return res.status(400).json({ message: "Invalid JSON body" });
    }

    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map((e) => e.message).join(", ");
        return res.status(400).json({ message });
    }

    if (err.name === "CastError") {
        return res.status(400).json({ message: `Invalid value for ${err.path}` });
    }

    if (err.code === 11000) {
        return res.status(409).json({ message: "Email already exists." });
    }

    if (err.statusCode) {
        return res.status(err.statusCode).json({ message: err.message });
    }

    console.error(err);
    res.status(500).json({ message: "Internal server error" });
}

module.exports = { notFound, errorHandler };
