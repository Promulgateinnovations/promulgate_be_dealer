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
const {
  socialMediaConnection,
  campaignDefinition,
  campaignSelectionChannel,
} = require('../models');
const CampaignDefinition = db.campaignDefinition;
const Organization = db.organization;
const SocialMediaConnection = db.socialMediaConnection;
const CampaignContent = db.campaignContent;
const CampaignContentPost = db.campaignContentPost;
const {
  getSocailMediaConnectioByName,
} = require('../controllers/socailMediaConnectionController');


exports.getChannelIds = (channels, orgId, next) => {
  let channelId = [];
  return new Promise((resolve, reject) => {
    channels.forEach((element) => {
      getSocailMediaConnectioByName(element, orgId, next).then((res) => {
        channelId.push(res);
        if (channelId.length === channels.length) {
          resolve(channelId);
        }
      });
    });
  });
};

exports.createCampaignSelection = async (
  selectionChannel,
  channelName,
  next
) => {
  console.log("selectionChannel====>>>>>>")
  console.log(selectionChannel)

  try {
    const operation = await db.campaignSelectionChannel.create(
      selectionChannel
    );
    return {
      campaignSelectionId: operation.dataValues.campaignSelectionId,
      name: channelName,
    };
  } catch (err) {
    next(new AppError(err.message, 200));
  }
};

exports.createCampaignSelectionChannels = async (req, res, next) => {
  try {
    console.log("CreateCampaignSelectionChannels")
    console.log(res.body)
    const { channels, campaignDefinitionId, orgId } = req.body;
    console.log(campaignDefinitionId)
    let response = [];
    if (channels.length > 0) {
      this.getChannelIds(channels, orgId, next).then((Res) => {
        console.log("Res")
        console.log(Res)
        let promises = [];
        Res.forEach((currentChannelId, index) => {
          let campaignSelectedChannels = {
            socialMediaConnectionSocalMediaConnectionId: currentChannelId,
            campaignDefinitionCampaignDefinitionId: campaignDefinitionId,
          };
          promises.push(
            this.createCampaignSelection(
              campaignSelectedChannels,
              channels[index],
              next
            )
          );
        });
        Promise.all(promises).then((response) => {
          res.send({
            status: 'success',
            data: response,
          });
        });
      });
    } else {
      next(new AppError('Please provide channel information', 200));
    }

  } catch (err) {
    next(new AppError(err.message, 200));
  }
};

exports.updateCampaignSelectionChannels = async (req, res, next) => {
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

exports.getCampaignSelectionChannels = async (req, res, next) => {
  const { campaignDefinitionId } = req.body;

  try {
    const campaignSelectionChannelDetails = await campaignDefinition.findAll({
      where: { campaignDefinitionId },
      attributes: ['campaignDefinitionId'],
      include: [
        {
          model: campaignSelectionChannel,
          as: 'campaignSelectionChannels',
          attributes: ['campaignSelectionId'],
          include: [
            {
              model: socialMediaConnection,
              as: 'socialMediaConnection',
              attributes: ['name'],
            },
          ],
        },
      ],
    });
    if (campaignSelectionChannelDetails) {
      res.send({
        status: 'success',
        data: campaignSelectionChannelDetails,
      });
    } else {
      next(new AppError('No Record Found', 200));
    }
  } catch (err) {
    next(new AppError(err.message, 200));
  }
};
