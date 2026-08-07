// 1/ The Event Loop allows Node.js to handle asynchronous tasks without blocking the main thread.

// 2/ Libuv is a library that helps Node.js handle asynchronous operations and the thread pool.

// 3/ Node.js sends asynchronous tasks to Libuv, and when they finish, their callbacks are handled by the Event Loop.

// 4/ The Call Stack runs the code, the Event Queue stores callbacks, and the Event Loop moves callbacks to the Call Stack.

// 5/ The Thread Pool handles some tasks in the background. Its size can be set using UV_THREADPOOL_SIZE.

// 6/ Blocking code stops other tasks from running, while non-blocking code allows Node.js to continue wo


// --------------------------------------------------------------------------------

// app.post("/user", (req, res) => {
//     const users = JSON.parse(fs.readFileSync(file, "utf8"));

//     if (users.find(user => user.email === req.body.email)) {
//         return res.send("Email already exists");
//     }

//     users.push(req.body);

//     fs.writeFileSync(file, JSON.stringify(users, null, 2));

//     res.send("User added");
// });


// --------------------------------------------------------------------------------

// PATCH /user/:id
// app.patch("/user/:id", (req, res) => {
//     const users = JSON.parse(fs.readFileSync(file, "utf8"));

//     const user = users.find(user => user.id == req.params.id);

//     if (!user) {
//         return res.send("User not found");
//     }

//     if (req.body.name) user.name = req.body.name;
//     if (req.body.age) user.age = req.body.age;
//     if (req.body.email) user.email = req.body.email;

//     fs.writeFileSync(file, JSON.stringify(users, null, 2));

//     res.send("User updated");
// });


// --------------------------------------------------------------------------------

// DELETE /user/:id
// app.delete("/user/:id", (req, res) => {
//     const users = JSON.parse(fs.readFileSync(file, "utf8"));

//     const index = users.findIndex(user => user.id == req.params.id);

//     if (index === -1) {
//         return res.send("User not found");
//     }

//     users.splice(index, 1);

//     fs.writeFileSync(file, JSON.stringify(users, null, 2));

//     res.send("User deleted");
// });


// --------------------------------------------------------------------------------

// GET /user/getByName
// app.get("/user/getByName", (req, res) => {
//     const users = JSON.parse(fs.readFileSync(file, "utf8"));

//     const user = users.find(user => user.name === req.query.name);

//     res.json(user);
// });

// --------------------------------------------------------------------------------

// GET /user
// app.get("/user", (req, res) => {
//     const users = JSON.parse(fs.readFileSync(file, "utf8"));

//     res.json(users);
// });

// --------------------------------------------------------------------------------

// GET /user/filter
// app.get("/user/filter", (req, res) => {
//     const users = JSON.parse(fs.readFileSync(file, "utf8"));

//     const result = users.filter(user => user.age >= req.query.age);

//     res.json(result);
// });

--------------------------------------------------------------------------------

 GET /user/:id
app.get("/user/:id", (req, res) => {
    const users = JSON.parse(fs.readFileSync(file, "utf8"));

    const user = users.find(user => user.id == req.params.id);

    res.json(user);
});
Start Server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});

