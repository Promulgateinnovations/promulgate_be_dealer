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
 const campaignContentPostModel = require('../models/campaignContentPost.model');
 const CampaignDefinition = db.campaignDefinition;
 const Organization = db.organization;
 const SocialMediaConnection = db.socialMediaConnection;
 const CampaignContent = db.campaignContent;
 const CampaignContentPost = db.campaignContentPost;
 const AnalyticsController = require("../controllers/analyticsController")
 

 exports.getSocailMediaConnectioByName = async (name, orgId, next) => {
   try {
     const user = await db.socialMediaConnection.findOne({
       where: { name: name, organizationOrgId: orgId },
       attributes: ['socalMediaConnectionId'],
     });
     if (user && user.socalMediaConnectionId) {
       return user.socalMediaConnectionId;
     }
     return null;
   } catch (err) {
     next(new AppError(err.message, 200));
   }
 };
 
 exports.getSocailMediaConnections = async (req, res, next) => {
   const { orgId } = req.body;
   try {
     const user = await db.socialMediaConnection.findAll({
       where: { organizationOrgId: orgId },
       attributes: ['name', 'socialMediaType', 'organizationOrgId', 'status', 'isConfigured'],
       include: [
         {
           model: db.socialMediaPage,
           as: 'socialMediaPage',
         },
       ],
     });
     let facebookpageDetails ={}
     let yotuubepageDetails = {}
     if (user.length > 0) {
        // const facebookConnectionInfo = user.filter(item => item.name.toLowerCase() ==="facebook") 
        // if(facebookConnectionInfo.length > 0){
        //   facebookpageDetails = await AnalyticsController.getFacebookPageDetails(facebookConnectionInfo[0])
        //   facebookpageDetails = this.updatePageName(user, facebookpageDetails, "Facebook")
        // }else {
        //   facebookpageDetails = user;
        // }
        // const youtubeConnectionInfo = user.filter(item => item.name.toLowerCase() ==="youtube") 
        // if(youtubeConnectionInfo.length > 0) {
        //   yotuubepageDetails = await AnalyticsController.getyoutubePageDetails(youtubeConnectionInfo[0])
        //   yotuubepageDetails =  this.updatePageName(facebookpageDetails,yotuubepageDetails, "Youtube")
        // }else{
        //   yotuubepageDetails = facebookpageDetails
        // }
       
     }
     res.send({
       status: 'success',
       data: user
     });
   } catch (err) {
     next(new AppError(err.message, 200));
   }
 };

exports.updatePageName = (connections, facebookpageDetails, type)=>{
  const connectionsData = JSON.stringify(connections)
    let data = JSON.parse(connectionsData).map((currentItem)=> {
         if(currentItem.name === type){
            currentItem.socialMediaPage.pageName=facebookpageDetails.name || ""
            return {...currentItem}
          }
      return { ...currentItem }
    })
    return data
}

 exports.checkSaveSocialMediaConnection = (req, res, next) => {
 
   if (!req.body.name || !req.body.socialMediaType || !req.body.socialMediaHandle || !req.body.password || !req.body.tokenExpiry || !req.body.status || !req.body.isConfigured || !req.body.pageId || !req.body.pageToken) {
     next(new AppError('Missing required fields', 200));
   }
   next();
 };
 
 exports.saveSocialMediaConnections = async (req, res, next) => {
   try {
     const foundItem = await db.socialMediaConnection.findOne({ where: { organizationOrgId: req.body.orgId, name: req.body.name } });
     if (foundItem) {
       const socalMediaConnectionId = foundItem.socalMediaConnectionId
       const socialMediaConnections = await db.socialMediaConnection.update({
         name: req.body.name,
         socialMediaType: req.body.socialMediaType,
         socialMediaHandle: req.body.socialMediaHandle,
         password: req.body.password,
         tokenExpiry: req.body.tokenExpiry,
         status: req.body.status,
         isConfigured: req.body.isConfigured,
         organizationOrgId: req.body.orgId
       }, { where: { organizationOrgId: req.body.orgId, name: req.body.name } });
       const socialMediaPageitem = await db.socialMediaPage.findOne({ where: { socialMediaConnectionSocalMediaConnectionId: socalMediaConnectionId } });
       if (socialMediaPageitem) {
         const socialMediapages = await db.socialMediaPage.update({
           socialMediaConnectionSocalMediaConnectionId: socialMediaConnections.socalMediaConnectionId,
           url: req.body.pageId,
           password: req.body.pageToken,
           description: req.body.description,
           title:req.body.title
         }, { where: { socialMediaConnectionSocalMediaConnectionId: socalMediaConnectionId } })
         res.send({
           status: 'success',
           data: socialMediaConnections,
         });
       }
     } else {
       const socialMediaConnections = await db.socialMediaConnection.create({
         name: req.body.name,
         socialMediaType: req.body.socialMediaType,
         socialMediaHandle: req.body.socialMediaHandle,
         password: req.body.password,
         tokenExpiry: req.body.tokenExpiry,
         status: req.body.status,
         isConfigured: req.body.isConfigured,
         organizationOrgId: req.body.orgId,
       });
       if (socialMediaConnections) {
         const socialMediapages = await db.socialMediaPage.create({
           socialMediaConnectionSocalMediaConnectionId: socialMediaConnections.socalMediaConnectionId,
           url: req.body.pageId,
           password: req.body.pageToken,
           description: req.body.description,
           title: req.body.title
         })
         res.send({
           status: 'success',
           data: socialMediaConnections,
         });
       }
     }
 
   } catch (err) {
     next(new AppError(err.message, 200));
   }
 };
 
 /**
  * Function to update Organization Information
  * @param {*} req
  * @param {*} res
  * @param {*} next
  */

 exports.updateSocialMediaConnectionStatus = async (req, res, next) => {
   const { orgId, name, status, isConfigured } = req.body;
   try {
     const foundItem = await db.socialMediaConnection.findOne({ where: { organizationOrgId: orgId, name } });
     const requestBodyisconfigured = typeof (req.body.isConfigured)
     if (!foundItem) {
       next(new AppError('No Record Found', 200));
     } else {
       try {
         let updatedItem = { ...foundItem }
         updatedItem.isConfigured = typeof (req.body.isConfigured) === "boolean" ? req.body.isConfigured : foundItem.isConfigured
         updatedItem.status = req.body.status || foundItem.status
 
         const updateRecord = await db.socialMediaConnection.update(updatedItem, {
           where: { organizationOrgId: orgId, name },
         });
         res.send({
           status: 'success',
           message: 'socialMedia connection status Updated Succesfully',
         });
       } catch (err) {
         next(new AppError(err.message, 200));
       }
     }
   } catch (err) {
     next(new AppError(err.message, 200));
   }
 };