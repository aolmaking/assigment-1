const test = require("node:test");
const assert = require("node:assert");

let mongoose;
try {
    mongoose = require("mongoose");
} catch {
}

const options = { skip: !mongoose && "run npm install first" };
const objectId = "64d91c42d8979e1f30a12345";

test("Note: uppercase title is rejected by the schema", options, () => {
    const Note = require("../models/Note");
    const error = new Note({ title: "FIRST NOTE", content: "c", userId: objectId }).validateSync();

    assert.ok(error.errors.title);
    assert.match(error.errors.title.message, /uppercase/);
});

test("Note: normal title is accepted", options, () => {
    const Note = require("../models/Note");
    assert.strictEqual(new Note({ title: "First Note", content: "c", userId: objectId }).validateSync(), undefined);
});

test("Note: title, content and userId are required", options, () => {
    const Note = require("../models/Note");
    const error = new Note({}).validateSync();

    assert.ok(error.errors.title && error.errors.content && error.errors.userId);
});

test("User: age must be between 18 and 60", options, () => {
    const User = require("../models/User");
    const base = { name: "a", email: "a@a.com", password: "x", phone: "1" };

    assert.ok(new User({ ...base, age: 17 }).validateSync().errors.age);
    assert.ok(new User({ ...base, age: 61 }).validateSync().errors.age);
    assert.strictEqual(new User({ ...base, age: 18 }).validateSync(), undefined);
    assert.strictEqual(new User({ ...base, age: 60 }).validateSync(), undefined);
});

test("User: name, email, password and phone are required", options, () => {
    const User = require("../models/User");
    const error = new User({}).validateSync();

    assert.ok(error.errors.name && error.errors.email && error.errors.password && error.errors.phone);
});
