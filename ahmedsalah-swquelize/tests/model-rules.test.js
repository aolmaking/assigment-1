const test = require('node:test');
const assert = require('node:assert/strict');
const { checkPasswordLength, checkNameLength } = require('../utils/userValidation');

test('accepts password longer than six characters', () => {
  assert.doesNotThrow(() => checkPasswordLength('1234567'));
});

test('rejects password with six characters', () => {
  assert.throws(() => checkPasswordLength('123456'));
});

test('accepts a name longer than two characters', async () => {
  await assert.doesNotReject(() => checkNameLength({ name: 'Ahmed' }));
});

test('rejects a name with two characters', async () => {
  await assert.rejects(() => checkNameLength({ name: 'Al' }));
});
