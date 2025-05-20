const db = require('../models');
const BusinessDetails = db.businessDetails;
const AppError = require('../utils/appError');

// CREATE
exports.createBusinessDetails = async (req, res, next) => {
  try {
    const details = await BusinessDetails.create(req.body);
    res.status(201).json({ status: 'success', data: details });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// READ ALL
exports.getAllBusinessDetails = async (req, res, next) => {
  try {
    const details = await BusinessDetails.findAll({ include: db.oem });
    res.status(200).json({ status: 'success', data: details });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// READ ONE
exports.getBusinessDetailsById = async (req, res, next) => {
  try {
    const details = await BusinessDetails.findByPk(req.params.id, { include: db.oem });
    if (!details) return next(new AppError('Business details not found', 404));
    res.status(200).json({ status: 'success', data: details });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// UPDATE
exports.updateBusinessDetails = async (req, res, next) => {
  try {
    const details = await BusinessDetails.findByPk(req.params.id);
    if (!details) return next(new AppError('Business details not found', 404));

    await details.update(req.body);
    res.status(200).json({ status: 'success', data: details });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// DELETE
exports.deleteBusinessDetails = async (req, res, next) => {
  try {
    const result = await BusinessDetails.destroy({ where: { business_id: req.params.id } });
    if (!result) return next(new AppError('Business details not found', 404));
    res.status(200).json({ status: 'success', message: 'Business details deleted successfully' });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};



exports.getBusinessDetailsByOEM = async (req, res, next) => {
  try {
    const { oem_id } = req.params;

    const businessDetails = await BusinessDetails.findOne({
      where: { oem_id },
    });

    if (!businessDetails) return next(new AppError('Business details not found', 404));
      
    res.status(200).json({
      status: 'success',
      data: businessDetails,
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};
