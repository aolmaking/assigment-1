const mongoose = require("mongoose");
const Note = require("../models/Note");
const User = require("../models/User");
const { isNonEmptyString, readPositiveInteger, escapeRegex } = require("../utils/helpers");

async function loadOwnedNote(req, res) {
    const note = await Note.findById(req.params.noteId);

    if (!note) {
        res.status(404).json({ message: "Note not found" });
        return null;
    }

    if (note.userId.toString() !== req.userId) {
        res.status(403).json({ message: "You are not the owner" });
        return null;
    }

    return note;
}

async function createNote(req, res) {
    const { title, content } = req.body || {};

    if (!isNonEmptyString(title) || !isNonEmptyString(content)) {
        return res.status(400).json({ message: "title and content are required" });
    }

    if (!(await User.exists({ _id: req.userId }))) {
        return res.status(404).json({ message: "User not found" });
    }

    await Note.create({ title, content, userId: req.userId });

    res.status(201).json({ message: "Note created" });
}

async function updateNote(req, res) {
    const body = req.body || {};
    const updates = {};

    for (const field of ["title", "content"]) {
        if (body[field] !== undefined) {
            if (!isNonEmptyString(body[field])) {
                return res.status(400).json({ message: `${field} must be a non-empty string` });
            }
            updates[field] = body[field];
        }
    }

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: "Provide title and/or content to update" });
    }

    const note = await loadOwnedNote(req, res);
    if (!note) return;

    note.set(updates);
    await note.save();

    res.status(200).json({ message: "updated", note });
}

async function replaceNote(req, res) {
    const { title, content, userId } = req.body || {};

    if (!isNonEmptyString(title) || !isNonEmptyString(content)) {
        return res.status(400).json({ message: "title and content are required" });
    }

    if (userId !== undefined && String(userId).toLowerCase() !== req.userId) {
        return res.status(403).json({ message: "You cannot change the owner of the note" });
    }

    const note = await loadOwnedNote(req, res);
    if (!note) return;

    note.title = title;
    note.content = content;
    await note.save();

    res.status(200).json(note);
}

async function updateAllNotesTitle(req, res) {
    const { title } = req.body || {};

    if (!isNonEmptyString(title)) {
        return res.status(400).json({ message: "title is required" });
    }

    const result = await Note.updateMany(
        { userId: req.userId },
        { $set: { title } },
        { runValidators: true }
    );

    if (result.matchedCount === 0) {
        return res.status(404).json({ message: "No note found" });
    }

    res.status(200).json({ message: "All notes updated" });
}

async function deleteNote(req, res) {
    const note = await loadOwnedNote(req, res);
    if (!note) return;

    await note.deleteOne();

    res.status(200).json({ message: "deleted", note });
}

async function getPaginatedNotes(req, res) {
    const page = readPositiveInteger(req.query.page, "page", 1);
    const limit = Math.min(readPositiveInteger(req.query.limit, "limit", 10), 100);

    const notes = await Note.find({ userId: req.userId })
        .sort({ createdAt: -1, _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

    res.status(200).json(notes);
}

async function getNoteById(req, res) {
    const note = await loadOwnedNote(req, res);
    if (!note) return;

    res.status(200).json(note);
}

async function getNoteByContent(req, res) {
    const { content } = req.query;

    if (!isNonEmptyString(content)) {
        return res.status(400).json({ message: "content query param is required" });
    }

    const note = await Note.findOne({ userId: req.userId, content });

    if (!note) {
        return res.status(404).json({ message: "No note found" });
    }

    res.status(200).json(note);
}

async function getNotesWithUser(req, res) {
    const notes = await Note.find({ userId: req.userId })
        .select("title userId createdAt")
        .populate("userId", "email -_id");

    res.status(200).json(notes);
}

async function aggregateNotes(req, res) {
    const match = { userId: new mongoose.Types.ObjectId(req.userId) };

    if (req.query.title !== undefined) {
        if (!isNonEmptyString(req.query.title)) {
            return res.status(400).json({ message: "title must be a non-empty string" });
        }
        match.title = { $regex: escapeRegex(req.query.title.trim()), $options: "i" };
    }

    const notes = await Note.aggregate([
        { $match: match },
        { $sort: { createdAt: -1 } },
        {
            $lookup: {
                from: User.collection.name,
                localField: "userId",
                foreignField: "_id",
                as: "user"
            }
        },
        { $unwind: "$user" },
        {
            $project: {
                _id: 0,
                title: 1,
                userId: 1,
                createdAt: 1,
                "user.name": 1,
                "user.email": 1
            }
        }
    ]);

    res.status(200).json(notes);
}

async function deleteAllNotes(req, res) {
    await Note.deleteMany({ userId: req.userId });

    res.status(200).json({ message: "Deleted" });
}

module.exports = {
    createNote,
    updateNote,
    replaceNote,
    updateAllNotesTitle,
    deleteNote,
    getPaginatedNotes,
    getNoteById,
    getNoteByContent,
    getNotesWithUser,
    aggregateNotes,
    deleteAllNotes
};
