const db = require('../models');
const OEM = db.oem;
const AppError = require('../utils/appError');

// CREATE
exports.createOEM = async (req, res, next) => {
  try {
    const newOEM = await OEM.create(req.body);
    res.status(201).json({ status: 'success', data: newOEM });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// READ ALL
exports.getAllOEMs = async (req, res, next) => {
  try {
    const oems = await OEM.findAll();
    res.status(200).json({ status: 'success', data: oems });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// READ ONE
exports.getOEMById = async (req, res, next) => {
  try {
    const oem = await OEM.findByPk(req.params.id);
    if (!oem) return next(new AppError('OEM not found', 404));
    res.status(200).json({ status: 'success', data: oem });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// UPDATE
exports.updateOEM = async (req, res, next) => {
  try {
    const oem = await OEM.findByPk(req.params.id);
    if (!oem) return next(new AppError('OEM not found', 404));

    await oem.update(req.body);
    res.status(200).json({ status: 'success', data: oem });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// DELETE
exports.deleteOEM = async (req, res, next) => {
  try {
    const result = await OEM.destroy({ where: { oem_id: req.params.id } });
    if (!result) return next(new AppError('OEM not found', 404));
    res.status(200).json({ status: 'success', message: 'OEM deleted successfully' });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};
