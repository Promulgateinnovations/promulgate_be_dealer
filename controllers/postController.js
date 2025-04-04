/**
 * @author [Pradeep]
 * @email [pradeep@promulgateinnovation.com]
 * @create date 2021-03-01 02:26:14
 * @modify date 2021-03-01 02:26:14
 * @desc [File to get the data related to post]
 */
 const { exec } = require("child_process");


 const db = require('../models');
 const AppError = require('../utils/appError');
 const moment = require("moment")
 const Sequelize = require('sequelize');
 const Op = db.Sequelize.Op;
 const axios = require("axios")
 const FormData = require('form-data');
 const { campaignContentPost, asset } = require('../models');
 const imageDownloader = require("../controllers/imageDownloader")
 // const fetch = require("node-fetch");
 const path = require("path")
 const fs = require("fs")
 const qs = require("qs")
 const configs = require("../config/config.json")
 const mailgun = require("mailgun-js")
 const WhatsappTemplates = db.whatsappTemplates;

 const Youtube = require("youtube-api")
     , readJson = require("r-json");
 
 const CREDENTIALS = readJson(path.join(__dirname, '../', '/credentials.json'));
 let oauth = Youtube.authenticate({
     type: "oauth"
     , client_id: CREDENTIALS.web.client_id
     , client_secret: CREDENTIALS.web.client_secret
     , redirect_url: CREDENTIALS.web.redirect_uris[0]
 });
 
 /**
  * funtion to check if the payload of the request holds all of the below mentioned property
  * @param {Object} req
  * @param {Object} res
  * @param {Object} next
  */


 exports.checkPostBody = (req, res, next) => {
     if (!req.body.orgId || req.body.orgId === "" || req.body.orgId.trim().length === 0) {
         next(new AppError('Missing Organization Id', 200));
     }
     next();
 };
 
 exports.getPostDetails = async (req, res, next) => {
     const { orgId } = req.body
     let date_ob = new Date();
 
     // calculate time frame to get record
     // utc to local => utc + 5.30 hrs
     // reducing 10 minutes of time from the current time
     // adding 1 minute of time from current time
     var utcMoment = moment.utc();
     var utcDate = new Date(utcMoment.format());
 
     const toDate = moment(utcDate).add(1, 'minutes').toDate()
     const fromDate = moment(utcDate).subtract(10, 'minutes').toDate()
     // const toDate = moment(date_ob).add(5, 'hours').add(31, 'minutes').toDate()
     // const fromDate = moment(date_ob).add(5, 'hours').add(20, 'minutes').toDate()
     try {
         const postDetails = await db.campaignContentPost.findAll({
             where: {
                 postAt: {
                     [Op.gt]: fromDate,
                     [Op.lte]: toDate,
                 },
                 postId: null
             },
             attributes: ['campaignContentPostID', 'postAt', 'postId', 'postStatus'],
             include: [
                 {
                     model: db.campaignContent,
                     as: 'campaignContent',
                     attributes: ['descritption', 'url'],
                     include: [
                         {
                             model: db.campaignSelectionChannel,
                             as: 'campaignSelectionChannel',
                             attributes: ['campaignSelectionId'],
                             include: [
                                 {
                                     model: db.socialMediaConnection,
                                     as: 'socialMediaConnection',
                                     attributes: ['name', 'socialMediaType', 'socialMediaHandle', 'password'],
                                     include: [
                                         {
                                             model: db.socialMediaPage,
                                             as: 'socialMediaPage',
                                             attributes: ['url']
                                         }
                                     ]
                                 },
                                 {
                                     model: db.campaignDefinition,
                                     as: 'campaignDefinition',
                                     attributes: ['name'],
                                     include: [
                                         {
                                             model: db.organization,
                                             as: 'organization',
                                             where: [{
                                                 orgId
                                             }],
                                             attributes: ['name']
                                         }
                                     ]
                                 }
                             ]
                         },
                     ],
                 }
             ],
 
         });
 
         if (postDetails.length > 0) {
             const filteredPost = postDetails.filter(item => item.campaignContent.campaignSelectionChannel.campaignDefinition)
             res.send({
                 status: 'success',
                 data: filteredPost,
             })
         } else {
             res.send({
                 status: 'success',
                 data: []
             })
         }
     } catch (err) {
         next(new AppError(`Error retrieving Post`, 200));
     }
 }

 exports.getCurrentPostDetails = async () => {
     return new Promise((resolve, reject) => {
         var utcMoment = moment.utc();
         var utcDate = new Date(utcMoment.format());
         const toDate = moment(utcDate).add(1, 'minutes').toDate()
         const fromDate = moment(utcDate).toDate()
        // const toDate = moment(utcDate).add(1, 'minutes').toDate()
        // const fromDate = moment(utcDate).subtract(10, 'minutes').toDate()
         db.campaignContentPost.findAll({
             where: {
                 postAt: {
                    //  [Op.gt]: fromDate,
                     [Op.lte]: toDate,
                    // [Op.gt]: fromDate,
                    // [Op.lte]: toDate,
                 },
                 postStatus: "WAITING",
                 postId: null
             },
             attributes: ['campaignContentPostID', 'postAt', 'postStatus'],
             include: [
                 {
                     model: db.campaignContent,
                     as: 'campaignContent',
                     attributes: ['descritption', 'url', 'publishVideoAs'],
                     include: [
                         {
                             model: db.campaignSelectionChannel,
                             as: 'campaignSelectionChannel',
                             attributes: ['campaignSelectionId'],
                             include: [
                                 {
                                     model: db.socialMediaConnection,
                                     as: 'socialMediaConnection',
                                     attributes: ['name', 'socialMediaType', 'socialMediaHandle', 'password'],
                                     include: [
                                         {
                                             model: db.socialMediaPage,
                                             as: 'socialMediaPage',
                                             attributes: ['url', 'password']
                                         }
                                     ]
                                 },
                                 {
                                     model: db.campaignDefinition,
                                     as: 'campaignDefinition',
                                     attributes: ['name', 'campaignDefinitionId', 'status', 'tags'],
                                     include: [
                                         {
                                             model: db.organization,
                                             as: 'organization',
                                             attributes: ['name'],
                                             include: [
                                                {
                                                    model: db.business,
                                                    as: 'business',
                                                    attributes: ['businessId'],
                                                    include: [
                                                        {
                                                            model: db.asset,
                                                            as: 'asset',
                                                            attributes: ['credentials']
                                                            
                                                        }
                                                    ]
                                                }
                                            ]
                                         }
                                     ]
                                 }
                             ]
                         },
                     ],
                 }
             ],
 
         }).then((postDetails) => {
             let filteredPost = []
 
             if (postDetails.length > 0) {
                 filteredPost = postDetails.map((item) => {
                    if (
                        item.campaignContent.campaignSelectionChannel.socialMediaConnection.socialMediaPage &&
                        item.campaignContent.campaignSelectionChannel.socialMediaConnection.socialMediaPage.url
                    ) {
                        return {
                            status: item.campaignContent.campaignSelectionChannel.campaignDefinition.status,
                            tags: item.campaignContent.campaignSelectionChannel.campaignDefinition.tags,
                            pageId: item.campaignContent.campaignSelectionChannel.socialMediaConnection.socialMediaPage.url,
                            pageToken: item.campaignContent.campaignSelectionChannel.socialMediaConnection.socialMediaPage.password,
                            accessToken: item.campaignContent.campaignSelectionChannel.socialMediaConnection.password,
                            description: item.campaignContent.descritption,
                            url: item.campaignContent.url,
                            campaignContentPostID: item.campaignContentPostID,
                            name: item.campaignContent.campaignSelectionChannel.socialMediaConnection.name,
                            assetCredentials: item.campaignContent.campaignSelectionChannel.campaignDefinition.organization.business.asset?.credentials,
                            publishVideoAs: item.campaignContent.publishVideoAs
                        }
                    }
                     
                 })
             }
             resolve({
                 status: 'success',
                 data: filteredPost
             })
         }).catch((err) => {
             console.log("Err")
             console.log(err)
             resolve({
                 status: 'success',
                 data: []
             })
         })
     })
 }

 exports.updateCampaignContentPost = async (campaignContentPostID, postId, postStatus, apiResponse, apiErrorMsg) => {
     try {
         const foundItem = await db.campaignContentPost.findOne({ where: { campaignContentPostID } });
         if (!foundItem) {
             next(new AppError('No Record Found', 200));
         } else {
             try {
                 const updatedItem = {};
                 updatedItem.postAt = foundItem.postAt;
                 updatedItem.postId = postId || foundItem.postId;
                 updatedItem.postStatus = postStatus || foundItem.postStatus;
                 updatedItem.apiResponse = apiResponse || '';
                 updatedItem.apiResponseMessage = apiErrorMsg || '';
 
                 const updateRecord = await db.campaignContentPost.update(updatedItem, {
                     where: { campaignContentPostID },
                 });
 
                 return ({
                     [campaignContentPostID]: "successfully updated the post Info"
                 })
             } catch (err) {
                 return ({
                     [campaignContentPostID]: "Error updated the post Info"
                 })
             }
         }
     } catch (err) {
         return {
             campaignContentPostID: "Error updated the post Info"
         }
     }
 
 
 }

 exports.addFacebookPost = (selectedPage, message, url, accessToken, campaignContentPostID, name, assetCredentials,tags) => {
     const self = this
     return new Promise((resolve) => {
         var type = 'feed';
         var data = new FormData();
         data.append('access_token', accessToken);
         data.append('message', message);
 
         if (url) {
           
                if (url && url.indexOf("drive.google.com") > -1) {
                     this.getRefreshToken(assetCredentials).then((updateToken) => {
                        if (updateToken.successs) {
                            imageDownloader.googleDownload(updateToken.refreshResponse, url).then((res) =>{
                                imageDownloader.downloader(res.webContentLink, `./assets/${campaignContentPostID}`).then((imageResponse) => {
                                    const imagePath = path.join(__dirname, '../', `/assets/${campaignContentPostID}.${imageResponse.fileExtension}`)
                                    var formData = {
                                        file: fs.createReadStream(imagePath)
                                    };
                                    if (imageResponse.fileExtension === "mp4") {
                                        type = 'videos';
                                        data.append('source', formData.file)
                                    } else {
                                        type = 'photos';
                                        data.append('images', formData.file)
                                    }
                                    let msgWithTags = tags != null ? message + ' ' + tags.trim().split(',').join(' ') : message;
                                    data.append('message', msgWithTags);
                                    var config = {
                                        method: 'post',
                                        url: 'https://graph.facebook.com/' + selectedPage + '/' + type,
                                        headers: {
                                            ...data.getHeaders()
                                        },
                                        data: data
                                    };
                                    axios(config)
                                        .then(function (response) {
                                            console.log('response', response);
                                            const imagePath = path.join(__dirname, '../', `/assets/${campaignContentPostID}.${imageResponse.fileExtension}`)
                                            const postId = response.data.post_id;
                                            if (fs.existsSync(imagePath)) {
                                                fs.unlinkSync(imagePath)
                                            }
                                            self.updateCampaignContentPost(campaignContentPostID, postId, "SUCCESS").then((respnse) => {
                                                resolve(respnse)
                                            })
                                        })
                                        .catch(function (error) {
                                            console.log('a.error', error.response)
                                            self.updateCampaignContentPost(campaignContentPostID, null, "FAILED").then((respnse) => {
                                                resolve("Failed to post the data")
                                            })
                                            resolve(error)
                                        });
                                })
                            })
                        }
                    })
                } else {
                    imageDownloader.downloader(url, `./assets/${campaignContentPostID}`).then((imageResponse) => {
                        const imagePath = path.join(__dirname, '../', `/assets/${campaignContentPostID}.${imageResponse.fileExtension}`)
                        var formData = {
                            file: fs.createReadStream(imagePath)
                        };
                        if (imageResponse.fileExtension === "mp4") {
                            type = 'videos';
                            data.append('source', formData.file)
                        } else {
                            type = 'photos';
                            data.append('images', formData.file)
                        }
                        let msgWithTags = tags != null ? message + ' ' + tags.trim().split(',').join(' ') : message;

                        data.append('message', msgWithTags);
        
                        // data.append('images', formData.file)
                        var config = {
                            method: 'post',
                            url: 'https://graph.facebook.com/' + selectedPage + '/' + type,
                            headers: {
                                ...data.getHeaders()
                            },
                            data: data
                        };
                        axios(config)
                            .then(function (response) {
                                console.log('response', response);
                                const imagePath = path.join(__dirname, '../', `/assets/${campaignContentPostID}.${imageResponse.fileExtension}`)
                                const postId = response.data.id;
                                if (fs.existsSync(imagePath)) {
                                    fs.unlinkSync(imagePath)
                                }
                                self.updateCampaignContentPost(campaignContentPostID, postId, "SUCCESS").then((respnse) => {
                                    resolve(respnse)
                                })
                            })
                            .catch(function (error) {
                                console.log(error)
                                console.log(error.response)
                                self.updateCampaignContentPost(campaignContentPostID, null, "FAILED").then((respnse) => {
                                    resolve("Failed to post the data")
                                })
                                resolve(error)
                            });
                    })
                }   
             
 
 
         } else {
             var config = {
                 method: 'post',
                 url: 'https://graph.facebook.com/' + selectedPage + '/' + type,
                 headers: {
                     ...data.getHeaders()
                 },
                 data: data
             };
             axios(config)
                 .then(function (response) {
                    console.log('response', response);
                     const imagePath = path.join(__dirname, '../', `/assets/${campaignContentPostID}.png`)
                     const postId = response.data.id
                     self.updateCampaignContentPost(campaignContentPostID, postId, "SUCCESS").then((respnse) => {
                         resolve(respnse)
                     })
                 })
                 .catch(function (error) {
                     console.log("error=====>")
                     console.log(error)
                     self.updateCampaignContentPost(campaignContentPostID, null, "FAILED").then((respnse) => {
                         resolve("Failed to post the data")
                     })
                     resolve(error)
                 });
         }
 
     })
 
 }

 exports.addyoutubePost = (selectedPage, message, url, accessToken, campaignContentPostID, name, pageToken, assetCredentials,tags,publishVideoAs) => {
     return new Promise((resolve) => {
         this.getRefreshToken(pageToken).then((updateToken) => {
             if (updateToken.successs) {
                 // resolve(this.postYoutubeVideos(message, url, updateToken.refreshResponse.access_token, campaignContentPostID))
                 resolve(this.postYoutubeVideos(message, url, updateToken.refreshResponse, campaignContentPostID,tags,publishVideoAs))
             } else {
                 resolve({ success: false, message: updateToken.refreshResponse })
             }
         })
     })
 }

 exports.getRefreshToken = (pageToken) => {
    
     return new Promise((resolve, reject) => {
         const refresh_token = JSON.parse(pageToken).refresh_token
         var data = qs.stringify({
             'client_id': configs.YOUTUBE_CLIENTID,
             'client_secret': configs.YOUTUBE_CLIENT_SECRET,
             refresh_token,
             'grant_type': 'refresh_token'
         });
 
         var config = {
             method: 'post',
             url: 'https://accounts.google.com/o/oauth2/token',
             headers: {
                 'Content-Type': 'application/x-www-form-urlencoded'
             },
             data: data
         };
         axios(config)
             .then(function (response) {
                 resolve({ successs: true, refreshResponse: response.data })
             })
             .catch(function (error) {
                 resolve({ successs: false, refreshResponse: error.message })
             });
 
     })
 
 }

 exports.postYoutubeVideos = (message, url, accessToken, campaignContentPostID,tags,publishVideoAs) => {
     const self = this;
     let tagsForVideo = '';
     if(tags != null && tags != '') {
        if(tags.includes(',')) {
            tagsForVideo = tags.split(',');
        } else {
            tagsForVideo = tags.split(' ');
        }
     }
     return new Promise((resolve) => { 
 
         if (url && url.indexOf("drive.google.com") === -1) {

             imageDownloader.downloader(url, `./assets/${campaignContentPostID}`).then((imageResponse) => {
                 const imagePath = path.join(__dirname, '../', `/assets/${campaignContentPostID}.${imageResponse.fileExtension}`)
 
 
                 oauth.setCredentials(accessToken);
 
 
                 var req = Youtube.videos.insert({
                     resource: {
                         // Video title and description
                         snippet: {
                             title: message,
                             description: (publishVideoAs != null && publishVideoAs != 'video') ? '#Shorts' : '',
                             tags: tagsForVideo
                         }
                         // I don't want to spam my subscribers
                         , status: {
                             privacyStatus: "public"
                         }
                     }
                     // This is for the callback function
                     , part: "snippet,status"
 
                     // Create the readable stream to upload the video
                     , media: {
                         body: fs.createReadStream(imagePath)
                     }
                 }, (err, data) => {
                    console.log('err, data', err, data);
                     if (err) {
                         console.log("Error whiel uplaoding=============>")
                         console.log(err)
                         self.updateCampaignContentPost(campaignContentPostID, null, "FAILED").then((respnse) => {
                             resolve("Failed to post the data")
                         })
                         resolve(err)
                     }
                     else {
                         const postId = data.data.id
                         self.updateCampaignContentPost(campaignContentPostID, postId, "SUCCESS").then((respnse) => {
                             resolve(respnse)
                         })
 
                     }
 
                 });
                 // var metadata = {
                 //     snippet: {
                 //         title: message,
                 //         description: 'tesrt',
                 //         tags: 'abc',
                 //         categoryId: 22
                 //     },
                 //     status: {
                 //         privacyStatus: "private"
                 //     }
                 // };
                 // var uploader = new MediaUploader({
                 //     baseUrl: 'https://www.googleapis.com/upload/youtube/v3/videos',
                 //     file: fs.createReadStream(imagePath),
                 //     token: accessToken,
                 //     metadata: metadata,
                 //     params: {
                 //         part: Object.keys(metadata).join(',')
                 //     },
                 //     onError: function (data) {
                 //         var message = data;
                 //         // Assuming the error is raised by the YouTube API, data will be
                 //         // a JSON string with error.message set. That may not be the
                 //         // only time onError will be raised, though.
                 //         try {
                 //             var errorResponse = JSON.parse(data);
                 //             message = errorResponse.error.message;
                 //         } finally {
                 //             self.updateCampaignContentPost(campaignContentPostID, null, "FAILED").then((respnse) => {
                 //                 resolve("Failed to post the data")
                 //             })
                 //         }
                 //     }.bind(this),
                 //     onProgress: function (data) {
 
                 //     }.bind(this),
                 //     onComplete: function (data) {
                 //         var uploadResponse = JSON.parse(data);
 
                 //         this.videoId = uploadResponse.id;
                 //         fs.unlinkSync(imagePath)
                 //         self.updateCampaignContentPost(campaignContentPostID, uploadResponse.id, "SUCCESS").then((respnse) => {
                 //             resolve(respnse)
                 //         })
                 //     }.bind(this)
                 // });
                 // this.uploadStartTime = Date.now();
                 // uploader.upload();
             }).catch((Err) => {
                 console.log("DUMILLLLLLLLLLLLLLLLLLLL")
                 console.log(Err.message)
             })
         }else {
            
            imageDownloader.googleDownload(accessToken, url).then((res) =>{
                imageDownloader.downloader(res.webContentLink, `./assets/${campaignContentPostID}`).then((imageResponse) => {
                    const imagePath = path.join(__dirname, '../', `/assets/${campaignContentPostID}.${imageResponse.fileExtension}`)
                    oauth.setCredentials(accessToken);
    
    
                    var req = Youtube.videos.insert({
                        resource: {
                            // Video title and description
                            snippet: {
                                title: message,
                                description: (publishVideoAs != null && publishVideoAs != 'video') ? '#Shorts' : '',
                                tags: tagsForVideo
                            }
                            // I don't want to spam my subscribers
                            , status: {
                                privacyStatus: "public"
                            }
                        }
                        // This is for the callback function
                        , part: "snippet,status"
    
                        // Create the readable stream to upload the video
                        , media: {
                            body: fs.createReadStream(imagePath)
                        }
                    }, (err, data) => {
                        if (err) {
                            console.log("Error whiel uplaoding=============>")
                            console.log(err)
                            self.updateCampaignContentPost(campaignContentPostID, null, "FAILED").then((respnse) => {
                                resolve("Failed to post the data")
                            })
                            resolve(err)
                        }
                        else {
                            const postId = data.data.id
                            self.updateCampaignContentPost(campaignContentPostID, postId, "SUCCESS").then((respnse) => {
                                resolve(respnse)
                            })
    
                        }
    
                    });
                    // var metadata = {
                    //     snippet: {
                    //         title: message,
                    //         description: 'tesrt',
                    //         tags: 'abc',
                    //         categoryId: 22
                    //     },
                    //     status: {
                    //         privacyStatus: "private"
                    //     }
                    // };
                    // var uploader = new MediaUploader({
                    //     baseUrl: 'https://www.googleapis.com/upload/youtube/v3/videos',
                    //     file: fs.createReadStream(imagePath),
                    //     token: accessToken,
                    //     metadata: metadata,
                    //     params: {
                    //         part: Object.keys(metadata).join(',')
                    //     },
                    //     onError: function (data) {
                    //         var message = data;
                    //         // Assuming the error is raised by the YouTube API, data will be
                    //         // a JSON string with error.message set. That may not be the
                    //         // only time onError will be raised, though.
                    //         try {
                    //             var errorResponse = JSON.parse(data);
                    //             message = errorResponse.error.message;
                    //         } finally {
                    //             self.updateCampaignContentPost(campaignContentPostID, null, "FAILED").then((respnse) => {
                    //                 resolve("Failed to post the data")
                    //             })
                    //         }
                    //     }.bind(this),
                    //     onProgress: function (data) {
    
                    //     }.bind(this),
                    //     onComplete: function (data) {
                    //         var uploadResponse = JSON.parse(data);
    
                    //         this.videoId = uploadResponse.id;
                    //         fs.unlinkSync(imagePath)
                    //         self.updateCampaignContentPost(campaignContentPostID, uploadResponse.id, "SUCCESS").then((respnse) => {
                    //             resolve(respnse)
                    //         })
                    //     }.bind(this)
                    // });
                    // this.uploadStartTime = Date.now();
                    // uploader.upload();
                }).catch((Err) => {
                    console.log("DUMILLLLLLLLLLLLLLLLLLLL")
                    console.log(Err.message)
                })
            })     
            console.log("BIWWWWWWWWWWWWWWWWWWWWW")
         }
     })
 }

 exports.addInstagaramPost = (selectedPage, message, url, accessToken, campaignContentPostID, name, assetCredentials,tags) => {
     const self = this
     return new Promise((resolve) => {
        if (url && url.indexOf("drive.google.com") > -1) {
          
            this.getRefreshToken(assetCredentials).then((updateToken) => {
                if (updateToken.successs) {
                    imageDownloader.googleDownload(updateToken.refreshResponse, url).then((res) =>{
                        imageDownloader.downloader(res.webContentLink, `./assets/${campaignContentPostID}`).then((imageResponse) => {
                            const imagePath = path.join(__dirname, '../', `/assets/${campaignContentPostID}.${imageResponse.fileExtension}`)
                            var mySubString = url.substring(
                                url.indexOf("d/") + 2, 
                                url.lastIndexOf("/view")
                            );
                            var uri = "https://drive.google.com/uc?export=view&id="+mySubString;
                            // var data = fs.createReadStream(imagePath);
                        //imageDownloader.uploadS3File(imagePath, `${campaignContentPostID}.${imageResponse.fileExtension}`).then((S3res)=>{
                            message = tags != null ? message + ' ' + tags.trim().split(',').join(' ') : message;
                        var config = {
                            method: 'post',
                            url: 'https://graph.facebook.com/' + selectedPage + '/media?image_url=' + encodeURIComponent(uri) + '&caption=' + encodeURIComponent(message) +'&access_token=' + accessToken,
                            headers: {},
                            data: ''
                        };
                        axios(config)
                            .then(function (response) {
                                self.publishInstagaram(response.data.id, accessToken, selectedPage).then((response) => {
                                    self.updateCampaignContentPost(campaignContentPostID, response.data.id, "SUCCESS", response, '').then((respnse) => {
                                        resolve(respnse)
                                    })
                                }).catch((err) => {
                                    console.log('failed err'. err);
                                    self.updateCampaignContentPost(campaignContentPostID, null, "FAILED", err, err?.message).then((respnse) => {
                                        resolve("Failed to post the data")
                                    })
                                    resolve(err)
                                })
                            })
                            .catch(function (error) {
                                console.log("error=====>", error.response)
                                console.log("error=====>", error?.response?.data?.error?.message)
                                console.log(error.message)
                                self.updateCampaignContentPost(campaignContentPostID, null, "FAILED", error.response, error?.response?.data?.error?.message || '').then((respnse) => {
                                    resolve("Failed to post the data")
                                })
                                resolve(error.message)
                            });
                        //})
                        
                        })
                        
                    })
                }
            })

        }else {
            message = tags != null ? message + ' ' + tags.trim().split(',').join(' ') : message;
            var config = {
                method: 'post',
                url: 'https://graph.facebook.com/' + selectedPage + '/media?image_url=' + url + '&caption=' + encodeURIComponent(message) +'&access_token=' + accessToken,
                headers: {},
                data: ''
            };
            axios(config)
                .then(function (response) {
                    self.publishInstagaram(response.data.id, accessToken, selectedPage).then((response) => {
                        self.updateCampaignContentPost(campaignContentPostID, response.data.id, "SUCCESS").then((respnse) => {
                            resolve(respnse)
                        })
                    }).catch((err) => {
                        console.log('aerr', err);
                        self.updateCampaignContentPost(campaignContentPostID, null, "FAILED").then((respnse) => {
                            resolve("Failed to post the data")
                        })
                        resolve(err.message)
                    })
                })
                .catch(function (error) {
                    console.log('catch resp', error.response);
                    self.updateCampaignContentPost(campaignContentPostID, null, "FAILED").then((respnse) => {
                        resolve("Failed to post the data")
                    })
                    resolve(error.message)
                });
        }
        
     })
 
 }

 exports.publishInstagaram = (creationId, accessToken, selectedPage) => {
     return new Promise((resolve, reject) => {
         var config = {
             method: 'post',
             url: 'https://graph.facebook.com/' + selectedPage + '/media_publish?creation_id=' + creationId + '&access_token=' + accessToken,
             headers: {},
             data: ''
         };
         axios(config)
             .then(function (response) {
                 resolve(response)
             })
             .catch(function (error) {
                 resolve(error)
             });
     })
 
 }
 
 exports.addLinkendinPost = (personId, message, url, accessToken, campaignContentPostID, name, assetCredentials,tags) => {
     const self = this
     return new Promise((resolve) => {
         if (url) {
             if(url.indexOf("drive.google.com") > -1) {

                this.getRefreshToken(assetCredentials).then((updateToken) => {
                    if (updateToken.successs) {
                        imageDownloader.googleDownload(updateToken.refreshResponse, url).then((res) =>{
                            imageDownloader.downloader(res.webContentLink, `./assets/${campaignContentPostID}`).then((imageResponse) => {
                                const imagePath = path.join(__dirname, '../', `/assets/${campaignContentPostID}.${imageResponse.fileExtension}`)
                                try {
                                    self.registerUpload(personId, accessToken).then((linkedinPost) => {
                
                                        self.postUploadImage(linkedinPost.uploadUrl.uploadUrl, imagePath, accessToken).then((linkedImage) => {
                
                                            self.postimageWithText(personId, linkedinPost.asset, message, accessToken,tags).then((line) => {
                
                                                self.updateCampaignContentPost(campaignContentPostID, line.id, "SUCCESS").then((respnse) => {
                                                    resolve(respnse)
                                                })
                                            })
                                        })
                                    })
                                } catch (err) 
                                    {
                                        console.log(error.message)
                                    self.updateCampaignContentPost(campaignContentPostID, null, "FAILED").then((respnse) => {
                                        resolve("Failed to post the data")
                                    })
                                    resolve(error)
                                }
                            })
                        })
                    }
                })
             }
             else {
                imageDownloader.downloader(url, `./assets/${campaignContentPostID}`).then((imageResponse) => {
                    const imagePath = path.join(__dirname, '../', `/assets/${campaignContentPostID}.${imageResponse.fileExtension}`)
                    try {
                        self.registerUpload(personId, accessToken).then((linkedinPost) => {
    
                            self.postUploadImage(linkedinPost.uploadUrl.uploadUrl, imagePath, accessToken).then((linkedImage) => {
    
                                self.postimageWithText(personId, linkedinPost.asset, message, accessToken,tags).then((line) => {
    
                                    self.updateCampaignContentPost(campaignContentPostID, line.id, "SUCCESS").then((respnse) => {
                                        resolve(respnse)
                                    })
                                })
                            })
                        })
                    } catch (err) {
                        console.log(error.message)
                        self.updateCampaignContentPost(campaignContentPostID, null, "FAILED").then((respnse) => {
                            resolve("Failed to post the data")
                        })
                        resolve(error)
                    }
                })
             }
             
         } else {
             try {
                 self.postData(personId, message, accessToken).then((linkedinPost) => {
                     self.updateCampaignContentPost(campaignContentPostID, linkedinPost.data, "SUCCESS").then((respnse) => {
                         resolve(respnse)
                     })
                 })
             } catch (err) {
                 self.updateCampaignContentPost(campaignContentPostID, null, "FAILED").then((respnse) => {
                     resolve("Failed to post the data")
                 })
             }
         }
 
     })
 
 }

 exports.addLinkendinPost1 = (personId, message, url, accessToken, campaignContentPostID, name) => {
     const self = this
     return new Promise((resolve) => {
         var data = {
             author: 'urn:li:person:' + personId,
             lifecycleState: 'PUBLISHED',
             specificContent: {
                 'com.linkedin.ugc.ShareContent': {
                     shareCommentary: {
                         text: message,
                     },
                     shareMediaCategory: 'NONE',
                 },
             },
             visibility: {
                 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
             },
         };
         var config = {
             method: 'post',
             url: 'https://api.linkedin.com/v2/ugcPosts?oauth2_access_token=' + accessToken,
             headers: {},
             data: { ...data }
         };
         axios(config)
             .then(function (response) {
                 resolve(response.data);
             })
             .catch(function (error) {
                 resolve(error);
             });
     })
 
 }
  
 // Adding text to Linkendin

 exports.postLinkedinText = async (req, res, next) => {
     try {
         const linkedinPost = await this.postData()
         res.send({
             status: 'success',
             data: linkedinPost,
         });
     } catch (err) {
         next(new AppError(err.message, 200));
     }
 }

 exports.postData = (personId, message, access_token) => {
     return new Promise((resolve) => {
         var data = {
             author: 'urn:li:person:' + personId,
             lifecycleState: 'PUBLISHED',
             specificContent: {
                 'com.linkedin.ugc.ShareContent': {
                     shareCommentary: {
                         text: message,
                     },
                     shareMediaCategory: 'NONE',
                 },
             },
             visibility: {
                 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
             },
         };
         axios
             .post(
                 'https://api.linkedin.com/v2/ugcPosts?oauth2_access_token=' + access_token,
                 { ...data }
             )
             .then(function (response) {
                 resolve(response.data);
             })
             .catch(function (error) {
                 resolve(error);
             });
 
     });
 };
 
 // Adding image to Linkendin

 exports.postLinkedinImage = async (req, res, next) => {
     try {
         const linkedinPost = await this.registerUpload()
         const linkedImage = await this.postUploadImage(linkedinPost.uploadUrl.uploadUrl)
         const line = await this.postimageWithText(linkedinPost.asset)
         res.send({
             status: 'success',
             data: line,
         });
     } catch (err) {
         next(new AppError(err.message, 200));
     }
 }

 exports.registerUpload = (personId, access_token) => {
     return new Promise((resolve) => {
         var data = {
             registerUploadRequest: {
                 owner: 'urn:li:person:' + personId,
                 recipes: [
                     "urn:li:digitalmediaRecipe:feedshare-image"
                 ],
                 serviceRelationships: [
                     {
                         identifier: "urn:li:userGeneratedContent",
                         relationshipType: "OWNER"
                     }
                 ],
                 supportedUploadMechanism: ['SYNCHRONOUS_UPLOAD'],
             }
         }
         axios
             .post(
                 'https://api.linkedin.com/v2/assets?action=registerUpload&oauth2_access_token=' + access_token,
                 { ...data }
             )
             .then(function (response) {
                 const data1 = "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"
                 resolve({ uploadUrl: response.data.value.uploadMechanism[data1], asset: response.data.value.asset });
             })
             .catch(function (error) {
                 resolve(error);
             });
 
     });
 };

 exports.postUploadImage = (url, imagePathh, access_token) => {
     return new Promise((resolve) => {
         const imagePath = path.join(__dirname, '../', `/assets/logo.jpg`)
         var data = fs.createReadStream(imagePathh);
 
         var config = {
             method: 'put',
             url,
             headers: {
                 'Authorization': 'Bearer ' + access_token,
                 'Content-Type': 'image/png',
                 'Cookie': 'lidc="b=TB38:s=T:r=T:a=T:p=T:g=3472:u=10:x=1:i=1629917132:t=1630001462:v=2:sig=AQGvFUnqmSdgs-DJiK9qm45Uc68jXORl"; bcookie="v=2&028dab13-d01b-4bd0-8efc-17adf5db31a5"; lidc="b=VB73:s=V:r=V:a=V:p=V:g=2833:u=1:x=1:i=1629914521:t=1630000921:v=2:sig=AQFloFO15HMkUUzZ4FwAIOGBq03sGeEe"; lang=v=2&lang=en-us'
             },
             data: data
         };
 
         axios(config)
             .then(function (response) {
                 resolve(JSON.stringify(response.data));
             })
             .catch(function (error) {
                 resolve(error);
             });
     })
 
 
 }

 exports.postimageWithText = (personId, asset, message, access_token,tags) => {
     return new Promise((resolve) => {
         var data = {
             author: "urn:li:person:" + personId,
             lifecycleState: "PUBLISHED",
             specificContent: {
                 'com.linkedin.ugc.ShareContent': {
                     media: [
                         {
                             media: asset,
                             status: "READY",
                             title: {
                                 attributes: [],
                                 text: message
                             }
                         }
                     ],
                     shareCommentary: {
                         attributes: [],
                         text: message
                     },
                     shareMediaCategory: "IMAGE",
                 }
             },
 
             visibility: {
                 "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
             }
         }
         axios
             .post(
                 'https://api.linkedin.com/v2/ugcPosts?oauth2_access_token=' + access_token,
                 { ...data }
             )
             .then(function (response) {
 
                 resolve(response.data);
             })
             .catch(function (error) {
                 resolve(error);
             });
 
     });
 
 }

