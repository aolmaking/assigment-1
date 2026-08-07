
// const path = require("path");

// function getPath() {
//     console.log({ File: __filename, Dir: __dirname });
// }


// ---------------------------------------------------------------------

// function getFileName(filePath) {
//     return path.basename(filePath);
// }


// ---------------------------------------------------------------------


// function buildPath(obj) {
//     return path.format({
//         dir: obj.dir,
//         name: obj.name,
//         ext: obj.ext
//     });
// }


// ---------------------------------------------------------------------

// function getExtension(filePath) {
//     return path.extname(filePath);
// }


// ---------------------------------------------------------------------

// function parsePath(filePath) {
//     const parsed = path.parse(filePath);
//     return { Name: parsed.name, Ext: parsed.ext };
// }

// ---------------------------------------------------------------------

// function isAbsolute(filePath) {
//     return path.isAbsolute(filePath);
// }

// ---------------------------------------------------------------------
// function joinSegments(...segments) {
//     return path.join(...segments);
// }

// ---------------------------------------------------------------------

// function resolvePath(filePath) {
//     return path.resolve(filePath);
// }

// ---------------------------------------------------------------------


// function joinPaths(path1, path2) {
//     return path.join(path1, path2);
// }

// ---------------------------------------------------------------------

// const fs = require("fs");

// function deleteFile(filePath) {
//     fs.unlink(filePath, err => {
//         if (err) throw err;
//         console.log(`${path.basename(filePath)} is deleted.`);
//     });
// }


// ---------------------------------------------------------------------

// function createFolder(folderPath) {
//     fs.mkdirSync(folderPath);
//     console.log("Success");
// }


// ---------------------------------------------------------------------

// const EventEmitter = require("events");
// const emitter = new EventEmitter();

// emitter.on("start", () => {
//     console.log("Welcome event triggered!");
// });

// emitter.emit("start");


// ---------------------------------------------------------------------

// emitter.on("login", username => {
//     console.log(`User logged in: ${username}`);
// });

// emitter.emit("login", "Ahmed");


// ---------------------------------------------------------------------

// function readFile(filePath) {
//     const data = fs.readFileSync(filePath, "utf8");
//     console.log(data);
// }


// ---------------------------------------------------------------------

// function writeFile(filePath, content) {
//     fs.writeFile(filePath, content, err => {
//         if (err) throw err;
//     });
// }


// ---------------------------------------------------------------------

// function directoryExists(directoryPath) {
//     return fs.existsSync(directoryPath);
// }

// ---------------------------------------------------------------------

// const os = require("os");

// function getSystemInfo() {
//     return {
//         Platform: os.platform(),
//         Arch: os.arch()
//     };
// }

// ---------------------------------------------------------------------

// function readChunks(filePath) {
//     const stream = fs.createReadStream(filePath);

//     stream.on("data", chunk => {
//         console.log(chunk);
//     });
// }

// ---------------------------------------------------------------------

function copyFile(source, destination) {
    const readable = fs.createReadStream(source);
    const writable = fs.createWriteStream(destination);

    readable.pipe(writable);

    writable.on("finish", () => {
        console.log("File copied using streams");
    });
}
