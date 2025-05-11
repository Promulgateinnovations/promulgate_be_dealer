const db = require('../models');
const AppError = require('../utils/appError');

const Sequelize = require('sequelize');

const Organization = db.organization;
const campaignDefinition = db.campaignDefinition;
const campaignSelectionChannel = db.campaignSelectionChannel;
const socialMediaConnection = db.socialMediaConnection;
const campaignContent = db.campaignContent;
const campaignContentPost = db.campaignContentPost;
const campaignViewer = db.campaignViewer;
const WaBroadcastLog = db.waBroadcastLog;
const user = db.user;

/**
 * Function to get the list of campaigins for the current organziation
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */


exports.getCampaignListing = async (req, res, next) => {
  const { orgId } = req.body;
  const { pageSize = 1, page = 0 } = req.query;
  try {
    const campaignList = await campaignDefinition.findAndCountAll({
      where: {
        organizationOrgId: orgId,
      },
      order: [
        ['createdAt', 'DESC'],
      ],
      limit: parseInt(pageSize),
      offset: page * pageSize,
      attributes: [
        'campaignDefinitionId',
        'name',
        'status',
        'campaignTypes',
        'createdAt',
        'tags'
      ],
      include: [
        { model: user, as: 'user', attributes: ['firstName', 'lastName'] },
      ],
    });

    if (campaignList) {
      res.send({
        status: 'success',
        data: {
          campaignList,
          currentPage: page,
          pageSize: pageSize,
        },
      });
    } else {
      next(new AppError('No Record Found', 200));
    }
  } catch (err) {
    next(new AppError(err.message, 200));
  }
};

/**
 * Function to get all the campaign details for the current Organziation
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */


exports.getAllCampaignDetails = async (req, res, next) => {
  const { orgId } = req.body;
  try {
    const campaignList = await campaignDefinition.findAll({
      where: {
        organizationOrgId: orgId,
        status: ['OPEN', 'ACTIVE', 'DONE'],
      },
      attributes: ['campaignDefinitionId', 'tags'],
      include: [
        {
          model: campaignViewer,
          as: 'CampaignViewer',
          attributes: [
            'ageMax',
            'ageMin',
            'state',
            'country',
            'gender',
            'psychographic',
            'campaignViewerId',
            'languages'
          ],
        },
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
            {
              model: campaignContent,
              as: 'campaignContents',
              attributes: ['descritption', 'url', 'tags', 'toEmail', 'subject'],
              include: [
                {
                  model: campaignContentPost,
                  as: 'campaignContentPosts',
                  attributes: ['postAt'],
                },
              ],
            },
          ],
        },
      ],
    });
    res.send({
      status: 'success',
      data: campaignList,
    });
  } catch (err) {
    next(new AppError(err.message, 200));
  }
};

/**
 * Function to get the campagin details for particular campaign
 * @param {*} req
 * @param {*} res
 * @param {*} mext
 */


exports.getCampaignDetails = async (req, res, next) => {
  const { orgId, campaignDefinitionId } = req.body;
  try {
    const campaignList = await campaignDefinition.findOne({
      where: {
        organizationOrgId: orgId,
        campaignDefinitionId: campaignDefinitionId,
      },
      attributes: ['campaignDefinitionId', 'tags'],

      include: [
        {
          model: campaignViewer,
          as: 'CampaignViewer',
          attributes: [
            'ageMax',
            'ageMin',
            'state',
            'country',
            'gender',
            'psychographic',
            'campaignViewerId',
            'languages'
          ],
        },
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
            {
              model: campaignContent,
              as: 'campaignContents',
              attributes: ['descritption', 'url', 'tags', 'toEmail', 'subject', 'publishVideoAs'],
              include: [
                {
                  model: campaignContentPost,
                  as: 'campaignContentPosts',
                  attributes: ['postAt', 'postId', 'postStatus'],
                },
              ],
            },
          ],
        },
      ],
      order: [
        [db.Sequelize.col('postAt'), 'ASC']
      ],
    });
    res.send({
      status: 'success',
      data: campaignList,
    });
  } catch (err) {
    next(new AppError(err.message, 200));
  }
};

exports.getCampaignWhatsAppDetails = async (req, res, next) => {
  const { orgId, campaignDefinitionId } = req.body;
  try {
      const getCampaignWhatsAppData = await db.sequelize.query(
        'SELECT whatsappContentPosts.*, whatsappBroadcastContnents.wa_campaign FROM `whatsappBroadcastContnents` LEFT JOIN whatsappContentPosts ON whatsappContentPosts.whatsappBroadcastContnentWhatsappBroadcastContnentID = whatsappBroadcastContnents.whatsappBroadcastContnentID WHERE whatsappBroadcastContnents.wa_campaign = :campaignDefinitionId ORDER BY `whatsappBroadcastContnents`.`createdAt`  DESC',
        {
          replacements: { campaignDefinitionId: campaignDefinitionId},
          type: db.sequelize.QueryTypes.SELECT,
        }
      );

      res.send({
        status: 'success',
        data: getCampaignWhatsAppData,
      });
   
  } catch (err) {
    console.log(err);
    next(new AppError(err.message, 200));
  }
};
