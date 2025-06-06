const db = require('../models');
const DealerDetails = db.dealerDetails;
const OEM = db.oem;
const Zone = db.zone;
const Region = db.region;
const AppError = require('../utils/appError');



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

    const dealers = await DealerDetails.findAll({
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


// GET dealers by OEM ID, Zone ID, and Region ID
// This endpoint retrieves dealers based on the OEM ID, Zone ID, and Region ID.
exports.getDealersByOEMZoneRegion = async (req, res, next) => {
  try {
    const { oem_id, zone_id, region_id } = req.params;

    // Fetch dealers by OEM, Zone, and Region
    const dealers = await DealerDetails.findAll({
      where: { oem_id },
      include: [
        {
          model: Region,
          where: { region_id, oem_id },
          attributes: ['region_id', 'region_name', 'zone_id'],
          include: [
            {
              model: Zone,
              where: { zone_id, oem_id },
              attributes: ['zone_id', 'zone_name', 'oem_id'],
              include: [
                {
                  model: OEM,
                  where: { oem_id },
                  attributes: ['oem_id', 'oem_name', 'oem_code']
                }
              ]
            }
          ]
        }
      ]
    });

    if (!dealers || dealers.length === 0) {
      return res.status(200).json({ status: 'success', message: 'No dealers found for the specified OEM, Zone, and Region' });
    }

    res.status(200).json({ status: 'success', data: dealers });
  } catch (err) {
    next(err);
  }
};

exports.updateDealerStatus = async (req, res, next) => {
  try {
    const { dealer_id } = req.params;
    const { dealer_status } = req.body;

    if (!dealer_status) {
      return res.status(400).json({
        status: 'fail',
        message: 'dealer_status is required in the request body',
      });
    }

    const dealer = await DealerDetails.findByPk(dealer_id);
    if (!dealer) {
      return res.status(404).json({
        status: 'fail',
        message: 'Dealer not found',
      });
    }

    await dealer.update({ dealer_status });

    res.status(200).json({
      status: 'success',
      message: 'Dealer status updated successfully',
      data: {
        dealer_id: dealer.dealer_id,
        dealer_status: dealer.dealer_status,
      },
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};



exports.getDealersByOEMID = async (req, res, next) => {
  try {
    const { oem_id } = req.params;

    const dealers = await DealerDetails.findAll({
      where: { oem_id },
    });

    if (!dealers || dealers.length === 0) {
      return res.status(200).json({
        status: 'success',
        message: `No dealers found for OEM ID: ${oem_id}`,
      });
    }

    res.status(200).json({
      status: 'success',
      data: dealers,
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};
