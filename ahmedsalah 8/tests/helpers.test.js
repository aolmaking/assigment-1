const test = require("node:test");
const assert = require("node:assert");
const {
    isNotAllUppercase,
    isValidObjectId,
    isNonEmptyString,
    readPositiveInteger,
    escapeRegex
} = require("../utils/helpers");

test("title validator rejects entirely uppercase titles", () => {
    assert.strictEqual(isNotAllUppercase("FIRST NOTE"), false);
    assert.strictEqual(isNotAllUppercase("NOTE 1"), false);
});

test("title validator accepts normal titles", () => {
    assert.strictEqual(isNotAllUppercase("First Note"), true);
    assert.strictEqual(isNotAllUppercase("note"), true);
    assert.strictEqual(isNotAllUppercase("fIRST"), true);
});

test("title validator accepts titles without letters", () => {
    assert.strictEqual(isNotAllUppercase("2024"), true);
});

test("title validator rejects non-strings", () => {
    assert.strictEqual(isNotAllUppercase(undefined), false);
    assert.strictEqual(isNotAllUppercase(123), false);
});

test("isValidObjectId", () => {
    assert.strictEqual(isValidObjectId("64d91c42d8979e1f30a12346"), true);
    assert.strictEqual(isValidObjectId("123"), false);
    assert.strictEqual(isValidObjectId("zzzzzzzzzzzzzzzzzzzzzzzz"), false);
    assert.strictEqual(isValidObjectId(["64d91c42d8979e1f30a12346"]), false);
    assert.strictEqual(isValidObjectId(undefined), false);
});

test("isNonEmptyString", () => {
    assert.strictEqual(isNonEmptyString("a"), true);
    assert.strictEqual(isNonEmptyString("   "), false);
    assert.strictEqual(isNonEmptyString({ $ne: null }), false);
});

test("readPositiveInteger", () => {
    assert.strictEqual(readPositiveInteger("2", "page"), 2);
    assert.strictEqual(readPositiveInteger(undefined, "page", 1), 1);
    assert.throws(() => readPositiveInteger("0", "page"), /positive integer/);
    assert.throws(() => readPositiveInteger("abc", "limit"), /positive integer/);
    assert.throws(() => readPositiveInteger("1.5", "limit"), /positive integer/);
});

test("escapeRegex neutralises regex characters", () => {
    assert.strictEqual(escapeRegex("a.b*c"), "a\\.b\\*c");
    assert.ok(new RegExp(escapeRegex("(x)+")).test("(x)+"));
});
