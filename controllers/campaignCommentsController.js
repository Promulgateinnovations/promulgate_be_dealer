/**
 * @author [Pradeep]
 * @email [pradeep@promulgateinnovation.com]
 * @create date 2021-03-02 18:46:24
 * @modify date 2021-03-02 18:46:24
 * @desc [Helper functions for Team related task]
 */

const db = require('../models');
const AppError = require('../utils/appError');
const campaignComment = db.campaignComments;
/**
 * Function to create comments into the Database for the particular campaign
 * @param {object} req
 * @param {object} res
 * @param {object} next
 */


exports.createCampaignComments = async (req, res, next) => {
  const comments = {
    comments: req.body.comments,
    campaignDefinitionCampaignDefinitionId: req.body.campaignDefinitionId,
    userUserId: req.body.userId,
  };
  try {
    const comment = await campaignComment.create(comments);
    res.send({
      status: 'success',
      data: comment,
    });
  } catch (err) {
    next(new AppError(err.message, 200));
  }
};

exports.savePaidAnalyticsAmount = async (req, res, next) => {
  const { campaign_id, orgId, amt, amtFor } = req.body;
  
  try {
    const updatedItem = {};
    if (amtFor === 'fbLeads') {
      updatedItem.fbLeadsAmount = amt;
    } else if (amtFor === 'whatsApp') {
      updatedItem.whatsAppLeadsAmount = amt;
    }
    const updateAmount = await db.campaignDefinition.update(updatedItem, {
      where: { campaignDefinitionId: campaign_id },
    });
    res.send({
      status: 'success',
      message: 'Paid amount saved.',
    });
  } catch (err) {
    next(new AppError(err.message, 200));
  }
};
