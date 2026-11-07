// Small helpers shared by the controllers.

// True for plain objects only (not null, not arrays).
function isObject(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}

// True when the book has a title that is a string with at least one visible character.
function hasValidTitle(book) {
    return typeof book.title === "string" && book.title.trim() !== "";
}

// Reads a whole number from a query string value like "1990".
// Rejects empty values, spaces only, decimals, text, and repeated parameters.
function readInteger(value, fieldName) {
    if (typeof value !== "string" || !/^-?\d+$/.test(value.trim())) {
        const error = new Error(`${fieldName} must be an integer`);
        error.statusCode = 400;
        throw error;
    }

    return Number(value.trim());
}

module.exports = {
    isObject,
    hasValidTitle,
    readInteger
};
