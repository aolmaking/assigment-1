function isValidObjectId(value) {
    return typeof value === "string" && /^[a-fA-F0-9]{24}$/.test(value);
}

function isNotAllUppercase(value) {
    if (typeof value !== "string") return false;
    const hasLetters = value.toLowerCase() !== value.toUpperCase();
    return !hasLetters || value !== value.toUpperCase();
}

function isNonEmptyString(value) {
    return typeof value === "string" && value.trim() !== "";
}

function readPositiveInteger(value, fieldName, defaultValue) {
    if (value === undefined || String(value).trim() === "") {
        return defaultValue;
    }

    const number = Number(value);

    if (!Number.isSafeInteger(number) || number < 1) {
        const error = new Error(`${fieldName} must be a positive integer`);
        error.statusCode = 400;
        throw error;
    }

    return number;
}

function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

module.exports = {
    isValidObjectId,
    isNotAllUppercase,
    isNonEmptyString,
    readPositiveInteger,
    escapeRegex
};
