require('dotenv').config();
const express = require('express');
const { sequelize, createDatabase } = require('./config/database');
require('./models');
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
const commentRoutes = require('./routes/comment.routes');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Assignment 5 API is running.' });
});

app.use('/users', userRoutes);
app.use('/user', userRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

async function startServer() {
  try {
    await createDatabase();
    await sequelize.authenticate();
    await sequelize.sync();
    const port = Number(process.env.PORT || 3000);
    app.listen(port, () => {
      process.stdout.write(`Server is running on port ${port}\n`);
    });
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
