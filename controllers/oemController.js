const db = require('../models');
const OEM = db.oem;
const users = db.user;
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

exports.updateOEMStatus = async (req, res, next) => {
  try {
    const { oem_id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        status: 'fail',
        message: 'Status is required in request body',
      });
    }

    // Update OEM status
    const oem = await OEM.findByPk(oem_id);
    if (!oem) {
      return res.status(404).json({ status: 'fail', message: 'OEM not found' });
    }

    await oem.update({ status });

    // Update all users linked to this OEM
    const userUpdateCount = await users.update(
      { userStatus: status },
      { where: { 	organizationOrgId: oem_id } }
    );

    res.status(200).json({
      status: 'success',
      message: 'OEM and user statuses updated successfully',
      data: {
        oem_id: oem.oem_id,
        new_status: status,
        
      },
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

exports.getOEMStatus = async (req, res, next) => {
  try {
    const { oem_id } = req.params;

    const oem = await OEM.findByPk(oem_id, {
      attributes: ['oem_id', 'oem_status']
    });

    if (!oem) {
      return res.status(404).json({
        status: 'fail',
        message: 'OEM not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        oem_id: oem.oem_id,
        status: oem.oem_status
      }
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};