const { isValidObjectId } = require("../utils/helpers");

function requireLoggedUser(req, res, next) {
    const userId = req.query.userId || req.query.id;

    if (!isValidObjectId(userId)) {
        return res.status(400).json({ message: "A valid userId is required in query params" });
    }

    req.userId = userId.toLowerCase();
    next();
}

function validateNoteId(req, res, next) {
    if (!isValidObjectId(req.params.noteId)) {
        return res.status(400).json({ message: "Invalid note id" });
    }
    next();
}

module.exports = { requireLoggedUser, validateNoteId };
