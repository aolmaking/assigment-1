const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { isNonEmptyString } = require("../utils/helpers");

const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;

function toUserResponse(user) {
    const data = user.toObject();
    delete data.password;
    delete data.__v;
    return data;
}

async function signup(req, res) {
    const { name, email, password, phone, age } = req.body || {};

    if (![name, email, password, phone].every(isNonEmptyString)) {
        return res.status(400).json({ message: "name, email, password and phone are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (await User.exists({ email: normalizedEmail })) {
        return res.status(409).json({ message: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await User.create({ name, email: normalizedEmail, password: hashedPassword, phone, age });

    res.status(201).json({ message: "User added successfully." });
}

async function login(req, res) {
    const { email, password } = req.body || {};

    if (!isNonEmptyString(email) || !isNonEmptyString(password)) {
        return res.status(400).json({ message: "email and password are required" });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({ message: "Login successful", user: toUserResponse(user) });
}

async function updateUser(req, res) {
    if (req.params.id.toLowerCase() !== req.userId) {
        return res.status(403).json({ message: "You can only update your own account" });
    }

    const body = req.body || {};

    if ("password" in body) {
        return res.status(400).json({ message: "Password cannot be updated from this endpoint" });
    }

    const updates = {};
    for (const field of ["name", "email", "phone", "age"]) {
        if (body[field] !== undefined) {
            updates[field] = body[field];
        }
    }

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: "No data to update" });
    }

    for (const field of ["name", "email", "phone"]) {
        if (field in updates && !isNonEmptyString(updates[field])) {
            return res.status(400).json({ message: `${field} must be a non-empty string` });
        }
    }

    const user = await User.findById(req.userId);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    if (updates.email) {
        updates.email = updates.email.trim().toLowerCase();

        const emailTaken = await User.exists({ email: updates.email, _id: { $ne: user._id } });
        if (emailTaken) {
            return res.status(409).json({ message: "Email already exists." });
        }
    }

    user.set(updates);
    await user.save();

    res.status(200).json({ message: "User updated" });
}

async function deleteUser(req, res) {
    const user = await User.findByIdAndDelete(req.userId);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted" });
}

async function getUser(req, res) {
    const user = await User.findById(req.userId);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(toUserResponse(user));
}

module.exports = { signup, login, updateUser, deleteUser, getUser };
