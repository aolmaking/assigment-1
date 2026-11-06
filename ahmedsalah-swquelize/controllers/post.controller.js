const { fn, col } = require('sequelize');
const { User, Post, Comment } = require('../models');
const { sendError } = require('../utils/responses');

async function createPost(req, res) {
  try {
    const { title, content, userId } = req.body;
    const post = new Post({ title, content, userId });
    await post.save();
    return res.status(201).json({ message: 'Post created successfully.' });
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeForeignKeyConstraintError') {
      return sendError(res, 400, error.message);
    }
    return sendError(res, 500, 'Something went wrong.');
  }
}

async function deletePost(req, res) {
  try {
    const { postId } = req.params;
    const { userId } = req.body;
    if (!userId) {
      return sendError(res, 400, 'userId is required.');
    }

    const post = await Post.findByPk(postId);
    if (!post) {
      return sendError(res, 404, 'Post not found.');
    }
    if (Number(post.userId) !== Number(userId)) {
      return sendError(res, 403, 'You are not authorized to delete this post.');
    }

    await post.destroy();
    return res.status(200).json({ message: 'Post deleted.' });
  } catch (error) {
    return sendError(res, 500, 'Something went wrong.');
  }
}

async function getPostDetails(req, res) {
  try {
    const posts = await Post.findAll({
      attributes: ['id', 'title'],
      include: [
        { model: User, as: 'user', attributes: ['id', 'name'] },
        { model: Comment, as: 'comments', attributes: ['id', 'content'] }
      ]
    });
    return res.status(200).json(posts);
  } catch (error) {
    return sendError(res, 500, 'Something went wrong.');
  }
}

async function getPostCommentCount(req, res) {
  try {
    const posts = await Post.findAll({
      attributes: [
        'id',
        'title',
        [fn('COUNT', col('comments.id')), 'commentCount']
      ],
      include: [{ model: Comment, as: 'comments', attributes: [], required: false }],
      group: ['Post.id'],
      order: [['id', 'ASC']]
    });
    return res.status(200).json(posts);
  } catch (error) {
    return sendError(res, 500, 'Something went wrong.');
  }
}

module.exports = { createPost, deletePost, getPostDetails, getPostCommentCount };
