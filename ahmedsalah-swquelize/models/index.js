const { User } = require('./user.model');
const { Post } = require('./post.model');
const { Comment } = require('./comment.model');

User.hasMany(Post, { foreignKey: 'userId', as: 'posts', onDelete: 'CASCADE' });
Post.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Comment, { foreignKey: 'userId', as: 'comments', onDelete: 'CASCADE' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Post.hasMany(Comment, { foreignKey: 'postId', as: 'comments', onDelete: 'CASCADE' });
Comment.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

module.exports = { User, Post, Comment };
