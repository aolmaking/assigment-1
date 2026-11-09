const test = require("node:test");
const assert = require("node:assert");

let mongoose;
let app;
try {
    mongoose = require("mongoose");
    app = require("../app");
} catch {
}

const uri = process.env.MONGODB_URI_TEST || "mongodb://127.0.0.1:27017/assignment8_test";

test("API flow on a real MongoDB", { skip: !mongoose && "run npm install first" }, async (t) => {
    try {
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
    } catch {
        t.skip("MongoDB is not running");
        return;
    }

    await mongoose.connection.dropDatabase();
    await require("../models/User").init();

    const server = app.listen(0);
    const base = `http://127.0.0.1:${server.address().port}`;

    t.after(async () => {
        server.closeAllConnections();
        server.close();
        await mongoose.connection.dropDatabase();
        await mongoose.disconnect();
    });

    async function call(method, path, body) {
        const response = await fetch(base + path, {
            method,
            headers: { "Content-Type": "application/json" },
            body: body ? JSON.stringify(body) : undefined
        });
        return { status: response.status, body: await response.json() };
    }

    const user1 = { name: "User1", email: "user1@email.com", password: "123456", phone: "01012345678", age: 25 };
    const user2 = { name: "User2", email: "user2@email.com", password: "123456", phone: "01112345678", age: 30 };

    let res = await call("POST", "/users/signup", user1);
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.message, "User added successfully.");

    res = await call("POST", "/users/signup", user1);
    assert.strictEqual(res.status, 409);
    assert.strictEqual(res.body.message, "Email already exists.");

    await call("POST", "/users/signup", user2);

    res = await call("POST", "/users/login", { email: user1.email, password: "wrong" });
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.message, "Invalid email or password");

    res = await call("POST", "/users/login", { email: user1.email, password: user1.password });
    assert.strictEqual(res.status, 200);
    const id1 = res.body.user._id;
    assert.strictEqual(res.body.user.password, undefined);

    res = await call("POST", "/users/login", { email: user2.email, password: user2.password });
    const id2 = res.body.user._id;

    res = await call("GET", `/users?userId=${id1}`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.email, user1.email);

    res = await call("GET", "/users");
    assert.strictEqual(res.status, 400);

    res = await call("PATCH", `/users/${id1}?userId=${id1}`, { email: user2.email });
    assert.strictEqual(res.status, 409);
    assert.strictEqual(res.body.message, "Email already exists.");

    res = await call("PATCH", `/users/${id1}?userId=${id1}`, { age: 70 });
    assert.strictEqual(res.status, 400);

    res = await call("PATCH", `/users/${id1}?userId=${id2}`, { name: "hacked" });
    assert.strictEqual(res.status, 403);

    res = await call("PATCH", `/users/${id1}`, { name: "no query" });
    assert.strictEqual(res.status, 400);

    res = await call("PATCH", `/users/${id1}?userId=${id1}`, { name: "updated", email: "updated@email.com", age: 30 });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.message, "User updated");

    res = await call("POST", `/notes?userId=${id1}`, { title: "FIRST NOTE", content: "c" });
    assert.strictEqual(res.status, 400);

    for (const n of [1, 2, 3, 4]) {
        res = await call("POST", `/notes?userId=${id1}`, { title: `Note${n}`, content: `content ${n}` });
        assert.strictEqual(res.status, 201);
        assert.strictEqual(res.body.message, "Note created");
    }

    res = await call("GET", `/notes/paginate-sort?userId=${id1}&page=1&limit=3`);
    assert.strictEqual(res.body.length, 3);
    assert.strictEqual(res.body[0].title, "Note4");
    const noteId = res.body[0]._id;

    res = await call("GET", `/notes/paginate-sort?userId=${id1}&page=2&limit=3`);
    assert.strictEqual(res.body.length, 1);
    assert.strictEqual(res.body[0].title, "Note1");

    res = await call("GET", `/notes/${noteId}?userId=${id1}`);
    assert.strictEqual(res.status, 200);

    res = await call("GET", `/notes/${noteId}?userId=${id2}`);
    assert.strictEqual(res.status, 403);
    assert.strictEqual(res.body.message, "You are not the owner");

    res = await call("GET", `/notes/64d91c42d8979e1f30a12346?userId=${id1}`);
    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.body.message, "Note not found");

    res = await call("PATCH", `/notes/${noteId}?userId=${id2}`, { title: "hacked" });
    assert.strictEqual(res.status, 403);

    res = await call("PATCH", `/notes/${noteId}?userId=${id1}`, { title: "updated", content: "update content" });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.message, "updated");
    assert.strictEqual(res.body.note.title, "updated");

    res = await call("PUT", `/notes/replace/${noteId}?userId=${id1}`, { title: "replaced", content: "replaced content", userId: id2 });
    assert.strictEqual(res.status, 403);

    res = await call("PUT", `/notes/replace/${noteId}?userId=${id2}`, { title: "replaced", content: "replaced content" });
    assert.strictEqual(res.status, 403);

    res = await call("PUT", `/notes/replace/${noteId}?userId=${id1}`, { title: "replaced", content: "replaced content", userId: id1 });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.title, "replaced");
    assert.strictEqual(res.body.userId, id1);

    res = await call("PATCH", `/notes/all?userId=${id1}`, { title: "ALL UPPER" });
    assert.strictEqual(res.status, 400);

    res = await call("PATCH", `/notes/all?userId=${id1}`, { title: "All Updated" });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.message, "All notes updated");

    res = await call("GET", `/notes/note-by-content?userId=${id1}&content=replaced content`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.title, "All Updated");

    res = await call("GET", `/notes/note-by-content?userId=${id1}&content=nothing`);
    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.body.message, "No note found");

    res = await call("GET", `/notes/note-with-user?userId=${id1}`);
    assert.strictEqual(res.body.length, 4);
    assert.strictEqual(res.body[0].userId.email, "updated@email.com");
    assert.strictEqual(res.body[0].content, undefined);

    res = await call("GET", `/notes/aggregate?userId=${id1}&title=all updated`);
    assert.strictEqual(res.body.length, 4);
    assert.strictEqual(res.body[0].user.email, "updated@email.com");
    assert.strictEqual(res.body[0].user.name, "updated");

    res = await call("DELETE", `/notes/${noteId}?userId=${id2}`);
    assert.strictEqual(res.status, 403);

    res = await call("DELETE", `/notes/${noteId}?userId=${id1}`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.message, "deleted");

    res = await call("DELETE", `/notes?userId=${id1}`);
    assert.strictEqual(res.body.message, "Deleted");

    res = await call("PATCH", `/notes/all?userId=${id1}`, { title: "Nothing" });
    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.body.message, "No note found");

    res = await call("DELETE", `/users?userId=${id1}`);
    assert.strictEqual(res.body.message, "User deleted");

    res = await call("DELETE", `/users?userId=${id1}`);
    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.body.message, "User not found");
});
