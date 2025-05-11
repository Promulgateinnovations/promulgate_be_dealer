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
 const Sequelize = require('sequelize');
const { Op } = require('sequelize');
 
 const postController = require("../controllers/postController")
 const businessController = require("../controllers/businessController")
 const axios = require("axios")
 const configs = require("../config/config.json")
 const qs = require("qs");
const { sourcerepo } = require('googleapis/build/src/apis/sourcerepo');
const { composer } = require('googleapis/build/src/apis/composer');


exports.checkPostBody = (req, res, next) => {
   next();
 };
 
 exports.getOrganizationByID = async (organizatinId) => {
   // find the user record
   const user = await Organization.findOne({ where: { orgId: organizatinId } });
   // create the project
   console.log(user);
   return user;
 };
 
exports.getSocailMediaConnectioByName = async (name) => {
   // find the user record
   console.log(name);
   const user = await db.socialMediaConnection.findOne({
     where: { name: name },
     attributes: ['socalMediaConnectionId'],
   });
   return user.socalMediaConnectionId;
   // create the project
   // console.log(user);
 };
 
 /**
  * Function to create organization into the Database
  * @param {object} req
  * @param {object} res
  * @param {object} next
  */

 
 exports.createCampaignDefintion = async (req, res, next) => {
   const campaignDefinition = {
     name: req.body.name,
     topic: req.body.topic,
     videoUrl: req.body.videoUrl,
     influencers: req.body.influencers,
     startAt: req.body.startAt,
     objective: req.body.objective,
     endAt: req.body.endAt,
     totalAudience: req.body.totalAudience,
     status: req.body.status,
     campaignTypes: req.body.campaignTypes,
     captiveMembers: req.body.captiveMembers,
     organizationOrgId: req.body.orgId,
     userUserId: req.body.userId,
     tags: req.body.tags
   };
   try {
     const campaign = await CampaignDefinition.create(campaignDefinition);
     res.send({
       status: 'success',
       data: campaign,
     });
   } catch (err) {
     next(new AppError(err.message, 200));
   }
 };
 
 exports.getAllCampaigns = (req, res, next) => {
   const { orgId } = req.body;
   Organization.findByPk(orgId, {
     include: [
       {
         model: db.campaignDefinition,
         as: 'campaignDefinitions',
         include: [
           {
             model: db.campaignViewer,
             as: 'campaignViewers',
             where: {
               campaignDefinitionCampaignDefinitionId:
                 'b488054b-480a-4465-b820-ec9a7b6449jh',
             },
           },
         ],
         include: [{ model: db.user, as: 'user' }],
       },
     ],
   })
     .then((data) => {
       if (data) {
         res.send({
           status: 'success',
           data: data,
         });
       } else {
         next(new AppError('No Record Found', 200));
       }
     })
     .catch((err) => {
       console.log(err.message);
       next(new AppError(`Error retrieving Organization`, 200));
     });
 };
 
 exports.getCampaignDefintion = async (req, res, next) => {
   const { campaignDefinitionId } = req.body;
 
   try {
     const campaignDefinitionDetails = await campaignDefinition.findOne({
       where: { campaignDefinitionId },
       attributes: [
         'name',
         'topic',
         'videoUrl',
         'influencers',
         'objective',
         'startAt',
         'endAt',
         'totalAudience',
         'campaignTypes',
         'captiveMembers',
         'tags'
       ],
     });
     if (campaignDefinitionDetails) {
       res.send({
         status: 'success',
         data: campaignDefinitionDetails,
       });
     } else {
       next(new AppError('No Record Found', 200));
     }
   } catch (err) {
     next(new AppError(err.message, 200));
   }
 };
 
 exports.updateCampaignDefintion = async (req, res, next) => {
   const { campaignDefinitionId } = req.body;
   try {
     const foundItem = await campaignDefinition.findOne({
       where: { campaignDefinitionId },
       attributes: [
         'campaignDefinitionId',
         'name',
         'topic',
         'videoUrl',
         'objective',
         'influencers',
         'startAt',
         'endAt',
         'totalAudience',
         'influencers',
         'campaignTypes',
         'captiveMembers',
         'tags'
       ],
     });
     if (!foundItem) {
       next(new AppError('No Record Found', 200));
     } else {
       try {
         const updateditem = {};
         updateditem.name = req.body.name || foundItem.name;
         updateditem.topic = req.body.topic || foundItem.topic;
         updateditem.objective = req.body.objective || foundItem.objective;
         updateditem.videoUrl = req.body.videoUrl || foundItem.videoUrl;
         updateditem.influencers = req.body.influencers || foundItem.influencers;
         updateditem.startAt = req.body.startAt || foundItem.startAt;
         updateditem.status = req.body.status || foundItem.status;
         updateditem.endAt = req.body.endAt || foundItem.endAt;
         updateditem.tags = req.body.tags || foundItem.tags;
 
         updateditem.totalAudience =
           req.body.totalAudience || foundItem.totalAudience;
         updateditem.campaignTypes =
           req.body.campaignTypes || foundItem.campaignTypes;
         updateditem.captiveMembers =
           req.body.captiveMembers || foundItem.captiveMembers;
         const updateRecord = await db.campaignDefinition.update(updateditem, {
           where: { campaignDefinitionId },
         });
         res.send({
           status: 'success',
           message: 'CamapginDefiniton Updated Succesfully',
         });
       } catch (err) {
         next(new AppError(err.message, 200));
       }
     }
   } catch (err) {
     next(new AppError(err.message, 200));
   }
 };
 
