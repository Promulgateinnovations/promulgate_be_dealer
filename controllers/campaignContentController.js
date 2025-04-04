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
const { socialMediaConnection, campaignDefinition } = require('../models');
const CampaignDefinition = db.campaignDefinition;
const Organization = db.organization;
const SocialMediaConnection = db.socialMediaConnection;
const CampaignContent = db.campaignContent;
const CampaignContentPost = db.campaignContentPost;


exports.checkPostBody = (req, res, next) => {
  next();
};

exports.createContentPost = async (postAt, campaignContentID, next) => {
  try {
    const postContent = await CampaignContentPost.create({
      campaignContentCampaignContentID: campaignContentID,
      postAt,
    });
    return postContent;
  } catch (err) {
    next(new AppError(err.message, 200));
  }
};

exports.createCampaignContent = async (req, res, next) => {
  const { campaignChannelId, description, url, postAt, tags, toEmail, subject, publishVideoAs  } = req.body;

  const content = {
    descritption: description,
    url,
    tags,
    campaignSelectionChannelCampaignSelectionId: campaignChannelId,
    toEmail,
    subject,
    publishVideoAs
  };
  try {
    const contents = await CampaignContent.create(content);

    let promises = [];
    postAt.forEach((currentPostAt) => {
      console.log(currentPostAt);
      promises.push(
        this.createContentPost(currentPostAt, contents.campaignContentID, next)
      );
    });
    Promise.all(promises).then((response) => {
      res.send({
        status: 'success',
        data: response,
      });
    });
  } catch (err) {
    next(new AppError(err.message, 200));
  }
};
