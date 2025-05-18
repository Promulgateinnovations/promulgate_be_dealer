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


// GET all dealers by OEM ID, Zone ID, and Region ID

exports.getZonesByOEM = async (req, res, next) => {
  try {
    const { oem_id } = req.params;

    // Fetch all zones for the given OEM
    const zones = await Zone.findAll({
      where: { oem_id },
      attributes: ['zone_id', 'zone_name', 'zone_code', 'oem_id']
    });

    if (!zones || zones.length === 0) {
      return res.status(200).json({ status: 'success', message: 'No zones found for the specified OEM' });
    }

    res.status(200).json({ status: 'success', data: zones });
  } catch (err) {
    next(err);
  }
};

