const db = require('../models');
const Zone = db.zone;
const AppError = require('../utils/appError');

// CREATE
exports.createZone = async (req, res, next) => {
  try {
    const newZone = await Zone.create(req.body);
    res.status(201).json({ status: 'success', data: newZone });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// READ ALL
exports.getAllZones = async (req, res, next) => {
  try {
    const zones = await Zone.findAll({ include: db.oem });
    res.status(200).json({ status: 'success', data: zones });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// READ ONE
exports.getZoneById = async (req, res, next) => {
  try {
    const zone = await Zone.findByPk(req.params.id, { include: db.oem });
    if (!zone) return next(new AppError('Zone not found', 404));
    res.status(200).json({ status: 'success', data: zone });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// UPDATE
exports.updateZone = async (req, res, next) => {
  try {
    const zone = await Zone.findByPk(req.params.id);
    if (!zone) return next(new AppError('Zone not found', 404));

    await zone.update(req.body);
    res.status(200).json({ status: 'success', data: zone });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// DELETE
exports.deleteZone = async (req, res, next) => {
  try {
    const result = await Zone.destroy({ where: { zone_id: req.params.id } });
    if (!result) return next(new AppError('Zone not found', 404));
    res.status(200).json({ status: 'success', message: 'Zone deleted successfully' });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};
