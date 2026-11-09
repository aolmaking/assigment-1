const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const context = {};
vm.runInNewContext(fs.readFileSync(path.join(__dirname, "..", "bonus.js"), "utf8"), context);
const longestCommonPrefix = context.longestCommonPrefix;

test("LeetCode examples", () => {
    assert.strictEqual(longestCommonPrefix(["flower", "flow", "flight"]), "fl");
    assert.strictEqual(longestCommonPrefix(["dog", "racecar", "car"]), "");
});

test("edge cases", () => {
    assert.strictEqual(longestCommonPrefix(["a"]), "a");
    assert.strictEqual(longestCommonPrefix([""]), "");
    assert.strictEqual(longestCommonPrefix(["ab", "a"]), "a");
    assert.strictEqual(longestCommonPrefix(["same", "same", "same"]), "same");
});