exports.updateCampaignCompletedStatus = async () => {
   const campaignStatus = await campaignDefinition.update(
     { status: 'COMPLETED' },
     {
       returning: true,
       where: {
         status: {
           [Op.or]: ['NEW', 'IN_REVIEW', 'APPROVED', 'LIVE']
         },
         endAt: {
           [Op.lt]: Sequelize.fn('NOW')
         }
       }
     });
   console.log("updateCampaignCompletedStatus")
   return campaignStatus
 }
 
 exports.updateLiveCampaignStatus = async () => {
   const campaignStatus = await campaignDefinition.update(
     { status: 'LIVE' },
     {
       returning: true,
       where: {
         status: {
           [Op.eq]: ['APPROVED']
         },
         endAt: {
           [Op.gt]: Sequelize.fn('NOW')
         },
       }
     });
   console.log("updated Live")
   return campaignStatus
 }
 
exports.getYoutubeAccessCredentials = async (orgId, next) => {
   let itemsArray = []
   try {
     const socialMedia = await db.socialMediaConnection.findOne({
       where: { organizationOrgId: orgId, name: 'Youtube' },
       attributes: ['socalMediaConnectionId', 'name', 'organizationOrgId','socialMediaHandle'],
       include: [
         {
           model: db.socialMediaPage,
           as: 'socialMediaPage',
           attributes: ['password', 'url'],
         },
       ],
     });
     return socialMedia
   }
   catch (err) {
    console.log("Err")
    console.log(err)
     next(new AppError(err.message, 200));
   }
 }
 
exports.getHubYoutubeAccessCredentials = async (orgId, next) => {
   let itemsArray = []
   try {
     const socialMedia = await db.business.findOne({
       where: {
         organizationOrgId: orgId,
         hubHubId: {
           [Op.ne]: null
         }
       },
       attributes: ['hubHubId',],
       include: [
         {
           model: db.hub,
           as: 'hub',
           required: true,
           where: {
             type: "YOUTUBE"
           },
           attributes: ['type', 'url', 'credentials',],
         },
       ],
     });
 
     return socialMedia
   }
   catch (err) {
     next(new AppError(err.message, 200));
   }
 }
 
 exports.getYoutubeVideos = async (req, res, next) => {
   const { orgId } = req.body
   let itemsArray = []
   try {
     const hubInfo = await this.getHubYoutubeAccessCredentials(orgId, next)
     console.log
       (hubInfo)
 
 
 
     if (hubInfo && hubInfo.hub.type) {
       const refreshTokenInfo = await postController.getRefreshToken(hubInfo.hub.credentials)
       const videosData = await this.getListofVideos(refreshTokenInfo.refreshResponse.access_token)
     console.log(videosData.data.statistics)
       videosData.data.items.forEach((currentItem) => {
        console.log("currentItem")
        console.log(currentItem)
        let currentinfo = {
           name: currentItem.snippet && currentItem.snippet.title || 'No Title',
           value: currentItem.id.videoId,
           url: `https://youtu.be/${currentItem.id.videoId}`
         }
         itemsArray.push(currentinfo)
       })
     }
     res.send({ success: true, videos: itemsArray })
   }
   catch (err) {
     next(new AppError(err.message, 200));
   }
 }
 
