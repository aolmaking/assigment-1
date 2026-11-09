const mongoose = require("mongoose");
const { isNotAllUppercase } = require("../utils/helpers");

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
        validate: {
            validator: isNotAllUppercase,
            message: "The title must not be entirely uppercase"
        }
    },
    content: {
        type: String,
        required: [true, "Content is required"]
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "userId is required"]
    }
}, {
    timestamps: true
});

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
