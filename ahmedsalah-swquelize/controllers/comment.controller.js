const { Op } = require('sequelize');
const { User, Post, Comment } = require('../models');
const { sendError } = require('../utils/responses');

async function createComments(req, res) {
  try {
    const { comments } = req.body;
    if (!Array.isArray(comments) || comments.length === 0) {
      return sendError(res, 400, 'comments must be a non-empty array.');
    }

    await Comment.bulkCreate(comments, { validate: true });
    return res.status(201).json({ message: 'comments created.' });
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeForeignKeyConstraintError') {
      return sendError(res, 400, error.message);
    }
    return sendError(res, 500, 'Something went wrong.');
  }
}

async function updateComment(req, res) {
  try {
    const { commentId } = req.params;
    const { userId, content } = req.body;
    if (!userId || typeof content !== 'string' || !content.trim()) {
      return sendError(res, 400, 'userId and content are required.');
    }

    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return sendError(res, 404, 'comment not found.');
    }
    if (Number(comment.userId) !== Number(userId)) {
      return sendError(res, 403, 'You are not authorized to update this comment.');
    }

    comment.content = content;
    await comment.save();
    return res.status(200).json({ message: 'Comment updated.' });
  } catch (error) {
    return sendError(res, 500, 'Something went wrong.');
  }
}

async function findOrCreateComment(req, res) {
  try {
    const { postId, userId, content } = req.body;
    if (!postId || !userId || typeof content !== 'string' || !content.trim()) {
      return sendError(res, 400, 'postId, userId and content are required.');
    }

    const [comment, created] = await Comment.findOrCreate({
      where: { postId, userId, content },
      defaults: { postId, userId, content }
    });

    return res.status(200).json({ comment, created });
  } catch (error) {
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return sendError(res, 400, 'User or post not found.');
    }
    return sendError(res, 500, 'Something went wrong.');
  }
}

async function searchComments(req, res) {
  try {
    const { word } = req.query;
    if (!word) {
      return sendError(res, 400, 'word is required.');
    }

    const where = { content: { [Op.like]: `%${word}%` } };
    const comments = await Comment.findAll({ where, order: [['id', 'ASC']] });
    const count = await Comment.count({ where });

    if (count === 0) {
      return res.status(404).json({ message: 'no comments found.' });
    }
    return res.status(200).json({ count, comments });
  } catch (error) {
    return sendError(res, 500, 'Something went wrong.');
  }
}

async function getNewestComments(req, res) {
  try {
    const comments = await Comment.findAll({
      where: { postId: req.params.postId },
      attributes: ['id', 'content', 'createdAt'],
      order: [['createdAt', 'DESC']],
      limit: 3
    });
    return res.status(200).json(comments);
  } catch (error) {
    return sendError(res, 500, 'Something went wrong.');
  }
}

async function getCommentDetails(req, res) {
  try {
    const comment = await Comment.findByPk(req.params.id, {
      attributes: ['id', 'content'],
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        { model: Post, as: 'post', attributes: ['id', 'title', 'content'] }
      ]
    });

    if (!comment) {
      return sendError(res, 404, 'no comment found');
    }
    return res.status(200).json(comment);
  } catch (error) {
    return sendError(res, 500, 'Something went wrong.');
  }
}

module.exports = {
  createComments,
  updateComment,
  findOrCreateComment,
  searchComments,
  getNewestComments,
  getCommentDetails
};
