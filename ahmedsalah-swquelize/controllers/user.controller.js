const { ValidationError, UniqueConstraintError } = require('sequelize');
const { User } = require('../models');
const { sendError } = require('../utils/responses');

async function signup(req, res) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return sendError(res, 400, 'name, email and password are required.');
    }

    const oldUser = await User.findOne({ where: { email } });
    if (oldUser) {
      return sendError(res, 409, 'Email already exists.');
    }

    const user = User.build({ name, email, password, role });
    await user.save();

    return res.status(201).json({ message: 'User added successfully.' });
  } catch (error) {
    if (error instanceof ValidationError) {
      return sendError(res, 400, error.errors.map(item => item.message).join(', '));
    }
    if (error instanceof UniqueConstraintError) {
      return sendError(res, 409, 'Email already exists.');
    }
    return sendError(res, 500, 'Something went wrong.');
  }
}

async function createOrUpdateUser(req, res) {
  try {
    const userId = Number(req.params.id);
    if (!Number.isInteger(userId) || userId <= 0) {
      return sendError(res, 400, 'Invalid user id.');
    }

    const values = {};
    ['name', 'email', 'password', 'role'].forEach(key => {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        values[key] = req.body[key];
      }
    });

    let user = await User.findByPk(userId);
    if (user) {
      user.set(values);
      await user.save({ validate: false });
    } else {
      user = User.build({ id: userId, ...values });
      await user.save({ validate: false });
    }

    return res.status(200).json({ message: 'User created or updated successfully.' });
  } catch (error) {
    return sendError(res, 500, 'Something went wrong.');
  }
}

async function getUserByEmail(req, res) {
  try {
    const { email } = req.query;
    if (!email) {
      return sendError(res, 400, 'Email is required.');
    }

    const user = await User.findOne({ where: { email }, attributes: { exclude: ['password'] } });
    if (!user) {
      return sendError(res, 404, 'no user found');
    }

    return res.status(200).json({ user });
  } catch (error) {
    return sendError(res, 500, 'Something went wrong.');
  }
}

async function getUserById(req, res) {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['role', 'password'] }
    });

    if (!user) {
      return sendError(res, 404, 'no user found');
    }

    return res.status(200).json(user);
  } catch (error) {
    return sendError(res, 500, 'Something went wrong.');
  }
}

module.exports = { signup, createOrUpdateUser, getUserByEmail, getUserById };
