const db = require('../models');
//const DealerDetails = db.dealerDetails;
//const OEM = db.oem;
const AppError = require('../utils/appError');
const { OEM, Zone, Region, DealerDetails } = require('../models');


// CREATE dealer
exports.createDealer = async (req, res, next) => {
  try {
    const dealer = await DealerDetails.create(req.body);
    res.status(201).json({ status: 'success', data: dealer });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// GET all dealers (optionally filtered by oem_id) with Zone and Region details
exports.getAllDealers = async (req, res, next) => {
  try {
    const { oem_id } = req.query;
    const condition = oem_id ? { oem_id } : {};

    const dealers = await db.dealerDetails.findAll({
      where: condition,
      include: [
        {
          model: db.oem,
          attributes: ['oem_id', 'oem_name', 'oem_code'],
          include: [
            {
              model: db.zone,
              attributes: ['zone_id', 'zone_name'],
              include: [
                {
                  model: db.region,
                  attributes: ['region_id', 'region_name']
                }
              ]
            }
          ]
        }
      ]
    });

    res.status(200).json({ status: 'success', data: dealers });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};



// GET a dealer by dealer ID
exports.getDealerById = async (req, res, next) => {
  try {
    const dealer = await DealerDetails.findByPk(req.params.id, {
      include: [{ 
        model: OEM,
        attributes: ['oem_id', 'oem_name', 'oem_code'] 
      }]
    });

    if (!dealer) return next(new AppError('Dealer not found', 404));

    res.status(200).json({ status: 'success', data: dealer });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// UPDATE a dealer
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

// DELETE a dealer
exports.deleteDealer = async (req, res, next) => {
  try {
    const deleted = await DealerDetails.destroy({ where: { id: req.params.id } });
    if (!deleted) return next(new AppError('Dealer not found', 404));

    res.status(200).json({ status: 'success', message: 'Dealer deleted successfully' });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};