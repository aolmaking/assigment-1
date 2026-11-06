const express = require('express');
const controller = require('../controllers/post.controller');
const router = express.Router();

router.post('/', controller.createPost);
router.get('/details', controller.getPostDetails);
router.get('/comment-count', controller.getPostCommentCount);
router.delete('/:postId', controller.deletePost);

module.exports = router;
