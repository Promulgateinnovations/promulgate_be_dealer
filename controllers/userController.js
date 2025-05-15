// controllers/userController.js
const db = require('../models');
const User = db.user;
const AppError = require('../utils/appError');

// Create a new user
exports.createUser = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json({ status: 'success', data: newUser });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// Get all users
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.status(200).json({ status: 'success', data: users });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// Get a single user by ID
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId);
    if (!user) return next(new AppError('User not found', 404));

    res.status(200).json({ status: 'success', data: user });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// Update a user by ID
exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId);
    if (!user) return next(new AppError('User not found', 404));

    await user.update(req.body);
    res.status(200).json({ status: 'success', data: user });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// Delete a user by ID
exports.deleteUser = async (req, res, next) => {
  try {
    const deleted = await User.destroy({ where: { userId: req.params.userId } });
    if (!deleted) return next(new AppError('User not found', 404));

    res.status(200).json({ status: 'success', message: 'User deleted successfully' });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};
