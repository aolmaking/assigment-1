const express = require('express');
const controller = require('../controllers/user.controller');
const router = express.Router();

router.post('/signup', controller.signup);
router.put('/:id', controller.createOrUpdateUser);
router.get('/by-email', controller.getUserByEmail);
router.get('/:id', controller.getUserById);

module.exports = router;
