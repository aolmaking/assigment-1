require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/database");
const User = require("./models/User");
const Note = require("./models/Note");

const PORT = process.env.PORT || 3000;

async function start() {
    await connectDB();
    await Promise.all([User.init(), Note.init()]);

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

start().catch((error) => {
    console.error("Failed to start the server:", error.message);
    process.exit(1);
});
