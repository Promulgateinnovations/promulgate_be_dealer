const db = require('../models');
const Region = db.region;
const AppError = require('../utils/appError');

// CREATE
exports.createRegion = async (req, res, next) => {
  try {
    const newRegion = await Region.create(req.body);
    res.status(201).json({ status: 'success', data: newRegion });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// READ ALL
exports.getAllRegions = async (req, res, next) => {
  try {
    const regions = await Region.findAll({ include: db.zone });
    res.status(200).json({ status: 'success', data: regions });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// READ ONE
exports.getRegionById = async (req, res, next) => {
  try {
    const region = await Region.findByPk(req.params.id, { include: db.zone });
    if (!region) return next(new AppError('Region not found', 404));
    res.status(200).json({ status: 'success', data: region });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// UPDATE
exports.updateRegion = async (req, res, next) => {
  try {
    const region = await Region.findByPk(req.params.id);
    if (!region) return next(new AppError('Region not found', 404));

    await region.update(req.body);
    res.status(200).json({ status: 'success', data: region });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// DELETE
exports.deleteRegion = async (req, res, next) => {
  try {
    const result = await Region.destroy({ where: { region_id: req.params.id } });
    if (!result) return next(new AppError('Region not found', 404));
    res.status(200).json({ status: 'success', message: 'Region deleted successfully' });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};
