/**
 * @author [Pradeep]
 * @email [pradeep@promulgateinnovation.com]
 * @create date 2021-03-02 18:46:24
 * @modify date 2021-03-02 18:46:24
 * @desc [Helper functions for Team related task]
 */

const db = require('../models');
const fs = require('fs');
const AppError = require('../utils/appError');
const { campaignViewer, campaignDefinition } = require('../models');


exports.checkPostBody = (req, res, next) => {
  next();
};

exports.createCampaignViewers = async (req, res, next) => {
  try {
    const foundItem = await db.campaignViewer.findOne({
      where: { campaignDefinitionCampaignDefinitionId: req.body.campaignDefinitionId }
    });

    if (foundItem) {
      next(new AppError("campaign Viewer is already associated with current campaign", 200));
    } else {
      const campaignViewerData = {
        ageMax: req.body.ageMax,
        ageMin: req.body.ageMin,
        psychographic: req.body.psychographic,
        gender: req.body.gender,
        state: req.body.state,
        country: req.body.country,
        campaignDefinitionCampaignDefinitionId: req.body.campaignDefinitionId,
        languages: req.body.languages
      };
      const createcampaginViewer = await campaignViewer.create(
        campaignViewerData
      );
      res.send({
        status: 'success',
        data: createcampaginViewer,
      });
    }
  } catch (err) {
    next(new AppError(err.message, 200));
  }
};

exports.updateCampaignViewers = async (req, res, next) => {
  const { campaignViewerId } = req.body;
  try {
    const foundItem = await db.campaignViewer.findOne({
      where: { campaignViewerId },
    });
    if (!foundItem) {
      next(new AppError('No Record Found', 200));
    } else {
      try {
        const updatedItem = {};
        updatedItem.ageMax = req.body.ageMax || foundItem.ageMax;
        updatedItem.ageMin = req.body.ageMin || foundItem.ageMin;
        updatedItem.psychographic =
          req.body.psychographic || foundItem.psychographic;
        updatedItem.gender = req.body.gender || foundItem.gender;
        updatedItem.state = req.body.state || foundItem.state;
        updatedItem.country = req.body.country || foundItem.country;
        updatedItem.languages = req.body.languages || foundItem.languages

        const updateRecord = await db.campaignViewer.update(updatedItem, {
          where: { campaignViewerId },
        });
        res.send({
          status: 'success',
          message: 'campaignViewer Updated Succesfully',
        });
      } catch (err) {
        next(new AppError(err.message, 200));
      }
    }
  } catch (err) {
    next(new AppError(err.message, 200));
  }
};

exports.getCampaginViewers = async (req, res, next) => {
  const { campaignViewerId, campaignDefinitionId } = req.body;

  try {
    const campaignViewerDetails = await campaignDefinition.findAll({
      where: { campaignDefinitionId },
      attributes: ['campaignDefinitionId'],
      include: [
        {
          model: campaignViewer,
          as: 'CampaignViewer',
          attributes: [
            'campaignViewerId',
            'ageMax',
            'ageMin',
            'psychographic',
            'gender',
            'state',
            'country',
            'languages'
          ],
        },
      ],
    });
    if (campaignViewerDetails) {
      res.send({
        status: 'success',
        data: campaignViewerDetails,
      });
    } else {
      next(new AppError('No Record Found', 200));
    }
  } catch (err) {
    next(new AppError(err.message, 200));
  }
};