exports.addEmail = (campaignContentPostID, subject, message, fromEmail, toEmail, apiKey, url, domain) => {
    let self = this;
    fromEmail="me@sandbox474de24f86554888a49e598f5a4a8142.mailgun.org"
    domain="sandbox474de24f86554888a49e598f5a4a8142.mailgun.org"
    toEmail="interact2amit@gmail.com"
    return new Promise((resolve) => {
        const mg = mailgun({ apiKey:"dd5a98897f2e5e97fcdc0c29c58337e2-9ad3eb61-bc59fa9e", domain: "sandbox474de24f86554888a49e598f5a4a8142.mailgun.org" });
        const data = {
            // from: '<' + fromEmail + '@' + domain + '>',
            from: '<me@sandbox474de24f86554888a49e598f5a4a8142.mailgun.org>',
            to: toEmail,
            subject,    
            text: message,
            attachment: url
        };

        mg.messages().send(data, function (error, body) {
            console.log(error, body);
            if (error) {
                self.updateCampaignContentPost(campaignContentPostID, null, "FAILED").then((respnse) => {
                    resolve("Failed to post the data")
                })
                resolve({ message: error });
            }
            else if (body) {
                self.updateCampaignContentPost(campaignContentPostID, "", "SUCCESS").then((respnse) => {
                    resolve(body)
                })
                resolve(body)
            }
        });
    })

}