exports.getListofVideos = (accesstoken) => {
   const getlistVideos = "https://youtube.googleapis.com/youtube/v3/search?part=snippet&forMine=true&maxResults=25&type=video&key=" + configs.YOUTUBE_API_KEY
   var configdsata = {
     method: 'get',
     url: getlistVideos,
     headers: {
       'Content-Type': 'application/x-www-form-urlencoded',
       "Authorization": `Bearer ${accesstoken}`
     },
   };
   console.log("configdsata")
   console.log(configdsata)
   return axios(configdsata)
 
 }
 
 exports.getYoutubeVideoDetails = async (req, res, next) => {
   const { orgId, youtubeId } = req.body
 
   try {
     console.log("orgId", orgId)
     const socialMedia = await this.getHubYoutubeAccessCredentials(orgId, next)
     console.log("socialMedia", socialMedia)
     if (socialMedia.hub.credentials) {
       const refreshTokenInfo = await postController.getRefreshToken(socialMedia.hub.credentials)
       const videosData = await this.getVideoDetail(refreshTokenInfo.refreshResponse.access_token, youtubeId)
       console.log('videosData')
       console.log(videosData)
       res.send({ success: true, videos: videosData.data })
     }
   }
   catch (err) {
     next(new AppError(err.message, 200));
   }
 }
 
exports.getVideoDetail = (accesstoken, youtubeId) => {
   const getVideoData = "https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=" + youtubeId + "& key=" + configs.YOUTUBE_API_KEY
   var configdsata = {
     method: 'get',
     url: getVideoData,
     headers: {
       'Content-Type': 'application/x-www-form-urlencoded',
       "Authorization": `Bearer ${accesstoken}`
     },
   };
 
   return axios(configdsata)
 }
 
 exports.enrichYoutubeVideo = async (req, res, next) => {
  const { orgId, ...updateDetails } = req.body

  try {
    const socialMedia = await this.getHubYoutubeAccessCredentials(orgId, next)
    if (socialMedia.hub.credentials) {
      const refreshTokenInfo = await postController.getRefreshToken(socialMedia.hub.credentials)

      const videosData = await this.updateVideoDetail(refreshTokenInfo.refreshResponse.access_token, updateDetails)
      res.send({ success: true, videos: videosData.data })
    }
  }
  catch (err) {
    next(new AppError(err.message, 200));
  }
}
 
exports.updateVideoDetail = (accesstoken, videodata) => {
   const getlistVideos = "https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails&key=" + configs.YOUTUBE_API_KEY
   var configdsata = {
     method: 'PUT',
     url: getlistVideos,
     headers: {
       'Content-Type': 'application/json',
       "Authorization": `Bearer ${accesstoken}`
     },
     data: { ...videodata }
   };
   return axios(configdsata)
 }
 
 
 // enrichYoutubeVideo
 
exports.getLiveCampagins = async  () => {
  try {
    const campaigns = await db.campaignDefinition.findAll({
      where: { status: 'LIVE' },
      attributes: ['campaignDefinitionId'],
    });
    console.log(campaigns[0].campaignDefinitionId)

    const filterData = campaigns.map((currentitems)=> {
      return {
        campaignDefintionId: currentitems.campaignDefinitionId
      }
    })
    return filterData
  }catch(err) {
    console.log("err")
  }
  
 }