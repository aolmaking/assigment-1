const express = require('express');
const controller = require('../controllers/comment.controller');
const router = express.Router();

router.post('/find-or-create', controller.findOrCreateComment);
router.get('/search', controller.searchComments);
router.get('/newest/:postId', controller.getNewestComments);
router.get('/details/:id', controller.getCommentDetails);
router.post('/', controller.createComments);
router.patch('/:commentId', controller.updateComment);

module.exports = router;
