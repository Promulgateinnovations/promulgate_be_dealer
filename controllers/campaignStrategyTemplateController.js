const db = require('../models');
const CampaignStrategyTemplate = db.campaignStrategyTemplate;
const AppError = require('../utils/appError');

// CREATE
exports.createStrategy = async (req, res, next) => {
  try {
    const strategy = await CampaignStrategyTemplate.create(req.body);
    res.status(201).json({ status: 'success', data: strategy });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// READ ALL
exports.getAllStrategies = async (req, res, next) => {
  try {
    const strategies = await CampaignStrategyTemplate.findAll();
    res.status(200).json({ status: 'success', data: strategies });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// READ ONE
exports.getStrategyById = async (req, res, next) => {
  try {
    const strategy = await CampaignStrategyTemplate.findByPk(req.params.id);
    if (!strategy) return next(new AppError('Strategy not found', 404));
    res.status(200).json({ status: 'success', data: strategy });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// UPDATE
exports.updateStrategy = async (req, res, next) => {
  try {
    const strategy = await CampaignStrategyTemplate.findByPk(req.params.id);
    if (!strategy) return next(new AppError('Strategy not found', 404));

    await strategy.update(req.body);
    res.status(200).json({ status: 'success', data: strategy });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// DELETE
exports.deleteStrategy = async (req, res, next) => {
  try {
    const result = await CampaignStrategyTemplate.destroy({ where: { id: req.params.id } });
    if (!result) return next(new AppError('Strategy not found', 404));
    res.status(200).json({ status: 'success', message: 'Strategy deleted successfully' });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};