exports.addWaTemplates = (message, url, cta, templateName, accessToken, assetCredentials, appId, waBusinessId) => {
    const self = this
    return new Promise((resolve) => {
        var type = 'feed';
        var waMediaSessionId = "";
        var waMediaId = "";
        var data = new FormData();
        data.append('access_token', accessToken);
        data.append('message', message);

        if (url) {
               if (url && url.indexOf("drive.google.com") > -1) {
                    this.getRefreshToken(assetCredentials).then((updateToken) => {
                       if (updateToken.successs) {
                           imageDownloader.googleDownload(updateToken.refreshResponse, url).then((res) =>{
                               imageDownloader.downloader(res.webContentLink, `./assets/${templateName}`).then((imageResponse) => {
                                   const imagePath = path.join(__dirname, '../', `/assets/${templateName}.${imageResponse.fileExtension}`);
                                   let stats = fs.statSync(imagePath)
                                    let fileSizeInBytes = stats.size;
                                   //create fb media session
                                   let sessionData = new FormData();
                                   sessionData.append('file_length', fileSizeInBytes);
                                   sessionData.append('file_type', `image/${imageResponse.fileExtension}`);
                                   sessionData.append('access_token', accessToken);
                                   
                                   let sessionConfig = {
                                        method: 'post',
                                        maxBodyLength: Infinity,
                                        url: `https://graph.facebook.com/v16.0/${appId}/uploads`,
                                        headers: { 
                                        'Authorization': `Bearer ${accessToken}`, 
                                        ...sessionData.getHeaders()
                                        },
                                        data : sessionData
                                    };
                                    
                                    axios.request(sessionConfig)
                                    .then((response) => {
                                        waMediaSessionId = response.data.id;
                                        if(waMediaSessionId != "") {
                                            //uploading media to wa
                                            let config = {
                                                method: 'post',
                                                maxBodyLength: Infinity,
                                                url: `https://graph.facebook.com/v16.0/${waMediaSessionId}`,
                                                headers: { 
                                                    'Authorization': `OAuth ${accessToken}`, 
                                                    'file_offset': '0',
                                                    "Content-Type": `image/${imageResponse.fileExtension}`
                                                },
                                                data : fs.readFileSync(imagePath)
                                                };
                                                
                                                axios.request(config)
                                                .then((response) => {
                                                waMediaId = response.data.h;
                                                if(waMediaId != "") {
                                                    //media uploaded create template
                                                    let temp_data = {
                                                        "name": templateName.toLowerCase(),
                                                        "category": "MARKETING",
                                                        "allow_category_change": false,
                                                        "language": "en",
                                                        "components": [
                                                            {
                                                            "type": "HEADER",
                                                            "format": "IMAGE",
                                                            "example": {
                                                                "header_handle": [
                                                                waMediaId
                                                                ]
                                                            }
                                                            },
                                                            {
                                                            "type": "BODY",
                                                            "text": message
                                                            },
                                                            {
                                                            "type": "BUTTONS",
                                                            "buttons": [
                                                                {
                                                                "type": "URL",
                                                                "text": "Link",
                                                                "url": cta
                                                                }
                                                            ]
                                                            }
                                                        ]
                                                        }
                                                    let t_data = JSON.stringify(temp_data);
                                                        
                                                        let t_config = {
                                                        method: 'post',
                                                        maxBodyLength: Infinity,
                                                        url: `https://graph.facebook.com/v16.0/${waBusinessId}/message_templates`,
                                                        headers: { 
                                                            'Authorization': 'Bearer '+accessToken, 
                                                            'Content-Type': 'application/json'
                                                        },
                                                        data : t_data
                                                        };
                                                        
                                                        axios.request(t_config)
                                                        .then(async (response) => {
                                                        if (fs.existsSync(imagePath)) {
                                                            fs.unlinkSync(imagePath)
                                                        }
                                                        const content = {
                                                            wp_template_name: templateName.toLowerCase(),
                                                            file_url: url,
                                                            status: response.data.status,
                                                            body: message,
                                                            footer: cta
                                                          };
                                                        await WhatsappTemplates.create(content);
                                                        resolve(response)
                                                        })
                                                        .catch((error) => {
                                                        resolve(error.response.data.error.error_user_title ? error.response.data.error.error_user_title : error.response.data.error.message)
                                                        });
                                                } else {
                                                    //media not uploaded
                                                    resolve("Media upload error.")
                                                }
                                                })
                                                .catch((error) => {
                                                console.log('e', error.response);
                                                resolve(error.response.data.error.message)
                                                });
                                        } else {
                                            //error session not created
                                            resolve("Upload session create error.")
                                        }
                                    })
                                    .catch((error) => {
                                        console.log(error);
                                        resolve(error.response.data.error.message)
                                    });
                               })
                           })
                       }
                   })
               } else {
                   imageDownloader.downloader(url, `./assets/${templateName}`).then((imageResponse) => {
                       const imagePath = path.join(__dirname, '../', `/assets/${templateName}.${imageResponse.fileExtension}`)
                        //create fb media session
                        let sessionData = new FormData();
                        let stats = fs.statSync(imagePath)
                        let fileSizeInBytes = stats.size;
                        sessionData.append('file_length', fileSizeInBytes);
                        sessionData.append('file_type', `image/${imageResponse.fileExtension}`);
                        sessionData.append('access_token', accessToken);
                        
                        let sessionConfig = {
                             method: 'post',
                             maxBodyLength: Infinity,
                             url: `https://graph.facebook.com/v16.0/${appId}/uploads`,
                             headers: { 
                             'Authorization': `Bearer ${accessToken}`, 
                             ...sessionData.getHeaders()
                             },
                             data : sessionData
                         };
                         
                         axios.request(sessionConfig)
                         .then((response) => {
                             waMediaSessionId = response.data.id;
                             if(waMediaSessionId != "") {
                                 //uploading media to wa
                                 const FormData = require('form-data');
                                 let mdata = new FormData();
                                 mdata.append('file', fs.createReadStream(imagePath));
                                 let config = {
                                     method: 'post',
                                     maxBodyLength: Infinity,
                                     url: `https://graph.facebook.com/v16.0/${waMediaSessionId}`,
                                     headers: { 
                                        'Authorization': `OAuth ${accessToken}`, 
                                        'file_offset': '0',
                                        "Content-Type": `image/${imageResponse.fileExtension}`
                                    },
                                    data : fs.readFileSync(imagePath)
                                   };
                                   
                                   axios.request(config)
                                   .then((response) => {
                                     waMediaId = response.data.h;
                                     if(waMediaId != "") {
                                         //media uploaded create template
                                         let temp_data = {
                                             "name": templateName.toLowerCase(),
                                             "category": "MARKETING",
                                             "allow_category_change": false,
                                             "language": "en",
                                             "components": [
                                               {
                                                 "type": "HEADER",
                                                 "format": "IMAGE",
                                                 "example": {
                                                   "header_handle": [
                                                     waMediaId
                                                   ]
                                                 }
                                               },
                                               {
                                                 "type": "BODY",
                                                 "text": message
                                               },
                                               {
                                                 "type": "BUTTONS",
                                                 "buttons": [
                                                   {
                                                     "type": "URL",
                                                     "text": "Link",
                                                     "url": cta
                                                   }
                                                 ]
                                               }
                                             ]
                                           }
                                         let t_data = JSON.stringify(temp_data);
                                           
                                           let t_config = {
                                             method: 'post',
                                             maxBodyLength: Infinity,
                                             url: `https://graph.facebook.com/v16.0/${waBusinessId}/message_templates`,
                                             headers: { 
                                               'Authorization': 'Bearer '+accessToken, 
                                               'Content-Type': 'application/json'
                                             },
                                             data : t_data
                                           };
                                           
                                           axios.request(t_config)
                                           .then(async (response) => {
                                             if (fs.existsSync(imagePath)) {
                                                fs.unlinkSync(imagePath)
                                            }
                                             const content = {
                                                wp_template_name: templateName.toLowerCase(),
                                                file_url: url,
                                                status: response.data.status,
                                                body: message,
                                                footer: cta
                                              };
                                            await WhatsappTemplates.create(content);
                                             resolve(response)
                                           })
                                           .catch((error) => {
                                             console.log('e',error.response.data);
                                             resolve(error.response.data.error.message)
                                           });
                                     } else {
                                         //media not uploaded
                                         resolve("Media upload error.")
                                     }
                                   })
                                   .catch((error) => {
                                     console.log(error.response);
                                     resolve(error.response.data.error.message)
                                   });
                             } else {
                                 //error session not created
                                 resolve("Upload session create error.")
                             }
                         })
                         .catch((error) => {
                             console.log(error);
                             resolve(error.response.data.error.message)
                         });
                   })
               }   
        } else {
            let temp_data = {
                "name": templateName.toLowerCase(),
                "category": "MARKETING",
                "allow_category_change": false,
                "language": "en",
                "components": [
                  {
                    "type": "BODY",
                    "text": message
                  },
                  {
                    "type": "BUTTONS",
                    "buttons": [
                      {
                        "type": "URL",
                        "text": "Link",
                        "url": cta
                      }
                    ]
                  }
                ]
              }
            let t_data = JSON.stringify(temp_data);
              
            let t_config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `https://graph.facebook.com/v16.0/${waBusinessId}/message_templates`,
                headers: { 
                    'Authorization': 'Bearer '+accessToken, 
                    'Content-Type': 'application/json'
                },
                data : t_data
            };
            
            axios.request(t_config)
            .then(async(response) => {
                const content = {
                    wp_template_name: templateName.toLowerCase(),
                    status: response.data.status,
                    body: message,
                    footer: cta
                  };
                await WhatsappTemplates.create(content);
                resolve(response)
            })
            .catch((error) => {
                console.log(error.response.data.error.message);
                resolve(error.response.data.error.message)
            });
        }
    })

}