const cron = require('node-cron');
const postController = require('./postController');
const leadsController = require('./leadsController');
const campaignDefinitionController = require('./campaignDefinitionController');
const { campaignViewer, campaignDefinition } = require('../models');
const analyticsController = require('../controllers/analyticsController');
const db = require('../models');
const socialPresence = db.socialPresence;
const LeadContact = db.leadContact;
const axios = require('axios');

exports.cronJobs = () => {
  db.sequelize.authenticate()
  .then(() => console.log('DB connection OK'))
  .catch(err => console.error('DB connection failed:', err));
  cron.schedule('*/1 * * * *', () => {
    // analyticsController.getConnections('Facebook').then((allFbConnectionData) => {
    //   return analyticsController.getCommentsForSocialInbox(allFbConnectionData, 'Facebook', 'Today');
    // });
    // analyticsController.addUpdateAnalyticsForCampaigns();
    console.log('running a task every two minutes');
    postController
      .getCurrentPostDetails()
      .then((postDetails) => {
        console.log(' Scheduler is active now ' + new Date());

        let promises = [];
        postDetails.data.forEach((postDetail) => {
          if (
            (postDetail.name.toLowerCase() === 'facebook' ||
              postDetail.name.toLowerCase() === 'fb') &&
            (postDetail.status === 'LIVE' || postDetail.status === 'APPROVED')
          ) {
            promises.push(
              postController.addFacebookPost(
                postDetail.pageId,
                postDetail.description,
                postDetail.url,
                postDetail.accessToken,
                postDetail.campaignContentPostID,
                postDetail.name,
                postDetail.assetCredentials,
                postDetail.tags
              )
            );
          } else if (
            postDetail.name.toLowerCase() === 'youtube' &&
            (postDetail.status === 'LIVE' || postDetail.status === 'APPROVED')
          ) {
            promises.push(
              postController.addyoutubePost(
                postDetail.pageId,
                postDetail.description,
                postDetail.url,
                postDetail.accessToken,
                postDetail.campaignContentPostID,
                postDetail.name,
                postDetail.pageToken,
                postDetail.assetCredentials,
                postDetail.tags,
                postDetail.publishVideoAs
              )
            );
          } else if (
            postDetail.name.toLowerCase() === 'instagram' &&
            (postDetail.status === 'LIVE' || postDetail.status === 'APPROVED')
          ) {
            promises.push(
              postController.addInstagaramPost(
                postDetail.pageId,
                postDetail.description,
                postDetail.url,
                postDetail.accessToken,
                postDetail.campaignContentPostID,
                postDetail.name,
                postDetail.assetCredentials,
                postDetail.tags
              )
            );
          } else if (
            postDetail.name.toLowerCase() === 'linkedin' &&
            (postDetail.status === 'LIVE' || postDetail.status === 'APPROVED')
          ) {
            promises.push(
              postController.addLinkendinPost(
                postDetail.pageId,
                postDetail.description,
                postDetail.url,
                postDetail.accessToken,
                postDetail.campaignContentPostID,
                postDetail.name,
                postDetail.assetCredentials,
                postDetail.tags
              )
            );
          } else if (
            postDetail.name.toLowerCase() === 'e-mail' &&
            (postDetail.status === 'LIVE' || postDetail.status === 'APPROVED')
          ) {
            promises.push(
              postController.addEmail(
                postDetail.campaignContentPostID,
                'subject',
                postDetail.description
              )
            );
          }
        });
        Promise.all(promises)
          .then((response) => {
            if (response[0]) {
            }
          })
          .catch((er) => {
            console.log('errrrrr', er);
          });
      })
      .catch((err) => {
        //console.log(' Error while Scheduler is active now ' + new Date());
        //console.log(err);
      });

    console.log('running a task every two minutes Whatsapp broadcast');
    leadsController
      .getCurrentPostDetails()
      .then((postDetails) => {
        let promises = [];
        postDetails.data.map((postDetail) => {
          postDetail
            .then((r) => {
              if (r.postStatus === 'FAILED' || r.postStatus === 'WAITING') {
                JSON.parse(JSON.parse(r.selected_leads)).map((ld) => {
                  LeadContact.findAll({
                    where: {
                      lead_id: ld
                    },
                    attributes: ['phone_number', 'id', 'status'],
                  })
                    .then((res) => {
                      for (let i in res) {
                        promises.push(
                          leadsController.broadcastMessage(
                            res[i].dataValues.phone_number,
                            ld,
                            r.wp_template,
                            r.whatsappContentPostID,
                            r.whatsappBroadcastContnentID,
                            r.accessToken,
                            r.wa_template_lang,
                            r.file_url,
                            r.orgID,
                            r.wa_campaign,
                            r.whatsAppId,
                          )
                        );
                      }
                    })
                    .catch((err) => {
                      console.log('err', err);
                    });
                });
              }
            })
            .catch((er) => {});
        });
        
        console.log('this is bhaskar promises', promises);
        // await WhatsappContentPost.update(
        //   {
        //     postId: pId,
        //     postStatus: 'SUCCESS',
        //   },
        //   { where: { whatsappContentPostID } }
        // );
        chunkPromises(promises, 25)
          .then((results) => {
            console.log('chunked result promises', results);
          });

        // Promise.all(promises).then((response) => {
        //   console.log(response);
        // });
      })
      .catch((err) => {
        console.log(' Error while Scheduler is active now ' + new Date());
        console.log(err);
      });
  });

  async function chunkPromises(promises, chunkSize) {
    const chunks = [];
    for (let i = 0; i < promises.length; i += chunkSize) {
      const chunk = promises.slice(i, i + chunkSize);
      chunks.push(Promise.all(chunk));
    }
    return Promise.all(chunks);
  }
  

  
  
  // cron that runs everyday midnight at 3am
  cron.schedule('0 3 * * *', () => {
    console.log('Running a task at 3:00 AM every day');
    analyticsController.getConnections('Instagram').then((allFbConnectionData) => {
      return analyticsController.getCommentsForSocialInbox(allFbConnectionData, 'Instagram', 'Yesterday');
    });
    analyticsController.getConnections('Youtube').then((allFbConnectionData) => {
      return analyticsController.getCommentsForSocialInbox(allFbConnectionData, 'Youtube', 'Yesterday');
    });
    analyticsController.getConnections('Facebook').then((allFbConnectionData) => {
      return analyticsController.getCommentsForSocialInbox(allFbConnectionData, 'Facebook', 'Yesterday');
    });
    analyticsController.addUpdateAnalyticsForCampaigns();
    // analyticsController.getConnections('LinkedIn').then((allFbConnectionData) => {
    //   return analyticsController.getCommentsForSocialInbox(allFbConnectionData, 'LinkedIn', 'Yesterday');
    // });
  });
  


  // cron that runs everyday midnight
  cron.schedule('0 0 */6 * * *', () => {
    // get fb comments
    // analyticsController.getConnections('Facebook').then((allFbConnectionData) => {
    //   return analyticsController.getCommentsForSocialInbox(allFbConnectionData);
    // });
    // analyticsController.getConnections('Google Reviews').then((result) => {
    //   return analyticsController.getReviews(result);
    // });
    analyticsController.getSubscriptionDetails().then((result) => {
      return analyticsController.getInsights(result);
    });
  });

  // cron that runs everyday midnight
  cron.schedule('0 0 0 * * *', () => {
    campaignDefinitionController.updateCampaignCompletedStatus().then((res) => {
    });
    leadsController.updateWACampaignCompletedStatus().then((res) => {
    });
    //social presence
    try {
      db.socialMediaConnection
        .findAll({
          where: { status: 'Active', socialMediaType: 'ORGANIC' },
          attributes: [
            'name',
            'socialMediaType',
            'organizationOrgId',
            'status',
            'isConfigured',
          ],
          include: [
            {
              model: db.socialMediaPage,
              as: 'socialMediaPage',
            },
          ],
        })
        .then((socialChannelsData) => {
          if (socialChannelsData.length > 0) {
            for (let i in socialChannelsData) {
              if (socialChannelsData[i].name == 'Instagram') {
                let config = {
                  method: 'get',
                  maxBodyLength: Infinity,
                  url: `https://graph.facebook.com/v16.0/${socialChannelsData[i].socialMediaPage.url}?fields=business_discovery.username(tseries.official){follows_count,followers_count,media_count}&access_token=${socialChannelsData[i].socialMediaPage.password}`,
                  headers: {},
                };

                axios
                  .request(config)
                  .then(async (response) => {
                    if (response.data) {
                      const addSocialPresenceData = {
                        socialName: socialChannelsData[i].name,
                        totalPosts:
                          response.data.business_discovery.media_count,
                        totalFollowing:
                          response.data.business_discovery.follows_count,
                        totalFollowers:
                          response.data.business_discovery.followers_count,
                        organizationOrgId:
                          socialChannelsData[i].organizationOrgId,
                        socalMediaConnectionId:
                          socialChannelsData[i].socialMediaPage
                            .socialMediaConnectionSocalMediaConnectionId,
                      };

                      await socialPresence.create(addSocialPresenceData);
                    }
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              } else if (socialChannelsData[i].name == 'Facebook') {
                let config = {
                  method: 'get',
                  maxBodyLength: Infinity,
                  url: `https://graph.facebook.com/v16.0/${socialChannelsData[i].socialMediaPage.url}?access_token=${socialChannelsData[i].socialMediaPage.password}&fields=fan_count,name,followers_count,new_like_count,published_posts`,
                  headers: {},
                };

                axios
                  .request(config)
                  .then(async (response) => {
                    if (response.data) {
                      const addSocialPresenceData = {
                        socialName: socialChannelsData[i].name,
                        totalPosts: response.data.published_posts.data.length,
                        totalFollowing: response.data.fan_count,
                        totalFollowers: response.data.followers_count,
                        organizationOrgId:
                          socialChannelsData[i].organizationOrgId,
                        socalMediaConnectionId:
                          socialChannelsData[i].socialMediaPage
                            .socialMediaConnectionSocalMediaConnectionId,
                      };

                      await socialPresence.create(addSocialPresenceData);
                    }
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              } else if (socialChannelsData[i].name == 'Youtube') {
                let config = {
                  method: 'get',
                  maxBodyLength: Infinity,
                  url: `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${socialChannelsData[i].socialMediaPage.url}&key=AIzaSyCmPX-4KQ-wjqFqJCYGGRtuYwqjY8s_jt4`,
                  headers: {},
                };

                axios
                  .request(config)
                  .then(async (response) => {
                    if (response.data) {
                      const addSocialPresenceData = {
                        socialName: socialChannelsData[i].name,
                        totalPosts:
                          response.data.items[0].statistics.videoCount,
                        totalFollowing:
                          response.data.items[0].statistics.viewCount,
                        totalFollowers:
                          response.data.items[0].statistics.subscriberCount,
                        organizationOrgId:
                          socialChannelsData[i].organizationOrgId,
                        socalMediaConnectionId:
                          socialChannelsData[i].socialMediaPage
                            .socialMediaConnectionSocalMediaConnectionId,
                      };

                      await socialPresence.create(addSocialPresenceData);
                    }
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              }
            }

          }
        })
        .catch((err) => {
          console.log('social presence error', err);
        });
    } catch (err) {
      //next(new AppError(err.message, 200));
    }
  });

  // cron that run everyday midnight to run the analytics
  cron.schedule('0 0 0 * * *', () => {
    campaignDefinitionController.getLiveCampagins().then((res) => {
      const promises = [];
      if (res) {
        res.map((CurrentItem) => {
          promises.push(
            analyticsController.getAnalyticsData(
              CurrentItem.campaignDefintionId
            )
          );
        });
        Promise.all(promises).then((results) => {
          const savePromise = [];
          results.map((CurrentItem) => {
            savePromise.push(analyticsController.saveAnalytics(CurrentItem));
          });
          Promise.all(savePromise).then((saveresults) => {
          });
        });
      }
    });
  });
  //User

  // cron that rus every hour
  cron.schedule('0 0 */1 * * *', () => {
    campaignDefinitionController.updateLiveCampaignStatus().then((res) => {
    });
  });
};
