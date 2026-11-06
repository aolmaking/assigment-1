function checkPasswordLength(value) {
  if (typeof value !== 'string' || value.length <= 6) {
    throw new Error('Password must be greater than 6 characters.');
  }
}

async function checkNameLength(user) {
  if (typeof user.name !== 'string' || user.name.trim().length <= 2) {
    throw new Error('Name must be greater than 2 characters.');
  }
}

module.exports = { checkPasswordLength, checkNameLength };
