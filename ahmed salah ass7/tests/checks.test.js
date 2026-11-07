const test = require("node:test");
const assert = require("node:assert/strict");
const { isObject, hasValidTitle, readInteger } = require("../utils/checks");

test("isObject accepts plain objects only", () => {
    assert.equal(isObject({}), true);
    assert.equal(isObject([]), false);
    assert.equal(isObject(null), false);
});

test("hasValidTitle rejects missing, empty, spaces-only and non-string titles", () => {
    assert.equal(hasValidTitle({ title: "Future" }), true);
    assert.equal(hasValidTitle({}), false);
    assert.equal(hasValidTitle({ title: "" }), false);
    assert.equal(hasValidTitle({ title: "   " }), false);
    assert.equal(hasValidTitle({ title: 5 }), false);
});

test("readInteger accepts whole numbers", () => {
    assert.equal(readInteger("1990", "from"), 1990);
    assert.equal(readInteger(" 2010 ", "to"), 2010);
});

test("readInteger rejects empty, spaces, decimals, text and repeated values", () => {
    for (const bad of [undefined, "", " ", "1.5", "abc", "1e3", ["1", "2"]]) {
        assert.throws(() => readInteger(bad, "year"), /must be an integer/);
    }
});
