const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email is not valid"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    phone: {
        type: String,
        required: [true, "Phone is required"],
        trim: true
    },
    age: {
        type: Number,
        min: [18, "Age must be between 18 and 60"],
        max: [60, "Age must be between 18 and 60"]
    }
}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;
