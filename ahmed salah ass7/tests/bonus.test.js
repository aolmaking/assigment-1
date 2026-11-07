const test = require("node:test");
const assert = require("node:assert/strict");
const romanToInt = require("../bonus");

test("converts III to 3", () => {
    assert.equal(romanToInt("III"), 3);
});

test("converts LVIII to 58", () => {
    assert.equal(romanToInt("LVIII"), 58);
});

test("converts MCMXCIV to 1994", () => {
    assert.equal(romanToInt("MCMXCIV"), 1994);
});

test("converts IV to 4", () => {
    assert.equal(romanToInt("IV"), 4);
});

test("converts IX to 9", () => {
    assert.equal(romanToInt("IX"), 9);
});

test("converts XL to 40", () => {
    assert.equal(romanToInt("XL"), 40);
});

test("converts MMMCMXCIX to 3999", () => {
    assert.equal(romanToInt("MMMCMXCIX"), 3999);
});

test("converts CD to 400 and CM to 900", () => {
    assert.equal(romanToInt("CD"), 400);
    assert.equal(romanToInt("CM"), 900);
});

test("converts a single symbol", () => {
    assert.equal(romanToInt("I"), 1);
    assert.equal(romanToInt("M"), 1000);
});

test("converts XC to 90 and XXVII to 27", () => {
    assert.equal(romanToInt("XC"), 90);
    assert.equal(romanToInt("XXVII"), 27);
});
