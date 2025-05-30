const db = require('../models');
const Budget = db.budget;
const AppError = require('../utils/appError');

// CREATE
exports.createBudget = async (req, res, next) => {
  try {
    const newBudget = await Budget.create(req.body);
    res.status(201).json({ status: 'success', data: newBudget });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// READ ALL
exports.getAllBudgets = async (req, res, next) => {
  try {
    const budgets = await Budget.findAll({ include: db.oem });
    res.status(200).json({ status: 'success', data: budgets });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// READ ONE
exports.getBudgetById = async (req, res, next) => {
  try {
    const budget = await Budget.findByPk(req.params.id, { include: db.oem });
    if (!budget) return next(new AppError('Budget not found', 404));
    res.status(200).json({ status: 'success', data: budget });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// UPDATE
exports.updateBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findByPk(req.params.id);
    if (!budget) return next(new AppError('Budget not found', 404));

    await budget.update(req.body);
    res.status(200).json({ status: 'success', data: budget });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// DELETE
exports.deleteBudget = async (req, res, next) => {
  try {
    const result = await Budget.destroy({ where: { budget_id: req.params.id } });
    if (!result) return next(new AppError('Budget not found', 404));
    res.status(200).json({ status: 'success', message: 'Budget deleted successfully' });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

exports.getBudgetDetailsByOEM = async (req, res, next) => {
  try {
    const { oem_id } = req.params;

    const budget = await Budget.findOne({
      where: { oem_id },
    });

    if (!budget) return next(new AppError('Budget not found', 200));

    res.status(200).json({
      status: 'success',
      data: budget,
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};