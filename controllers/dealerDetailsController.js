const db = require('../models');
const DealerDetails = db.dealerDetails;
const AppError = require('../utils/appError');

// CREATE
exports.createDealer = async (req, res, next) => {
  try {
    const dealer = await DealerDetails.create(req.body);
    res.status(201).json({ status: 'success', data: dealer });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// READ ALL
exports.getAllDealers = async (req, res, next) => {
  try {
    const dealers = await db.dealerDetails.findAll({
      where: req.query.oem_id ? { oem_id: req.query.oem_id } : {},
      include: [{ model: db.oem }]
    });
    res.status(200).json({ status: 'success', data: dealers });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// READ ONE
exports.getDealerById = async (req, res, next) => {
  try {
    const dealer = await DealerDetails.findByPk(req.params.id);
    if (!dealer) return next(new AppError('Dealer not found', 404));
    res.status(200).json({ status: 'success', data: dealer });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// UPDATE
exports.updateDealer = async (req, res, next) => {
  try {
    const dealer = await DealerDetails.findByPk(req.params.id);
    if (!dealer) return next(new AppError('Dealer not found', 404));

    await dealer.update(req.body);
    res.status(200).json({ status: 'success', data: dealer });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// DELETE
exports.deleteDealer = async (req, res, next) => {
  try {
    const result = await DealerDetails.destroy({ where: { id: req.params.id } });
    if (!result) return next(new AppError('Dealer not found', 404));
    res.status(200).json({ status: 'success', message: 'Dealer deleted successfully' });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};
