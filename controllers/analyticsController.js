const db = require("../models");
const AppError = require("../utils/appError");
const { Op } = require("sequelize");
const axios = require("axios");

const campaignController = require("../controllers/campaignDefinitionController");
const analyticsController = require("../controllers/analyticsController");
const postController = require("../controllers/postController");
const campaignDefinitionController = require("../controllers/campaignDefinitionController");
const { composer } = require("googleapis/build/src/apis/composer");
const campaignDefinition = db.campaignDefinition;
const socialPresence = db.socialPresence;
const youtubeAnalytics = db.youtubeAnalytics;
const WaBroadcastLog = db.waBroadcastLog;
const Analytics = db.analytics;
const SocialInbox = db.socialInbox;
const SocialAnalytics = db.socialAnalytics;
const campaignViewer = db.campaignViewer;
const campaignSelectionChannel = db.campaignSelectionChannel;
const socialMediaConnection = db.socialMediaConnection;
const campaignContent = db.campaignContent;
const campaignContentPost = db.campaignContentPost;
const configs = require("../config/config.json");
const moment = require("moment");

exports.OldgetCampaginAnalytics = async (req, res, next) => {
  try {
    const { campaignDefinitionId } = req.body;

    const foundItem = await db.campaignContentPost.findAll({
      where: {
        postId: {
          [Op.ne]: null,
        },
      },
      attributes: ["postId"],
      include: [
        {
          model: db.campaignContent,
          required: true,
          as: "campaignContent",
          attributes: ["campaignContentId"],
          include: [
            {
              model: db.campaignSelectionChannel,
              required: true,
              as: "campaignSelectionChannel",
              attributes: ["campaignSelectionId"],
              include: [
                {
                  model: db.socialMediaConnection,
                  as: "socialMediaConnection",
                  attributes: [
                    "name",
                    "socialMediaType",
                    "socialMediaHandle",
                    "password",
                  ],
                  include: [
                    {
                      model: db.socialMediaPage,
                      as: "socialMediaPage",
                      attributes: ["url", "password"],
                    },
                  ],
                },
                {
                  model: db.campaignDefinition,

                  as: "campaignDefinition",
                  where: {
                    campaignDefinitionId: campaignDefinitionId,
                  },
                  attributes: [
                    "name",
                    "startAt",
                    "endAt",
                    "totalAudience",
                    "status",
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    let youTubeResult = {
      viewCount: 0,
      likeCount: 0,
      dislikeCount: 0,
      favoriteCount: 0,
      commentCount: 0,
    };
    let facebookResult = {
      viewCount: 0,
      like: 0,
      wow: 0,
      comment: 0,
    };
    let instagramResult = {
      view_count: "0",
      like_count: 0,
      comments_count: 0,
    };

    const filteredPost = foundItem.filter(
      (item) => item.campaignContent.campaignSelectionChannel
    );
    //console.log('filteredPost')
    //console.log(filteredPost)
    let startDate, endDate, totalAudience, status, campaignName;
    if (filteredPost.length === 0) {
      const campaginData = await this.getCampaginDefinitionData(
        campaignDefinitionId
      );
      startDate = campaginData.startAt;
      endDate = campaginData.endAt;
      totalAudience = campaginData.totalAudience;
      status = campaginData.status;
      campaignName = campaginData.name;
    }

    if (filteredPost.length) {
      startDate =
        filteredPost[0].campaignContent.campaignSelectionChannel
          .campaignDefinition.startAt;
      endDate =
        filteredPost[0].campaignContent.campaignSelectionChannel
          .campaignDefinition.endAt;
      totalAudience =
        filteredPost[0].campaignContent.campaignSelectionChannel
          .campaignDefinition.totalAudience;
      status =
        filteredPost[0].campaignContent.campaignSelectionChannel
          .campaignDefinition.status;
      campaignName =
        filteredPost[0].campaignContent.campaignSelectionChannel
          .campaignDefinition.name;
      facebookData = filteredPost
        .filter((currentItem) => {
          return (
            currentItem.campaignContent.campaignSelectionChannel.socialMediaConnection.name.toLowerCase() ===
            "facebook"
          );
        })
        .map((currentItem) => {
          return {
            pageId:
              currentItem.campaignContent.campaignSelectionChannel
                .socialMediaConnection.socialMediaPage.url,
            password:
              currentItem.campaignContent.campaignSelectionChannel
                .socialMediaConnection.socialMediaPage.password,
            postId: currentItem.postId,
            startDate:
              currentItem.campaignContent.campaignSelectionChannel
                .campaignDefinition.startAt,
            endDate:
              currentItem.campaignContent.campaignSelectionChannel
                .campaignDefinition.endAt,
            totalAudience:
              currentItem.campaignContent.campaignSelectionChannel
                .campaignDefinition.totalAudience,
            userName:
              currentItem.campaignContent.campaignSelectionChannel
                .socialMediaConnection.socialMediaHandle,
          };
        });

      instagramData = filteredPost
        .filter((currentItem) => {
          return (
            currentItem.campaignContent.campaignSelectionChannel.socialMediaConnection.name.toLowerCase() ===
            "instagram"
          );
        })
        .map((currentItem) => {
          return {
            pageId:
              currentItem.campaignContent.campaignSelectionChannel
                .socialMediaConnection.socialMediaPage.url,
            password:
              currentItem.campaignContent.campaignSelectionChannel
                .socialMediaConnection.socialMediaPage.password,
            postId: currentItem.postId,
            startDate:
              currentItem.campaignContent.campaignSelectionChannel
                .campaignDefinition.startAt,
            endDate:
              currentItem.campaignContent.campaignSelectionChannel
                .campaignDefinition.endAt,
            totalAudience:
              currentItem.campaignContent.campaignSelectionChannel
                .campaignDefinition.totalAudience,
            userName:
              currentItem.campaignContent.campaignSelectionChannel
                .socialMediaConnection.socialMediaHandle,
          };
        });
      youtubeData = filteredPost
        .filter((currentItem) => {
          return (
            currentItem.campaignContent.campaignSelectionChannel.socialMediaConnection.name.toLowerCase() ===
            "youtube"
          );
        })
        .map((currentItem) => {
          return {
            pageId:
              currentItem.campaignContent.campaignSelectionChannel
                .socialMediaConnection.socialMediaPage.url,
            password:
              currentItem.campaignContent.campaignSelectionChannel
                .socialMediaConnection.socialMediaPage.password,
            postId: currentItem.postId,
            startDate:
              currentItem.campaignContent.campaignSelectionChannel
                .campaignDefinition.startAt,
            endDate:
              currentItem.campaignContent.campaignSelectionChannel
                .campaignDefinition.endAt,
            totalAudience:
              currentItem.campaignContent.campaignSelectionChannel
                .campaignDefinition.totalAudience,
            userName:
              currentItem.campaignContent.campaignSelectionChannel
                .socialMediaConnection.socialMediaHandle,
          };
        });

      let youTubePromise = [];

      youtubeData.forEach((currentData) => {
        youTubePromise.push(this.getyoutubePostDetails(currentData));
      });
      facebookData.forEach((currentData) => {
        youTubePromise.push(this.getFacebookpostDetails(currentData));
      });

      instagramData.forEach((currentData) => {
        youTubePromise.push(this.getInstagramDetails(currentData));
      });

      Promise.all(youTubePromise).then((currentItem) => {
        if (currentItem && currentItem[0] != undefined) {
          facebookResult.viewCount = this.mergeProperties(
            currentItem,
            "viewCount"
          );
          facebookResult.wow = this.mergeProperties(currentItem, "wow");
          facebookResult.like = this.mergeProperties(currentItem, "like");
          facebookResult.comment = this.mergeProperties(currentItem, "comment");
          youTubeResult.viewCount = this.mergeProperties(
            currentItem,
            "viewCount"
          );
          youTubeResult.likeCount = this.mergeProperties(
            currentItem,
            "likeCount"
          );
          youTubeResult.dislikeCount = this.mergeProperties(
            currentItem,
            "dislikeCount"
          );
          youTubeResult.favoriteCount = this.mergeProperties(
            currentItem,
            "favoriteCount"
          );
          youTubeResult.commentCount = this.mergeProperties(
            currentItem,
            "commentCount"
          );
          instagramResult.like_count = this.mergeProperties(
            currentItem,
            "like_count"
          );
          instagramResult.view_count = this.mergeProperties(
            currentItem,
            "view_count"
          );
          instagramResult.comments_count = this.mergeProperties(
            currentItem,
            "comments_count"
          );
        }

        console.log("facebookResult");
        console.log(facebookResult);
        console.log("youTubeResult");
        console.log(youTubeResult);
        console.log("instagramResult");
        console.log(instagramResult);
        const reach = this.getReachCount(
          facebookResult,
          youTubeResult,
          instagramResult
        );
        console.log("hji");

        res.send({
          status: "success",
          data: {
            campaign_name: campaignName,
            campaign_start_date: startDate,
            campaign_end_date: endDate,
            campaign_total_audience: totalAudience,
            campaign_status: status,
            connections: {
              facebook: facebookResult,
              youtube: youTubeResult,
              instagram: instagramResult,
            },
            reach,
            engagement: this.getEngagemnetInfo(
              facebookResult,
              youTubeResult,
              instagramResult,
              reach
            ),
          },
        });
      });
    } else {
      res.send({
        status: "success",
        data: {
          campaign_name: campaignName,
          campaign_start_date: startDate,
          campaign_end_date: endDate,
          campaign_total_audience: totalAudience,
          campaign_status: status,

          connections: {
            facebook: facebookResult,
            youtube: youTubeResult,
            instagram: instagramResult,
          },
          reach: 0,
          engagement: 0,
        },
      });
    }
  } catch (err) {
    next(new AppError(err.message, 200));
  }
};

exports.getCampaginAnalytics = async (req, res, next) => {
  try {
    const { campaignDefinitionId } = req.body;

    const foundItem = await db.analytics.findOne({
      where: {
        campaignDefinitionId,
      },
      order: [["createdAt", "DESC"]],
    });
    if (!foundItem) {
      const item = db.campaignDefinition.findOne({
        where: {
          campaignDefinitionId,
        },
      });
      const getAllSent = WaBroadcastLog.findAll({
        where: {
          wa_campaign: campaignDefinitionId,
          sent: 1,
        },
        attributes: ["sent"],
      });

      Promise.all([item, getAllSent])
        .then((responses) => {
          res.send({
            status: "success",
            data: {
              campaign_name: responses[0].name,
              fbLeadsAmount: responses[0].fbLeadsAmount,
              whatsAppLeadsAmount: responses[0].whatsAppLeadsAmount,
              campaign_start_date: responses[0].startAt,
              campaign_end_date: responses[0].endAt,
              campaign_total_audience: responses[0].totalAudience,
              campaign_status: responses[0].status,
              connections: {
                facebook: {
                  viewCount: 0,
                  like: 0,
                  wow: 0,
                  comment: 0,
                },
                youtube: {
                  viewCount: 0,
                  likeCount: 0,
                  dislikeCount: 0,
                  favoriteCount: 0,
                  commentCount: 0,
                },
                instagram: {
                  view_count: 0,
                  like_count: 0,
                  comments_count: 0,
                },
                email: {
                  "No of Email": 0,
                },
                sms: {
                  "No of SMS": 0,
                },
                whatsapp: {
                  "No of Message send": responses[1].length,
                },
              },
              reach: 0,
              engagement: 0,
              analyticsid: "",
            },
          });
        })
        .catch((err) => {
          console.log("**********ERROR RESULT****************");
          console.log(err);
        });
    } else {
      res.send({
        status: "success",
        data: {
          campaign_name: foundItem.name,
          campaign_start_date: foundItem.startAt,
          campaign_end_date: foundItem.endAt,
          campaign_total_audience: foundItem.totalAudience,
          campaign_status: foundItem.status,
          connections: JSON.parse(foundItem.connections),
          reach: foundItem.reach,
          engagement: foundItem.engagement,
          analyticsid: foundItem.analyticsId,
        },
      });
    }
  } catch (err) {
    next(new AppError(err.message, 200));
  }
};

exports.getAnalyticsData = (campaignDefinitionId) => {
  return new Promise((resolve, reject) => {
    console.log("campaignDefinitionId", campaignDefinitionId);
    this.getData(campaignDefinitionId).then((response) => {
      console.log("abc==============>");
      console.log(response);
      resolve(response);
    });
  });
};

exports.getData = async (campaignDefinitionId) => {
  return new Promise((resolve, reject) => {
    try {
      db.campaignContentPost
        .findAll({
          where: {
            postId: {
              [Op.ne]: null,
            },
          },
          attributes: ["postId"],
          include: [
            {
              model: db.campaignContent,
              required: true,
              as: "campaignContent",
              attributes: ["campaignContentId"],
              include: [
                {
                  model: db.campaignSelectionChannel,
                  required: true,
                  as: "campaignSelectionChannel",
                  attributes: ["campaignSelectionId"],
                  include: [
                    {
                      model: db.socialMediaConnection,
                      as: "socialMediaConnection",
                      attributes: [
                        "name",
                        "socialMediaType",
                        "socialMediaHandle",
                        "password",
                      ],
                      include: [
                        {
                          model: db.socialMediaPage,
                          as: "socialMediaPage",
                          attributes: ["url", "password"],
                        },
                      ],
                    },
                    {
                      model: db.campaignDefinition,

                      as: "campaignDefinition",
                      where: {
                        campaignDefinitionId: campaignDefinitionId,
                      },
                      attributes: [
                        "name",
                        "startAt",
                        "endAt",
                        "totalAudience",
                        "status",
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        })
        .then((foundItem) => {
          let youTubeResult = {
            viewCount: 0,
            likeCount: 0,
            dislikeCount: 0,
            favoriteCount: 0,
            commentCount: 0,
          };
          let facebookResult = {
            viewCount: 0,
            like: 0,
            wow: 0,
            comment: 0,
          };
          let instagramResult = {
            view_count: "0",
            like_count: 0,
            comments_count: 0,
          };

          let emailResult = {
            "No of Email": 0,
          };
          let smsResult = {
            "No of SMS": 0,
          };
          let whatsappResult = {
            "No of Message send": 0,
          };

          const filteredPost = foundItem.filter(
            (item) => item.campaignContent.campaignSelectionChannel
          );
          console.log("filteredPost");
          console.log(filteredPost);
          let startDate, endDate, totalAudience, status, campaignName;
          if (filteredPost.length === 0) {
            this.getCampaginDefinitionData(campaignDefinitionId).then(
              (campaginData) => {
                startDate = campaginData.startAt;
                endDate = campaginData.endAt;
                totalAudience = campaginData.totalAudience;
                status = campaginData.status;
                campaignName = campaginData.name;
              }
            );
          }

          if (filteredPost.length) {
            startDate =
              filteredPost[0].campaignContent.campaignSelectionChannel
                .campaignDefinition.startAt;
            endDate =
              filteredPost[0].campaignContent.campaignSelectionChannel
                .campaignDefinition.endAt;
            totalAudience =
              filteredPost[0].campaignContent.campaignSelectionChannel
                .campaignDefinition.totalAudience;
            status =
              filteredPost[0].campaignContent.campaignSelectionChannel
                .campaignDefinition.status;
            campaignName =
              filteredPost[0].campaignContent.campaignSelectionChannel
                .campaignDefinition.name;
            facebookData = filteredPost
              .filter((currentItem) => {
                return (
                  currentItem.campaignContent.campaignSelectionChannel.socialMediaConnection.name.toLowerCase() ===
                  "facebook"
                );
              })
              .map((currentItem) => {
                return {
                  pageId:
                    currentItem.campaignContent.campaignSelectionChannel
                      .socialMediaConnection.socialMediaPage.url,
                  password:
                    currentItem.campaignContent.campaignSelectionChannel
                      .socialMediaConnection.socialMediaPage.password,
                  postId: currentItem.postId,
                  startDate:
                    currentItem.campaignContent.campaignSelectionChannel
                      .campaignDefinition.startAt,
                  endDate:
                    currentItem.campaignContent.campaignSelectionChannel
                      .campaignDefinition.endAt,
                  totalAudience:
                    currentItem.campaignContent.campaignSelectionChannel
                      .campaignDefinition.totalAudience,
                  userName:
                    currentItem.campaignContent.campaignSelectionChannel
                      .socialMediaConnection.socialMediaHandle,
                };
              });

            instagramData = filteredPost
              .filter((currentItem) => {
                return (
                  currentItem.campaignContent.campaignSelectionChannel.socialMediaConnection.name.toLowerCase() ===
                  "instagram"
                );
              })
              .map((currentItem) => {
                return {
                  pageId:
                    currentItem.campaignContent.campaignSelectionChannel
                      .socialMediaConnection.socialMediaPage.url,
                  password:
                    currentItem.campaignContent.campaignSelectionChannel
                      .socialMediaConnection.socialMediaPage.password,
                  postId: currentItem.postId,
                  startDate:
                    currentItem.campaignContent.campaignSelectionChannel
                      .campaignDefinition.startAt,
                  endDate:
                    currentItem.campaignContent.campaignSelectionChannel
                      .campaignDefinition.endAt,
                  totalAudience:
                    currentItem.campaignContent.campaignSelectionChannel
                      .campaignDefinition.totalAudience,
                  userName:
                    currentItem.campaignContent.campaignSelectionChannel
                      .socialMediaConnection.socialMediaHandle,
                };
              });
            youtubeData = filteredPost
              .filter((currentItem) => {
                return (
                  currentItem.campaignContent.campaignSelectionChannel.socialMediaConnection.name.toLowerCase() ===
                  "youtube"
                );
              })
              .map((currentItem) => {
                return {
                  pageId:
                    currentItem.campaignContent.campaignSelectionChannel
                      .socialMediaConnection.socialMediaPage.url,
                  password:
                    currentItem.campaignContent.campaignSelectionChannel
                      .socialMediaConnection.socialMediaPage.password,
                  postId: currentItem.postId,
                  startDate:
                    currentItem.campaignContent.campaignSelectionChannel
                      .campaignDefinition.startAt,
                  endDate:
                    currentItem.campaignContent.campaignSelectionChannel
                      .campaignDefinition.endAt,
                  totalAudience:
                    currentItem.campaignContent.campaignSelectionChannel
                      .campaignDefinition.totalAudience,
                  userName:
                    currentItem.campaignContent.campaignSelectionChannel
                      .socialMediaConnection.socialMediaHandle,
                };
              });

            let youTubePromise = [];

            youtubeData.forEach((currentData) => {
              youTubePromise.push(this.getyoutubePostDetails(currentData));
            });
            facebookData.forEach((currentData) => {
              youTubePromise.push(this.getFacebookpostDetails(currentData));
            });

            instagramData.forEach((currentData) => {
              youTubePromise.push(this.getInstagramDetails(currentData));
            });

            Promise.all(youTubePromise).then((currentItem) => {
              if (currentItem && currentItem[0] != undefined) {
                facebookResult.wow = this.mergeProperties(currentItem, "wow");
                facebookResult.like = this.facebookmergeProperties(
                  currentItem[0].values,
                  "like"
                );
                facebookResult.comment = this.mergeProperties(
                  currentItem,
                  "comment"
                );
                youTubeResult.viewCount = this.mergeProperties(
                  currentItem,
                  "viewCount"
                );
                youTubeResult.likeCount = this.mergeProperties(
                  currentItem,
                  "likeCount"
                );
                youTubeResult.dislikeCount = this.mergeProperties(
                  currentItem,
                  "dislikeCount"
                );
                youTubeResult.favoriteCount = this.mergeProperties(
                  currentItem,
                  "favoriteCount"
                );
                youTubeResult.commentCount = this.mergeProperties(
                  currentItem,
                  "commentCount"
                );
                instagramResult.comments_count = this.mergeProperties(
                  currentItem,
                  "comments_count"
                );
                instagramResult.like_count = this.mergeProperties(
                  currentItem,
                  "like_count"
                );
                instagramResult.view_count = this.mergeProperties(
                  currentItem,
                  "view_count"
                );
              }

              console.log("facebookResult");
              console.log(facebookResult);
              console.log("youTubeResult");
              console.log(youTubeResult);
              console.log("instagramResult");
              console.log(instagramResult);
              const reach = this.getReachCount(
                facebookResult,
                youTubeResult,
                instagramResult,
                emailResult,
                smsResult,
                whatsappResult
              );
              console.log("hji");

              resolve({
                campaignDefinitionId,
                name: campaignName,
                startAt: startDate,
                endAt: endDate,
                totalAudience: totalAudience,
                status: status,
                connections: {
                  facebook: facebookResult,
                  youtube: youTubeResult,
                  instagram: instagramResult,
                  email: emailResult,
                  sms: smsResult,
                  whatsapp: whatsappResult,
                },
                reach,
                engagement: this.getEngagemnetInfo(
                  facebookResult,
                  youTubeResult,
                  instagramResult,
                  reach
                ),
              });
            });
          } else {
            resolve({
              campaignDefinitionId,
              name: campaignName,
              startAt: startDate,
              endAt: endDate,
              totalAudience: totalAudience,
              status: status,

              connections: {
                facebook: facebookResult,
                youtube: youTubeResult,
                instagram: instagramResult,
                email: emailResult,
                sms: smsResult,
                whatsapp: whatsappResult,
              },
              reach: 0,
              engagement: 0,
            });
          }
        });
    } catch (err) {
      next(new AppError(err.message, 200));
    }
  });
};

exports.getReachCount = (
  facebook,
  youtube,
  instagram,
  email,
  sms,
  whatsapp
) => {
  return (
    parseInt(facebook.viewCount) +
    parseInt(youtube.viewCount) +
    parseInt(instagram.view_count) +
    email["No of Email"] +
    sms["No of SMS"] +
    whatsapp["No of Message send"]
  );
};

exports.getEngagemnetInfo = (facebook, youtube, instagram, reach) => {
  let facebooEvents = facebook.like + facebook.comment + facebook.wow;
  let youtubeEvents =
    youtube.likeCount +
    youtube.dislikeCount +
    youtube.favoriteCount +
    youtube.commentCount;
  let instagramEvents = instagram.comments_count + instagram.like_count;
  let totalEvents = facebooEvents + youtubeEvents + instagramEvents;
  if (reach === 0) {
    return 0;
  }
  return ((totalEvents / reach) * 100).toFixed(2);
};

exports.getFacebookpostDetails = async (facebookData) => {
  return new Promise((resolve, reject) => {
    let selectedPage = `${facebookData.pageId}_${facebookData.postId}`;
    let token = facebookData.password;
    var config = {
      method: "get",
      url:
        "https://graph.facebook.com/v16.0/" +
        selectedPage +
        "/insights?metric=post_reactions_by_type_total&access_token=" +
        token,
    };

    axios(config)
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        console.log("done");
        resolve({ error: err.message });
      });
  });
};

exports.getFacebookPageInsights = (facebookData, orgId) => {
  return new Promise((resolve, reject) => {
    let selectedPage = `${facebookData.pageId}`;
    let token = facebookData.password;
    var config = {
      method: "get",
      url:
        "https://graph.facebook.com/" +
        selectedPage +
        "/insights?metric=page_views_total,post_reactions_like_total,post_reactions_love_total,post_reactions_wow_total,post_reactions_haha_total,post_reactions_sorry_total,post_reactions_anger_total,page_impressions_unique,page_engaged_users,page_positive_feedback_by_type,page_daily_follows_unique,page_fans&name=mention&access_token=" +
        token,
    };
    axios(config)
      .then((response) => {
        response.data.type = "facebook";
        response.data.orgId = orgId;
        resolve(response.data);
      })
      .catch((err) => {
        resolve({ error: err.message });
      });
  });
};

exports.getOrganizationIdForLinkendin = (password) => {
  return new Promise((resolve, reject) => {
    let token = password;
    var config = {
      method: "get",
      url:
        "https://api.linkedin.com/v2/organizationAcls?q=roleAssignee&oauth2_access_token=" +
        token,
    };

    axios(config).then((response) => {
      const organizationInfo = response.data.elements.filter(
        (item) => item.role === "ADMINISTRATOR"
      );
      resolve(organizationInfo);
    });
  });
};

exports.getLinkendinInsights = (facebookData, orgId) => {
  return new Promise((resolve, reject) => {
    let token = facebookData.password;
    this.getOrganizationIdForLinkendin(token).then((organizationInfo) => {
      const organizationId = organizationInfo[0].organization;
      var config = {
        method: "get",
        url:
          "https://api.linkedin.com/v2/organizationPageStatistics?q=organization&organization=" +
          organizationId +
          "&oauth2_access_token=" +
          token,
      };
      axios(config)
        .then((response) => {
          response.data.type = "linkedin";
          response.data.orgId = orgId;
          resolve(response);
        })
        .catch((err) => {
          resolve({ error: err.message });
        });
    });
  });
};

exports.getYoutubeInsights = (facebookData, orgId) => {
  return new Promise((resolve, reject) => {
    let selectedPage = `${facebookData.pageId}`;
    postController
      .getRefreshToken(facebookData.password)
      .then((refreshTokenInfo) => {
        var config = {
          method: "get",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${refreshTokenInfo.refreshResponse.access_token}`,
          },
          url:
            "https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=" +
            selectedPage,
        };
        axios(config)
          .then((response) => {
            response.data.type = "youtube";
            response.data.orgId = orgId;
            resolve(response);
          })
          .catch((err) => {
            resolve({ error: err.message });
          });
      });
  });
};

exports.getInstagramPageInsights = (instagramData, orgId) => {
  return new Promise((resolve, reject) => {
    let selectedPage = `${instagramData.pageId}`;
    let token = instagramData.password;
    var config = {
      method: "get",
      url:
        "https://graph.facebook.com/v16.0/" +
        selectedPage +
        "/insights?metric=impressions,reach,profile_views&period=day&access_token=" +
        token,
    };
    axios(config)
      .then((response) => {
        response.data.type = "instagram";
        response.data.orgId = orgId;
        resolve(response.data);
      })
      .catch((err) => {
        resolve({ error: err.message });
      });
  });
};

exports.getInstagramDetails = async (instagramData) => {
  console.log(instagramData.userName);
  return new Promise((resolve, reject) => {
    let selectedPage = `${instagramData.pageId}`;
    let token = instagramData.password;
    var config = {
      method: "get",
      url:
        "https://graph.facebook.com/v16.0/" +
        selectedPage +
        "?fields=business_discovery.username(" +
        instagramData.userName +
        "){followers_count,media_count,media{comments_count,like_count}}&access_token=" +
        token,
    };
    axios(config)
      .then((response) => {
        if (response.data.business_discovery.media.data.length) {
          let currentInstagramDetails =
            response.data.business_discovery.media.data.filter(
              (currentItem) => {
                return currentItem.id === instagramData.postId;
              }
            );

          // TODO removed
          if (currentInstagramDetails.length) {
            currentInstagramDetails[0].view_count =
              currentInstagramDetails[0].like_count;
          } else {
            resolve({
              view_count: 0,
              like_count: 0,
              comments_count: 0,
            });
          }
          resolve(currentInstagramDetails[0]);
        }
        resolve({
          view_count: 0,
          like_count: 0,
          comments_count: 0,
        });
      })
      .catch((err) => {
        console.log("done");
        resolve({ error: err.message });
      });
  });
};

exports.getyoutubePostDetails = (youtubeData) => {
  return new Promise((resolve) => {
    postController
      .getRefreshToken(youtubeData.password)
      .then((updatedToken) => {
        if (updatedToken.successs) {
          resolve(
            this.getVideoInfo(
              updatedToken.refreshResponse.access_token,
              youtubeData.postId
            )
          );
        } else {
          resolve({ success: false, message: updatedToken.refreshResponse });
        }
      });
  });
};

exports.getVideoInfo = async (accesstoken, postId) => {
  var youtubeDetails = await campaignDefinitionController.getVideoDetail(
    accesstoken,
    postId
  );
  return youtubeDetails.data.items.length
    ? youtubeDetails.data.items[0].statistics
    : {};
};

exports.mergeProperties = (array, key) => {
  let currentCount = 0;
  array.forEach((CurrentArray) => {
    if (CurrentArray[key]) {
      currentCount += parseInt(CurrentArray[key]);
    }
  });
  return currentCount;
};

exports.facebookmergeProperties = (array, key) => {
  console.log("array************");
  console.log(array);
  console.log(key);
  let currentCount = 0;
  array.forEach((CurrentArray) => {
    if (CurrentArray.value[key]) {
      currentCount += parseInt(CurrentArray.value[key]);
    }
  });
  return currentCount;
};

exports.getCampaginDefinitionData = async (campaignDefinitionId) => {
  try {
    const campaignDefinitionDetails = await db.campaignDefinition.findOne({
      where: { campaignDefinitionId },
      attributes: ["name", "startAt", "endAt", "totalAudience", "status"],
    });
    if (campaignDefinitionDetails) {
      return campaignDefinitionDetails;
    } else {
      return {};
    }
  } catch (err) {
    //console.log(err.message)
    return {};
  }
};

exports.saveAnalytics = async (analyticss) => {
  //console.log('analyticss')
  //console.log(analyticss)
  return new Promise((resolve) => {
    try {
      const analyticsInfo = {
        campaignDefinitionId: analyticss.campaignDefinitionId,
        name: analyticss.name,
        startAt: analyticss.startAt,
        endAt: analyticss.endAt,
        totalAudience: analyticss.totalAudience,
        status: analyticss.status,
        connections: JSON.stringify(analyticss.connections),
        reach: analyticss.reach,
        engagement: analyticss.engagement,
      };

      Analytics.create(analyticsInfo)
        .then((data) => {
          resolve({
            status: "success",
          });
        })
        .catch((err) => {
          //console.log(err)
        });
    } catch (err) {
      //console.log(err.messsage)
    }
  });
};

exports.saveSubscriptionAnalytics = async (analyticss) => {
  console.log(analyticss);
  return new Promise((resolve) => {
    try {
      const analyticsInfo = {
        orgId: analyticss.orgId,
        facebookSubscription: analyticss.facebook,
        instagramSubscription: analyticss.instagram,
        linkendinSubscription: analyticss.linkendin,
        youtubeSubscription: analyticss.youtube,
      };

      db.subscription
        .create(analyticsInfo)
        .then((data) => {
          resolve({
            status: "success",
          });
        })
        .catch((err) => {
          //console.log(err)
        });
    } catch (err) {
      //console.log(err.messsage)
    }
  });
};

exports.getInsightsFoOrganization = async (subscriptionInfo, currentOrgId) => {
  const facebookPost = this.getSocialMediaDataByTypeAndOrg(
    subscriptionInfo,
    currentOrgId,
    "facebook"
  );
  const InstaPost = this.getSocialMediaDataByTypeAndOrg(
    subscriptionInfo,
    currentOrgId,
    "instagarm"
  );
  const LinkedinPost = this.getSocialMediaDataByTypeAndOrg(
    subscriptionInfo,
    currentOrgId,
    "linkedin"
  );
  const YoutubePost = this.getSocialMediaDataByTypeAndOrg(
    subscriptionInfo,
    currentOrgId,
    "youtube"
  );

  return new Promise((resolve, reject) => {
    const promises = [];
    facebookPost.map((CurrentItem) => {
      promises.push(this.getFacebookPageInsights(CurrentItem, currentOrgId));
    });
    InstaPost.map((CurrentItem) => {
      promises.push(this.getInstagramPageInsights(CurrentItem, currentOrgId));
    });
    LinkedinPost.map((currentItem) => {
      promises.push(this.getLinkendinInsights(currentItem, currentOrgId));
    });
    YoutubePost.map((currentItem) => {
      promises.push(this.getYoutubeInsights(currentItem, currentOrgId));
    });
    Promise.all(promises).then((CurrentSights) => {
      resolve(CurrentSights);
    });
  });
};

exports.getSubscriptionDetails = () => {
  return new Promise((resolve, reject) => {
    db.socialMediaConnection
      .findAll({
        attributes: [
          "name",
          "socialMediaType",
          "socialMediaHandle",
          "password",
          "organizationOrgId",
        ],
        include: [
          {
            model: db.socialMediaPage,
            as: "socialMediaPage",
            attributes: ["url", "password"],
          },
        ],
      })
      .then((connections) => {
        let currentCurrentConnection = {};
        if (connections.length > 0) {
          connections.map((currentitem) => {
            if (currentCurrentConnection[currentitem.organizationOrgId]) {
              currentCurrentConnection[currentitem.organizationOrgId].push({
                name: currentitem.name,
                orgId: currentitem.organizationOrgId,
                pageId: currentitem.socialMediaPage.url,
                password: currentitem.socialMediaPage.password,
              });
            } else {
              currentCurrentConnection[currentitem.organizationOrgId] = [
                {
                  name: currentitem.name,
                  orgId: currentitem.organizationOrgId,
                  pageId: currentitem.socialMediaPage.url,
                  password: currentitem.socialMediaPage.password,
                },
              ];
            }
          });
        }
        resolve(currentCurrentConnection);
      });
  });
};

exports.getSubscriptionAnalytics = async (req, res, next) => {
  try {
    const { orgId } = req.body;

    const foundItem = await db.subscription.findOne({
      where: {
        orgId,
      },
      order: [["createdAt", "DESC"]],
    });
    if (foundItem) {
      const result = {
        facebook: this.formatFacebookSubscriptionDetails(
          "Facebook",
          JSON.parse(foundItem.facebookSubscription)
        ),
        instagram: this.formatFacebookSubscriptionDetails(
          "Instagram",
          JSON.parse(foundItem.instagramSubscription)
        ),
        youtube: this.formatKeySuscriptionDetails(
          "Youtube",
          JSON.parse(foundItem.youtubeSubscription)
        ),
        linkedin: this.formatKeySuscriptionDetails(
          "Linkedin",
          JSON.parse(foundItem.linkendinSubscription)
        ),
      };
      res.send({
        status: "success",
        data: result,
      });
    } else {
      res.send({
        status: "success",
        data: {
          facebook: {
            name: "Facebook",
            analytics: [
              {
                count: 0,
                title: "Daily Total Reach",
              },
              {
                count: 0,
                title: "Daily Page Engaged Users",
              },
              {
                count: {},
                title: "Daily Positive Feedback From Users",
              },
              {
                count: 0,
                title: "Daily New Follows",
              },
              {
                count: 0,
                title: "Lifetime Total Likes",
              },
            ],
          },
          instagram: {
            name: "Instagram",
            analytics: [
              {
                count: 0,
                title: "Impressions",
              },
              {
                count: 0,
                title: "Reach",
              },
              {
                count: 0,
                title: "Profile views",
              },
            ],
          },
          youtube: {
            name: "Youtube",
            analytics: [
              {
                count: "0",
                title: "viewCount",
              },
              {
                count: "0",
                title: "subscriberCount",
              },
              {
                count: false,
                title: "hiddenSubscriberCount",
              },
              {
                count: "0",
                title: "videoCount",
              },
            ],
          },
        },
      });
    }
  } catch (err) {
    next(new AppError(err.message, 200));
  }
};

exports.formatFacebookSubscriptionDetails = (type, facebookData) => {
  //console.log("facebookData")
  //console.log(facebookData)

  const results = {
    name: type,
    analytics: facebookData.map((currentItem) => {
      return {
        count: JSON.parse(currentItem.value)[
          JSON.parse(currentItem.value).length - 1
        ].value,
        title: currentItem.title,
      };
    }),
  };
  return results;
};

exports.extractYoutubeStatistics = (youtube) => {
  let results = [];
  if (youtube) {
    results = Object.keys(youtube.statistics).map((currentitem) => {
      return {
        count: youtube ? youtube.statistics[currentitem] : {},
        title: currentitem,
      };
    });
  }

  return results;
};

exports.formatKeySuscriptionDetails = (type, youtubeData) => {
  const results = {
    name: type,
    analytics: this.extractYoutubeStatistics(youtubeData[0]),
  };
  return results;
};

exports.getSocialMediaDataByTypeAndOrg = (
  socailMediaCredentailsInfo,
  org,
  type
) => {
  return socailMediaCredentailsInfo[org].filter(
    (item) => item.name.toLowerCase() === type
  );
};

exports.getInsightsDataByType = (insightInfo, type) => {
  return insightInfo.filter((item) => item.type === type);
};

exports.getInsights = async (socailMediaCredentailsInfo) => {
  const orgs = Object.keys(socailMediaCredentailsInfo);

  for (org of orgs) {
    const insightsInfo = await this.getInsightsFoOrganization(
      socailMediaCredentailsInfo,
      org
    );

    const facebook = this.getInsightsDataByType(insightsInfo, "facebook");
    const instagram = this.getInsightsDataByType(insightsInfo, "instagram");
    const linkendin = this.getInsightsDataByType(insightsInfo, "linkedin");
    const youtube = this.getInsightsDataByType(insightsInfo, "youtube");
    let facebookRecord = [],
      instagramRecord = [],
      youtubeRecord = [],
      linkendinRecord = [];

    if (
      facebook &&
      facebook.length > 0 &&
      facebook[0].data &&
      facebook[0].data.length > 0
    ) {
      facebookRecord = facebook[0].data
        .filter((item) => item.period === "day")
        .map((items) => {
          return {
            type: facebook[0].type,
            name: items.name,
            value: JSON.stringify(items.values),
            title: items.title,
            orgId: facebook[0].orgId,
          };
        });
    }
    if (
      instagram &&
      instagram.length > 0 &&
      instagram[0].data &&
      instagram[0].data.length > 0
    ) {
      instagramRecord = instagram[0].data
        .filter((item) => item.period === "day")
        .map((items) => {
          return {
            type: instagram[0].type,
            name: items.name,
            value: JSON.stringify(items.values),
            title: items.title,
            orgId: instagram[0].orgId,
          };
        });
    }
    if (youtube && youtube.length > 0 && youtube[0].data) {
      youtubeRecord.push({
        type: youtube[0].data.type,
        orgId: youtube[0].data.orgId,
        statistics: youtube[0].data.items[0].statistics,
      });
    }
    if (linkendin && linkendin.length > 0 && linkendin[0].data) {
      linkendinRecord.push({
        type: linkendin[0].data.type,
        orgId: linkendin[0].data.orgId,
        statistics:
          linkendin[0].data.elements[0].totalPageStatistics.views
            .insightsPageViews,
      });
    }
    const saveData = await analyticsController.saveSubscriptionAnalytics({
      orgId: org,
      facebook: JSON.stringify(facebookRecord),
      instagram: JSON.stringify(instagramRecord),
      linkendin: JSON.stringify(linkendinRecord),
      youtube: JSON.stringify(youtubeRecord),
    });
  }
  console.LOG("upadted the record in the subscripton table");
};

exports.getVideoDetail = (accesstoken, youtubeId) => {
  const getVideoData1 =
    "https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=" +
    youtubeId;

  var configdsata = {
    method: "get",
    url: getVideoData1,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${accesstoken}`,
    },
  };

  return axios(configdsata);
};

exports.getPlaylistVideoDetail = (accesstoken, youtubeId) => {
  const getVideoData =
    "https://youtube.googleapis.com/youtube/v3/channelSections?part=snippet%2CcontentDetails&channelId=" +
    youtubeId +
    "&key=AIzaSyCmPX-4KQ-wjqFqJCYGGRtuYwqjY8s_jt4";
  var configdsata = {
    method: "get",
    url: getVideoData,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${accesstoken}`,
    },
  };

  return axios(configdsata);
};

exports.getPopularVideo = (accesstoken, youtubeId) => {
  const getVideoData =
    "https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=US&key=AIzaSyCmPX-4KQ-wjqFqJCYGGRtuYwqjY8s_jt4";
  var configdsata = {
    method: "get",
    url: getVideoData,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${accesstoken}`,
    },
  };

  return axios(configdsata);
};

exports.formatPopularvideo = (popularvideo) => {
  // return popularvideo.items
  return popularvideo.items.map((video) => {
    return {
      title: video.snippet.title,
      id: video.id,
      thumbnail: video.snippet.thumbnails,
    };
  });
};

exports.getYoutubeAnalytics = (req, res, next) => {
  const { orgId } = req.body;

  try {
    campaignDefinitionController
      .getYoutubeAccessCredentials(orgId)
      .then((socialMediaData) => {
        postController
          .getRefreshToken(socialMediaData.socialMediaPage.password)
          .then((refreshTokenInfo) => {
            this.getVideoDetail(
              refreshTokenInfo.refreshResponse.access_token,
              socialMediaData.socialMediaPage.url
            ).then((result) => {
              this.getPlaylistVideoDetail(
                refreshTokenInfo.refreshResponse.access_token,
                socialMediaData.socialMediaPage.url
              ).then((resultPlaylist) => {
                this.getPopularVideo(
                  refreshTokenInfo.refreshResponse.access_token,
                  socialMediaData.socialMediaPage.url
                ).then((popularvideo) => {
                  const response = {
                    viewCount:
                      result.data.items[0].statistics.subscriberCount || "NA",
                    Subscribers:
                      result.data.items[0].statistics.viewCount || "NA",
                    hiddenSubscriberCount:
                      result.data.items[0].statistics.hiddenSubscriberCount ||
                      "NA",
                    "Video Published":
                      result.data.items[0].statistics.viewCount || "NA",
                    playlist: resultPlaylist.data.items.length || "NA",
                    popularvideo: this.formatPopularvideo(popularvideo.data),
                  };
                  res.send({ success: true, data: response });
                });
              });
            });
          });
      });
  } catch (err) {
    next(new AppError(err.message, 200));
  }
};

const getSocialPresenceData = (id, dayCount) => {
  return new Promise((resolve, reject) => {
    return db.socialPresence
      .findAll({
        where: {
          socalMediaConnectionId: id,
          createdAt: {
            [Op.gte]: moment().subtract(dayCount, "days").toDate(),
          },
        },
        attributes: [
          "socialName",
          "totalPosts",
          "totalFollowing",
          "totalFollowers",
          "socalMediaConnectionId",
          "createdAt",
        ],
      })
      .then((socialData) => {
        let fistVal = 0;
        let fistValIncStatus = 0; //1-up, 2-down
        let secondVal = 0;
        let secondValIncStatus = 0; //1-up, 2-down
        let thirdval = 0;
        let thirdvalIncStatus = 0; //1-up, 2-down
        for (let j in socialData) {
          if (socialData[j].totalPosts < fistVal) {
            fistValIncStatus = 2;
          }
          if (socialData[j].totalPosts > fistVal) {
            fistValIncStatus = 1;
          }
          if (socialData[j].totalFollowing < secondVal) {
            secondValIncStatus = 2;
          }
          if (socialData[j].totalFollowing > secondVal) {
            secondValIncStatus = 1;
          }
          if (socialData[j].totalFollowers < thirdval) {
            thirdvalIncStatus = 2;
          }
          if (socialData[j].totalFollowers > thirdval) {
            thirdvalIncStatus = 1;
          }
          fistVal = socialData[j].totalPosts;
          secondVal = socialData[j].totalFollowing;
          thirdval = socialData[j].totalFollowers;
        }
        resolve(socialData);
        //resolve({totalPosts:fistVal, fistValIncStatus: fistValIncStatus, totalFollowing: secondVal, secondValIncStatus: secondValIncStatus, totalFollowers: thirdval, thirdvalIncStatus: thirdvalIncStatus})
      })
      .catch((err) => {
        console.log("err", err);
      });
  });
};

exports.getSocialPresence = async (req, res, next) => {
  const { orgId } = req.body;
  const dayCount = "7";
  let results = "";
  try {
    const socialPlatforms = await db.socialMediaConnection.findAll({
      where: { organizationOrgId: orgId },
      attributes: [
        "name",
        "socialMediaType",
        "organizationOrgId",
        "status",
        "isConfigured",
      ],
      include: [
        {
          model: db.socialMediaPage,
          as: "socialMediaPage",
        },
      ],
    });
    var final_result = socialPlatforms;
    if (socialPlatforms.length > 0) {
      results = await Promise.all(
        socialPlatforms.map(function (query, index) {
          if (query.socialMediaPage) {
            return new Promise(function (resolve, reject) {
              db.socialPresence
                .findAll({
                  where: {
                    socalMediaConnectionId:
                      query?.socialMediaPage
                        ?.socialMediaConnectionSocalMediaConnectionId,
                    createdAt: {
                      [Op.gte]: moment().subtract(dayCount, "days").toDate(),
                    },
                  },
                  attributes: [
                    "socialName",
                    "totalPosts",
                    "totalFollowing",
                    "totalFollowers",
                    "socalMediaConnectionId",
                    "createdAt",
                  ],
                })
                .then((socialData) => {
                  resolve(socialData);
                })
                .catch((err) => {
                  console.log("err", err);
                  reject(err);
                });
            });
          }
        })
      );
    }
    res.json({
      status: "success",
      data: socialPlatforms,
      socialData: results,
    });
  } catch (err) {
    next(new AppError(err.message, 200));
  }
};

exports.fetchSocialPresence = async (req, res, next) => {
  try {
    const user = await db.socialMediaConnection.findAll({
      where: { status: "Active", socialMediaType: "ORGANIC" },
      attributes: [
        "name",
        "socialMediaType",
        "organizationOrgId",
        "status",
        "isConfigured",
      ],
      include: [
        {
          model: db.socialMediaPage,
          as: "socialMediaPage",
        },
      ],
    });
    if (user.length > 0) {
      for (let i in user) {
        if (user[i].name == "Instagram") {
          let config = {
            method: "get",
            maxBodyLength: Infinity,
            url: `https://graph.facebook.com/v16.0/${user[i].socialMediaPage.url}?fields=business_discovery.username(tseries.official){follows_count,followers_count,media_count}&access_token=${user[i].socialMediaPage.password}`,
            headers: {},
          };

          axios
            .request(config)
            .then(async (response) => {
              if (response.data) {
                const addSocialPresenceData = {
                  socialName: user[i].name,
                  totalPosts: response.data.business_discovery.media_count,
                  totalFollowing:
                    response.data.business_discovery.follows_count,
                  totalFollowers:
                    response.data.business_discovery.followers_count,
                  organizationOrgId: user[i].organizationOrgId,
                  socalMediaConnectionId:
                    user[i].socialMediaPage
                      .socialMediaConnectionSocalMediaConnectionId,
                };

                await socialPresence.create(addSocialPresenceData);
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else if (user[i].name == "Facebook") {
          let config = {
            method: "get",
            maxBodyLength: Infinity,
            url: `https://graph.facebook.com/v16.0/${user[i].socialMediaPage.url}?access_token=${user[i].socialMediaPage.password}&fields=fan_count,name,followers_count,new_like_count,published_posts`,
            headers: {},
          };

          axios
            .request(config)
            .then(async (response) => {
              if (response.data) {
                const addSocialPresenceData = {
                  socialName: user[i].name,
                  totalPosts: response.data.published_posts.data.length,
                  totalFollowing: response.data.fan_count,
                  totalFollowers: response.data.followers_count,
                  organizationOrgId: user[i].organizationOrgId,
                  socalMediaConnectionId:
                    user[i].socialMediaPage
                      .socialMediaConnectionSocalMediaConnectionId,
                };

                await socialPresence.create(addSocialPresenceData);
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else if (user[i].name == "Youtube") {
          let config = {
            method: "get",
            maxBodyLength: Infinity,
            url: `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${user[i].socialMediaPage.url}&key=AIzaSyCmPX-4KQ-wjqFqJCYGGRtuYwqjY8s_jt4`,
            headers: {},
          };

          axios
            .request(config)
            .then(async (response) => {
              if (response.data) {
                const addSocialPresenceData = {
                  socialName: user[i].name,
                  totalPosts: response.data.items[0].statistics.videoCount,
                  totalFollowing: response.data.items[0].statistics.viewCount,
                  totalFollowers:
                    response.data.items[0].statistics.subscriberCount,
                  organizationOrgId: user[i].organizationOrgId,
                  socalMediaConnectionId:
                    user[i].socialMediaPage
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
    res.send({
      status: "success",
    });
  } catch (err) {
    next(new AppError(err.message, 200));
  }
};

exports.setYoutubeAnalytics = async (req, res, next) => {
  try {
    const {
      channelId,
      views,
      whatch_time,
      videos_published,
      total_likes,
      playlists,
      audience_retention,
      recent_videos,
      audience_by_countries,
      audience_by_demographics,
      traffic_source,
      external_source,
      audience,
      campaignDefinitionCampaignDefinitionId,
      addedBy,
    } = req.body;
    const youtubeAnalyticsData = {
      channelId,
      views,
      whatch_time,
      videos_published,
      total_likes,
      playlists,
      audience_retention,
      recent_videos,
      audience_by_countries,
      audience_by_demographics,
      traffic_source,
      external_source,
      audience,
      campaignDefinitionCampaignDefinitionId,
      addedBy,
    };

    const addData = await youtubeAnalytics.create(youtubeAnalyticsData);
    res.send({
      status: "success",
      msg: addData,
    });
  } catch (err) {
    next(new AppError(err.message, 200));
  }
};

exports.fetchYoutubeAnalytics = async (req, res, next) => {
  try {
    const { channelId } = req.body;
    console.log(channelId);
    let fetchAnalytics;
    if (channelId) {
      fetchAnalytics = await db.youtubeAnalytics.findAll({
        where: {
          channelId,
        },
        order: [["createdAt", "DESC"]],
      });
    } else {
      fetchAnalytics = await db.youtubeAnalytics.findAll({
        order: [["createdAt", "DESC"]],
      });
    }

    res.send({
      status: "success",
      data: fetchAnalytics,
    });
  } catch (err) {
    next(new AppError(err.message, 200));
  }
};

exports.getConnections = (connectionType) => {
  return new Promise((resolve, reject) => {
    db.socialMediaConnection
      .findAll({
        where: { name: connectionType, status: "Active" },
        attributes: [
          "name",
          "socialMediaType",
          "socialMediaHandle",
          "password",
          "organizationOrgId",
        ],
        include: [
          {
            model: db.socialMediaPage,
            as: "socialMediaPage",
            attributes: ["url", "password"],
          },
        ],
      })
      .then((connections) => {
        resolve(connections);
      });
  });
};

exports.getReviews = async (socailMediaCredentailsInfo) => {
  for (const connection of socailMediaCredentailsInfo) {
    try {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `https://maps.googleapis.com/maps/api/place/details/json?key=${
          connection.dataValues.password
        }&placeid=${connection.dataValues.socialMediaHandle.split(":")[1]}`,
        headers: {},
      };

      const response = await axios.request(config);
      if (response.status == 200) {
        for (const resp of response.data.result.reviews) {
          const getSocialInboxData = await SocialInbox.findOne({
            where: {
              channelId: connection.dataValues.socialMediaHandle.split(":")[1],
              orgId: connection.dataValues.organizationOrgId,
              postID: resp.time,
              sentTo: `${resp.author_name}:${resp.author_url}`,
            },
          });
          if (getSocialInboxData == null) {
            const socialInboxData = {
              channelName: "Google Reviews",
              channelId: connection.dataValues.socialMediaHandle.split(":")[1],
              postID: resp.time,
              messageType: "INCOMING",
              message: resp.text,
              isRead: 0,
              sentTo: `${resp.author_name}:${resp.author_url}`,
              orgId: connection.dataValues.organizationOrgId,
              createdAt: moment.unix(resp.time).format("YYYY-MM-DD HH:mm:ss"),
            };
            await SocialInbox.create(socialInboxData);
          }
        }
      }
    } catch (error) {
      console.error(
        `Error fetching data for ID ${connection.dataValues.name}:`,
        error
      );
    }
  }
};

exports.getCommentsForSocialInbox = async (
  socailMediaCredentailsInfo,
  socialMediaName,
  duration = "Yesterday"
) => {
  var filterDateType = moment().subtract(1, "day");
  if (duration == "Today") {
    filterDateType = moment();
  } else {
    filterDateType = moment().subtract(1, "day");
  }

  // console.log('socailMediaCredentailsInfo', socailMediaCredentailsInfo);
  // console.log('socialMediaPage', socailMediaCredentailsInfo[0].socialMediaPage);

  if (socialMediaName == "Facebook") {
    for (const connection of socailMediaCredentailsInfo) {
      const postsResponse = await axios.get(
        `https://graph.facebook.com/v16.0/${connection.socialMediaPage.url}?fields=fan_count,followers_count,posts{likes.summary(true),comments.summary(true)}%20&access_token=${connection.socialMediaPage.password}&limit=20`
      );

      const posts = postsResponse.data.posts;
      // postsResponse.data.followers_count,   postsResponse.data.fan_count
      if (!posts || posts.data.length === 0) {
        console.log("No posts found.");
      }
      for (const post of posts.data) {
        // post.likes.summary
        // post.comments.summary

        //try {
        // const commentsResponse = await axios.get(`https://graph.facebook.com/v16.0/${post.id}/comments?access_token=${connection.socialMediaPage.password}&limit=20`);
        // const comments = commentsResponse.data.data;

        db.campaignContentPost
          .findOne({
            where: {
              postId: post.id.split("_")[1],
            },
            attributes: ["postId"],
            include: [
              {
                model: db.campaignContent,
                required: true,
                as: "campaignContent",
                attributes: ["campaignContentId"],
                include: [
                  {
                    model: db.campaignSelectionChannel,
                    required: true,
                    as: "campaignSelectionChannel",
                    attributes: ["campaignDefinitionCampaignDefinitionId"],
                  },
                ],
              },
            ],
          })
          .then((foundItem) => {
            if (foundItem) {
              const getCampaignId =
                foundItem.dataValues.campaignContent.campaignSelectionChannel
                  .campaignDefinitionCampaignDefinitionId;
              var analyticsDataToStore = {};
              analyticsDataToStore.name = "Facebook";
              analyticsDataToStore.campaignId = getCampaignId;
              analyticsDataToStore.pageLikes = postsResponse.data.fan_count;
              analyticsDataToStore.pageFollows =
                postsResponse.data.followers_count;
              analyticsDataToStore.totalLikes = post.likes.summary.total_count;
              analyticsDataToStore.totalComments =
                post.comments.summary.total_count;
              analyticsDataToStore.totalVideos = 0;
              analyticsDataToStore.totalViews = 0;
              analyticsDataToStore.totalSubscribers = 0;
              analyticsDataToStore.instTotalLikes = 0;
              analyticsDataToStore.instTotalComments = 0;
              analyticsDataToStore.postIdsUsed = post.id.split("_")[1];
              analyticsController.addDataToSocialAnalytics(
                analyticsDataToStore
              );
            }
          });

        const comments = post.comments.data;

        if (!comments || comments.length === 0) {
          console.log("No comments found.");
        } else {
          const filteredComments = comments.filter((comment) => {
            return moment(comment.created_time).isSame(filterDateType, "day");
          });

          console.log("filteredComments,", filteredComments);

          for (const filterComment of filteredComments) {
            const getSocialInboxData = await SocialInbox.findOne({
              where: {
                channelId: connection.socialMediaPage.url,
                orgId: connection.organizationOrgId,
                postID: filterComment.id,
              },
            });
            // filterComment.likes.summary.total_count
            if (getSocialInboxData == null) {
              const socialInboxData = {
                channelName: "Facebook",
                channelId: connection.socialMediaPage.url,
                postID: filterComment.id,
                messageType: "INCOMING",
                message: filterComment.message,
                isRead: 0,
                sentTo: post.id,
                orgId: connection.organizationOrgId,
                createdAt: filterComment.created_time,
              };
              await SocialInbox.create(socialInboxData);
            }
          }
        }
        // } catch (commentsError) {
        //     console.error(`Error fetching comments for post ${post.id}:`, commentsError.response ? commentsError.response.data : commentsError.message);
        // }
      }
    }
  } else if (socialMediaName == "Instagram") {
    for (const connection of socailMediaCredentailsInfo) {
      const postsResponse = await axios.get(
        `https://graph.facebook.com/v16.0/${connection.socialMediaPage.url}/media?fields=id,like_count,comments_count,media_type,reactions{username,type},comments{username,text,created_time}&access_token=${connection.socialMediaPage.password}&limit=5`
      );

      const posts = postsResponse.data.data;
      if (!posts || posts.length === 0) {
        console.log("No posts found.");
      }

      for (const post of posts) {
        // try {
        // const commentsResponse = await axios.get(`https://graph.facebook.com/v16.0/${post.id}/comments?fields=id,text,like_count,timestamp&access_token=${connection.socialMediaPage.password}&limit=20`);

        // const comments = commentsResponse.data.data;
        //post.like_count post.comments_count
        db.campaignContentPost
          .findOne({
            where: {
              postId: post.id,
            },
            attributes: ["postId"],
            include: [
              {
                model: db.campaignContent,
                required: true,
                as: "campaignContent",
                attributes: ["campaignContentId"],
                include: [
                  {
                    model: db.campaignSelectionChannel,
                    required: true,
                    as: "campaignSelectionChannel",
                    attributes: ["campaignDefinitionCampaignDefinitionId"],
                  },
                ],
              },
            ],
          })
          .then((foundItem) => {
            if (foundItem) {
              const getCampaignId =
                foundItem.dataValues.campaignContent.campaignSelectionChannel
                  .campaignDefinitionCampaignDefinitionId;
              var analyticsDataToStore = {};
              analyticsDataToStore.name = "Instagram";
              analyticsDataToStore.campaignId = getCampaignId;
              analyticsDataToStore.pageLikes = 0;
              analyticsDataToStore.pageFollows = 0;
              analyticsDataToStore.totalLikes = 0;
              analyticsDataToStore.totalComments = 0;
              analyticsDataToStore.totalVideos = 0;
              analyticsDataToStore.totalViews = 0;
              analyticsDataToStore.totalSubscribers = 0;
              analyticsDataToStore.instTotalLikes = post.like_count
                ? post.like_count
                : 0;
              analyticsDataToStore.instTotalComments = post.comments_count
                ? post.comments_count
                : 0;
              analyticsDataToStore.postIdsUsed = post.id;
              analyticsController.addDataToSocialAnalytics(
                analyticsDataToStore
              );
            }
          });

        const comments = post?.comments ? post.comments : [];
        if (!comments || comments.length === 0) {
          console.log("No comments found.");
        } else {
          const filteredComments = comments.data.filter((comment) => {
            return moment(comment.timestamp).isSame(filterDateType, "day");
          });

          for (const filterComment of filteredComments) {
            const getSocialInboxData = await SocialInbox.findOne({
              where: {
                channelId: connection.socialMediaPage.url,
                orgId: connection.organizationOrgId,
                postID: filterComment.id,
              },
            });
            // filterComment.like_count
            if (getSocialInboxData == null) {
              const socialInboxData = {
                channelName: "Instagram",
                channelId: connection.socialMediaPage.url,
                postID: filterComment.id,
                messageType: "INCOMING",
                message: filterComment.text,
                isRead: 0,
                sentTo: post.id,
                orgId: connection.organizationOrgId,
                createdAt: filterComment.timestamp,
              };
              await SocialInbox.create(socialInboxData);
            }
          }
        }

        // } catch (commentsError) {
        //     console.error(`Error fetching comments for post ${post.id}:`, commentsError.response ? commentsError.response.data : commentsError.message);
        // }
      }
    }
  } else if (socialMediaName == "LinkedIn") {
    for (const connection of socailMediaCredentailsInfo) {
      const organizationId = "avanthi-nulu-53679a210"; //connection.socialMediaPage.url;
      const organizationURN = "urn:li:organization:80078768"; // `urn:li:organization:${organizationId}`;
      const accessToken =
        "AQXBxeK_IL-ioas24tdxSFH4d2ZXjQ2QP3kGlwsEAhVvKX4XPduNPzmCWoJTccDpBsbWAFhHfivIG31FokZQ_duUAEp-S_WJh13e4HOs5nbWLiwx0Q9RE5b7h5sqkU18c9ic6NGY-CjGwpGpZfaFnfQ54dnEX-ykI97UeClWGxS4Yu7m1x3qi66w25uhjEuzGYYzGnjA0hIv41E5e4WmjpM7do3DaQ3s95yX7heYtN9-gJ9o6uMKPwPjemeqj-vCV3Tvx1rPLJit_dovvw9H9H2YHMh7ZqNoEZeI6YdXBt-CMKTrtudg-eefpgbeuoJvp7MA6ERImeacJzaPv5kCpgjssjmYAw";

      try {
        const postsResponse = await axios.get(
          "https://api.linkedin.com/v2/shares",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            params: {
              q: "owners",
              owners: organizationURN,
              count: 20,
            },
          }
        );

        if (postsResponse.data.elements) {
          for (const post of postsResponse.data.elements) {
            const postData = {
              postId: post.id,
              activityId: null,
              text: post.text.text || "No text",
              comments: [],
            };
            try {
              const activityResponse = await axios.get(
                `https://api.linkedin.com/v2/socialActions/urn:li:share:${post.id}`,
                {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                }
              );

              postData.activityId = activityResponse.data.target;

              // Fetch comments using the activity ID
              const commentsResponse = await axios.get(
                `https://api.linkedin.com/v2/socialActions/${postData.activityId}/comments`,
                {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                }
              );

              let comments = commentsResponse.data.elements || [];
              if (comments) {
                const filteredComments = comments.filter((comment) => {
                  return moment(comment.created.time).isSame(
                    filterDateType,
                    "day"
                  );
                });

                console.log("filteredComments", filteredComments);

                for (const filterComment of filteredComments) {
                  const getSocialInboxData = await SocialInbox.findOne({
                    where: {
                      channelId: "80078768", //connection.socialMediaPage.url,
                      orgId: connection.organizationOrgId,
                      postID: filterComment.id,
                    },
                  });

                  if (getSocialInboxData == null) {
                    const socialInboxData = {
                      channelName: "LinkedIn",
                      channelId: "80078768", //connection.socialMediaPage.url,
                      postID: filterComment.id,
                      messageType: "INCOMING",
                      message: filterComment.message.text,
                      isRead: 0,
                      sentTo: post.id,
                      orgId: connection.organizationOrgId,
                      createdAt: filterComment.created.time,
                    };
                    await SocialInbox.create(socialInboxData);
                  }
                }
              }
            } catch (commErr) {
              console.log("linkedin commErr", commErr);
            }
          }
        }
      } catch (err) {
        console.log("linkedin err", err);
      }
    }
  } else if (socialMediaName == "Youtube") {
    for (const connection of socailMediaCredentailsInfo) {
      console.log(
        "connection.socialMediaPage.url",
        connection.socialMediaPage.url
      );
      try {
        // get channel analytics
        const channelAnalytics = await axios.get(
          `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${
            connection.socialMediaPage.url
          }&key=${"AIzaSyCsczrOWyH7WbVc3l_VbzgpYoBrjJ9GHm0"}`
        );

        const playlists = await axios.get(
          `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${
            connection.socialMediaPage.url
          }&key=${"AIzaSyCsczrOWyH7WbVc3l_VbzgpYoBrjJ9GHm0"}`
        );

        // getting all playlist of a channel -> playlists
        if (playlists.data.items) {
          for (const playlist of playlists.data.items) {
            try {
              const getAllVideosOfPlaylist = await axios.get(
                `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${
                  playlist.contentDetails.relatedPlaylists.uploads
                }&key=${"AIzaSyCsczrOWyH7WbVc3l_VbzgpYoBrjJ9GHm0"}&maxResults=20`
              );

              if (getAllVideosOfPlaylist.data.items) {
                for (const videoItem of getAllVideosOfPlaylist.data.items) {
                  try {
                    const getVideoComments = await axios.get(
                      `https://www.googleapis.com/youtube/v3/commentThreads?textFormat=plainText&part=snippet&videoId=${
                        videoItem.snippet.resourceId.videoId
                      }&key=${"AIzaSyCsczrOWyH7WbVc3l_VbzgpYoBrjJ9GHm0"}&maxResults=20`
                    );

                    db.campaignContentPost
                      .findOne({
                        where: {
                          postId: videoItem.snippet.resourceId.videoId,
                        },
                        attributes: ["postId"],
                        include: [
                          {
                            model: db.campaignContent,
                            required: true,
                            as: "campaignContent",
                            attributes: ["campaignContentId"],
                            include: [
                              {
                                model: db.campaignSelectionChannel,
                                required: true,
                                as: "campaignSelectionChannel",
                                attributes: [
                                  "campaignDefinitionCampaignDefinitionId",
                                ],
                              },
                            ],
                          },
                        ],
                      })
                      .then((foundItem) => {
                        if (foundItem) {
                          if (channelAnalytics.data.items) {
                            const getCampaignId =
                              foundItem.dataValues.campaignContent
                                .campaignSelectionChannel
                                .campaignDefinitionCampaignDefinitionId;
                            var analyticsDataToStore = {};
                            analyticsDataToStore.name = "Youtube";
                            analyticsDataToStore.campaignId = getCampaignId;
                            analyticsDataToStore.pageLikes = 0;
                            analyticsDataToStore.pageFollows = 0;
                            analyticsDataToStore.totalLikes = 0;
                            analyticsDataToStore.totalComments =
                              getVideoComments.data.items.length;
                            analyticsDataToStore.totalVideos =
                              channelAnalytics.data.items[0].statistics.videoCount;
                            analyticsDataToStore.totalViews =
                              channelAnalytics.data.items[0].statistics.viewCount;
                            analyticsDataToStore.totalSubscribers =
                              channelAnalytics.data.items[0].statistics.subscriberCount;
                            analyticsDataToStore.postIdsUsed =
                              videoItem.snippet.resourceId.videoId;
                            analyticsDataToStore.instTotalLikes = 0;
                            analyticsDataToStore.instTotalComments = 0;
                            analyticsController.addDataToSocialAnalytics(
                              analyticsDataToStore
                            );
                          }
                        }
                      });

                    if (getVideoComments.data.items) {
                      // comment.snippet.topLevelComment.snippet.likeCount
                      const filteredComments =
                        getVideoComments.data.items.filter((comment) => {
                          return moment(
                            comment.snippet.topLevelComment.snippet.publishedAt
                          ).isSame(filterDateType, "day");
                        });
                      for (const cmmnt of filteredComments) {
                        console.log("cmmnt", cmmnt);
                        const getSocialInboxData = await SocialInbox.findOne({
                          where: {
                            orgId: connection.organizationOrgId,
                            postID: cmmnt.snippet.topLevelComment.id,
                          },
                        });

                        if (getSocialInboxData == null) {
                          const socialInboxData = {
                            channelName: "Youtube",
                            channelId: connection.socialMediaPage.url,
                            postID: cmmnt.snippet.topLevelComment.id,
                            messageType: "INCOMING",
                            message:
                              cmmnt.snippet.topLevelComment.snippet.textDisplay,
                            isRead: 0,
                            sentTo: cmmnt.snippet.videoId,
                            orgId: connection.organizationOrgId,
                            createdAt:
                              cmmnt.snippet.topLevelComment.snippet.publishedAt,
                          };
                          await SocialInbox.create(socialInboxData);
                        }
                      }
                    }
                  } catch (c_err) {
                    console.log("comment fetch error", c_err.response.data);
                  }
                }
              }
            } catch (v_err) {
              console.log("video fetch error", v_err.response.data);
            }
          }
        }
      } catch (err) {
        console.log("get playlists error", err.response.data);
      }
    }
  }
};

exports.manuallyRunCronForSocialMediaComments = async (req, res, next) => {
  const { connectionType, duration } = req.query;
  if (connectionType == "analytics") {
    analyticsController.addUpdateAnalyticsForCampaigns();
    res.send({
      status: "Analytics Started",
    });
    return;
  }
  analyticsController
    .getConnections(connectionType)
    .then((allFbConnectionData) => {
      return analyticsController.getCommentsForSocialInbox(
        allFbConnectionData,
        connectionType,
        duration
      );
    });
  res.send({
    status: "success",
  });
};

exports.runCronManually = async (req, res, next) => {
  const connectionType = "Facebook";
  const duration = "Today";
  analyticsController
    .getConnections(connectionType)
    .then((allFbConnectionData) => {
      return analyticsController.getCommentsForSocialInbox(
        allFbConnectionData,
        connectionType,
        duration
      );
    });
  res.send({
    status: "success",
    message: "Cron started.",
  });
};

exports.addUpdateAnalyticsForCampaigns = () => {
  try {
    db.socialAnalytics.findAll().then(async (socialAnalyticsData) => {
      var sortedAnalyticsData = [];
      socialAnalyticsData.forEach((anlt, index) => {
        var foundIndex = sortedAnalyticsData.findIndex(
          (x) => x.campaignDefinitionId == anlt.campaignId
        );
        if (foundIndex == -1) {
          sortedAnalyticsData.push({
            campaignDefinitionId: anlt.campaignId,
            name: "",
            startAt: "",
            endAt: "",
            totalAudience: 0,
            status: "",
            connections: "",
            reach: 0,
            engagement: 0,
            pageLikes: parseInt(anlt.pageLikes),
            pageFollows: parseInt(anlt.pageFollows),
            totalLikes: parseInt(anlt.totalLikes),
            totalComments: parseInt(anlt.totalComments),
            totalVideos: parseInt(anlt.totalVideos),
            totalViews: parseInt(anlt.totalViews),
            totalSubscribers: parseInt(anlt.totalSubscribers),
            instTotalLikes: parseInt(anlt.like_count),
            instTotalComments: parseInt(anlt.comments_count),
            whatsAppSent: 0,
          });
        } else {
          sortedAnalyticsData[foundIndex]["pageLikes"] += parseInt(
            anlt.pageLikes
          );
          sortedAnalyticsData[foundIndex]["pageFollows"] += parseInt(
            anlt.pageFollows
          );
          sortedAnalyticsData[foundIndex]["totalLikes"] += parseInt(
            anlt.totalLikes
          );
          sortedAnalyticsData[foundIndex]["totalComments"] += parseInt(
            anlt.totalComments
          );
          sortedAnalyticsData[foundIndex]["totalVideos"] += parseInt(
            anlt.totalVideos
          );
          sortedAnalyticsData[foundIndex]["totalViews"] += parseInt(
            anlt.totalViews
          );
          sortedAnalyticsData[foundIndex]["totalSubscribers"] += parseInt(
            anlt.totalSubscribers
          );
          sortedAnalyticsData[foundIndex]["instTotalLikes"] += parseInt(
            anlt.like_count
          );
          sortedAnalyticsData[foundIndex]["instTotalComments"] += parseInt(
            anlt.comments_count
          );
        }
      });

      for (let i = 0; i < sortedAnalyticsData.length; i++) {
        const getAllSent = WaBroadcastLog.count({
          where: {
            wa_campaign: sortedAnalyticsData[i].campaignDefinitionId,
            sent: 1,
          },
          attributes: ["sent"],
        });
        const campaginData = db.campaignDefinition.findOne({
          where: {
            campaignDefinitionId: sortedAnalyticsData[i].campaignDefinitionId,
            //,
            // status: 'LIVE'
          },
          attributes: ["name", "startAt", "endAt", "totalAudience", "status"],
        });

        await Promise.all([getAllSent, campaginData]).then((responses) => {
          if (responses[1]) {
            var foundItem = sortedAnalyticsData.find(
              (x) =>
                x.campaignDefinitionId ==
                sortedAnalyticsData[i].campaignDefinitionId
            );
            console.log("foundItem", foundItem);
            let youTubeResult = {
              viewCount: parseInt(foundItem.totalViews),
              likeCount: 0,
              dislikeCount: 0,
              favoriteCount: parseInt(foundItem.totalSubscribers),
              commentCount: parseInt(foundItem.totalComments),
            };
            let facebookResult = {
              viewCount: parseInt(foundItem.totalComments),
              like: parseInt(foundItem.totalLikes),
              wow: 0,
              comment: parseInt(foundItem.totalComments),
            };
            let instagramResult = {
              view_count: parseInt(foundItem.instTotalComments)
                ? parseInt(foundItem.instTotalComments)
                : 0,
              like_count: parseInt(foundItem.instTotalLikes)
                ? parseInt(foundItem.instTotalLikes)
                : 0,
              comments_count: parseInt(foundItem.instTotalComments)
                ? parseInt(foundItem.instTotalComments)
                : 0,
            };
            let emailResult = {
              "No of Email": 0,
            };
            let smsResult = {
              "No of SMS": 0,
            };
            let whatsappResult = {
              "No of Message send": responses[0],
            };
            var combineConnections = {
              facebook: facebookResult,
              youtube: youTubeResult,
              instagram: instagramResult,
              email: emailResult,
              sms: smsResult,
              whatsapp: whatsappResult,
            };
            db.analytics
              .findOne({
                where: {
                  campaignDefinitionId: foundItem.campaignDefinitionId,
                },
              })
              .then((res) => {
                if (res) {
                  db.analytics.update(
                    {
                      name: responses[1].name,
                      startAt: responses[1].startAt,
                      endAt: responses[1].endAt,
                      totalAudience: responses[1].totalAudience,
                      status: responses[1].status,
                      connections: JSON.stringify(combineConnections),
                      reach: 0,
                      engagement: 0,
                    },
                    {
                      where: {
                        campaignDefinitionId: foundItem.campaignDefinitionId,
                      },
                    }
                  );
                } else {
                  const analyticsInfo = {
                    campaignDefinitionId: foundItem.campaignDefinitionId,
                    name: responses[1].name,
                    startAt: responses[1].startAt,
                    endAt: responses[1].endAt,
                    totalAudience: responses[1].totalAudience,
                    status: responses[1].status,
                    connections: JSON.stringify(combineConnections),
                    reach: 0,
                    engagement: 0,
                  };
                  Promise.resolve(Analytics.create(analyticsInfo));
                }
              });
          }
        });
      }
    });
  } catch (err) {
    console.log("err", err);
  }
};

exports.addDataToSocialAnalytics = async (data) => {
  const foundItem = await db.socialAnalytics.findOne({
    where: {
      postIdsUsed: data.postIdsUsed,
    },
    order: [["createdAt", "DESC"]],
  });
  if (!foundItem) {
    const analyticsInfo = {
      campaignId: data.campaignId,
      name: data.name,
      pageLikes: data.pageLikes ? data.pageLikes : 0,
      pageFollows: data.pageFollows ? data.pageFollows : 0,
      totalLikes: data.totalLikes ? data.totalLikes : 0,
      totalComments: data.totalComments ? data.totalComments : 0,
      totalVideos: data.totalVideos ? data.totalVideos : 0,
      totalViews: data.totalViews ? data.totalViews : 0,
      totalSubscribers: data.totalSubscribers ? data.totalSubscribers : 0,
      instTotalLikes: data.instTotalLikes ? data.instTotalLikes : 0,
      instTotalComments: data.instTotalComments ? data.instTotalComments : 0,
      postIdsUsed: data.postIdsUsed,
    };
    SocialAnalytics.create(analyticsInfo);
  } else {
    await SocialAnalytics.update(
      {
        pageLikes: data.pageLikes ? data.pageLikes : 0,
        pageFollows: data.pageFollows ? data.pageFollows : 0,
        totalLikes: data.totalLikes ? data.totalLikes : 0,
        totalComments: data.totalComments ? data.totalComments : 0,
        totalVideos: data.totalVideos ? data.totalVideos : 0,
        totalViews: data.totalViews ? data.totalViews : 0,
        totalSubscribers: data.totalSubscribers ? data.totalSubscribers : 0,
        postIdsUsed: data.postIdsUsed,
        instTotalLikes: data.instTotalLikes ? data.instTotalLikes : 0,
        instTotalComments: data.instTotalComments ? data.instTotalComments : 0,
      },
      { where: { postIdsUsed: data.postIdsUsed } }
    );
  }
};

exports.analyticsReport = async (req, res, next) => {
  if (!req.body.orgId || !req.body.month || !req.body.year) {
    next(new AppError("No Record Found", 200));
  }

  const filterDate = moment().month(req.body.month).year(req.body.year);
  const startOfMonth = moment(filterDate).startOf("month").toDate();
  const endOfMonth = moment(filterDate).endOf("month").toDate();

  const getWhatsAppNo = await db.socialMediaConnection.findOne({
    where: {
      organizationOrgId: req.body.orgId,
      name: "WhatsApp",
    },
    attributes: ["socialMediaHandle"],
  });

  const orgWhatsAppNo =
    getWhatsAppNo !== null
      ? getWhatsAppNo?.socialMediaHandle.split(":")[1]
      : "";

  const activeChannels = db.socialMediaConnection.findAll({
    where: {
      organizationOrgId: req.body.orgId,
      status: "Active",
      createdAt: {
        [Op.between]: [startOfMonth, endOfMonth],
      },
    },
    attributes: [
      "name",
      "socialMediaType",
      "organizationOrgId",
      "status",
      "isConfigured",
    ],
    include: [
      {
        model: db.socialMediaPage,
        as: "socialMediaPage",
      },
    ],
  });

  const directMessagingEffectiveness = db.waBroadcastLog.findAll({
    where: {
      fromNumber: 331416323390162, //orgWhatsAppNo,
      // createdAt: {
      //   [Op.between]: [startOfMonth, endOfMonth],
      // },
    },
    attributes: [
      [db.Sequelize.fn("sum", db.Sequelize.col("sent")), "total_sent"],
      [
        db.Sequelize.fn("sum", db.Sequelize.col("delivered")),
        "total_delivered",
      ],
      [db.Sequelize.fn("sum", db.Sequelize.col("read")), "total_read"],
      [db.Sequelize.fn("sum", db.Sequelize.col("replied")), "total_replied"],
    ],
    group: ["fromNumber"],
  });

  const leadScoreSocialInbox = db.socialInbox.findAll({
    where: {
      orgId: req.body.orgId,
      createdAt: {
        [Op.between]: [startOfMonth, endOfMonth],
      },
    },
    attributes: [
      [
        db.Sequelize.fn("count", db.Sequelize.col("socialInboxID")),
        "total_response",
      ],
    ],
    group: ["orgId"],
  });

  const postsOnline = await campaignDefinition.findAll({
    where: {
      organizationOrgId: req.body.orgId,
      status: ["OPEN", "ACTIVE", "COMPLETED", "DONE"],
      createdAt: {
        [Op.between]: [startOfMonth, endOfMonth],
      },
    },
    attributes: ["campaignDefinitionId"],
    include: [
      {
        model: campaignViewer,
        as: "CampaignViewer",
        attributes: ["state"],
      },
      {
        model: campaignSelectionChannel,
        as: "campaignSelectionChannels",
        attributes: ["campaignSelectionId"],
        include: [
          {
            model: socialMediaConnection,
            as: "socialMediaConnection",
            attributes: ["name"],
          },
          {
            model: campaignContent,
            as: "campaignContents",
            attributes: ["descritption"],
            include: [
              {
                model: campaignContentPost,
                as: "campaignContentPosts",
                attributes: ["postAt"],
              },
            ],
          },
        ],
      },
    ],
  });

  Promise.all([
    activeChannels,
    directMessagingEffectiveness,
    leadScoreSocialInbox,
    postsOnline,
  ])
    .then(async (responses) => {
      // const dayCount = '30';
      // let results = '';
      // var final_result = responses[0];
      // if (responses[0].length > 0) {
      //   results = await Promise.all(
      //     responses[0].map(function (query, index) {
      //       if (query.socialMediaPage) {
      //         return new Promise(function (resolve, reject) {
      //           db.socialPresence
      //             .findAll({
      //               where: {
      //                 socalMediaConnectionId:
      //                   query?.socialMediaPage
      //                     ?.socialMediaConnectionSocalMediaConnectionId,
      //                 createdAt: {
      //                   [Op.gte]: moment().subtract(dayCount, 'days').toDate(),
      //                 },
      //               },
      //               attributes: [
      //                 'socialName',
      //                 'totalPosts',
      //                 'totalFollowing',
      //                 'totalFollowers',
      //                 'socalMediaConnectionId',
      //                 'createdAt',
      //               ],
      //             })
      //             .then((socialData) => {
      //               resolve(socialData);
      //             })
      //             .catch((err) => {
      //               console.log('err', err);
      //               reject(err);
      //             });
      //         });
      //       }
      //     })
      //   );
      // }
      // console.log('results', results);
      let socialMediaPosts = [];
      responses[3].map((posts) => {
        posts.campaignSelectionChannels.map((channel) => {
          if (channel.socialMediaConnection !== null) {
            const checkIfExists = socialMediaPosts.findIndex(
              (pst) => pst.name === channel.socialMediaConnection.name
            );
            if (checkIfExists == -1) {
              socialMediaPosts.push({
                name: channel.socialMediaConnection.name,
                posts: channel.campaignContents[0]?.campaignContentPosts.length,
              });
            } else {
              socialMediaPosts[checkIfExists].posts =
                socialMediaPosts[checkIfExists].posts +
                channel.campaignContents[0].campaignContentPosts?.length;
            }
          }
        });
      });

      res.send({
        status: "success",
        data: {
          reach: "53k",
          engagement: "48%",
          whatsAppSpend: 560,
          facebookSpend: 780,
          totalSubscribers: 111332,
          newSubscribers: 92398,
          subscriptionGrowthRate: "80%",
          campaignSpread: {
            social: 70,
            referral: 13,
            paid: 17,
          },
          channelContributionToTotalSubscribers: {
            channel1: 25,
            channel2: 9,
            channel3: 16,
            channel4: 20,
            channel5: 30,
          },
          topPerformingChannels: {
            channel1: "80k",
            channel2: "40k",
            channel3: "20k",
            channel4: "10k",
            channel5: "1k",
          },
          activeChannels: responses[0].map((connection) => connection.name),
          socialEngagements: {
            facebook: {
              isConnected: true,
              views: 98,
              likes: 12,
              comments: 12,
              wow: 10,
            },
            youtube: {
              isConnected: true,
              views: 98,
              likes: 12,
              comments: 12,
              favorites: 10,
              dislikes: 8,
            },
            instagram: {
              isConnected: true,
              views: 98,
              likes: 12,
              comments: 12,
            },
            email: {
              isConnected: true,
              noOfEmails: 76,
            },
            sms: {
              isConnected: true,
              noOfSms: 10,
            },
            whatsApp: {
              isConnected: true,
              noOfWhatsApp: 55,
            },
          },
          directMessagingEffectiveness: responses[1],
          leadScoreSocialInbox: {
            totalResponses: responses[2],
            qualifiedLeads: 0,
            repliedBack: 0,
            closed: 0,
          },
          postsOnline: socialMediaPosts,
          reachSocialIndexByChannel: {
            fbComments: 22,
            instaComment: 25,
            linkedinComments: 11,
            googleReviews: 10,
            whatsAppReplied: 25,
            youtubeComments: 9,
            xTweets: 20,
          },
          reviews: {
            overAll: 5,
            totalReviews: 432,
            topReviews: [
              {
                text: "Non risus viverra enim, quis. Eget vitae arcu vivamus sit tellus, viverra turpis lorem. Varius a turpis urna id porttitor.",
                name: "Hellen Jummy",
              },
              {
                text: "Non risus viverra enim, quis. Eget vitae arcu vivamus sit tellus, viverra turpis lorem. Varius a turpis urna id porttitor.",
                name: "Hellen Jummy",
              },
              {
                text: "Non risus viverra enim, quis. Eget vitae arcu vivamus sit tellus, viverra turpis lorem. Varius a turpis urna id porttitor.",
                name: "Hellen Jummy",
              },
              {
                text: "Non risus viverra enim, quis. Eget vitae arcu vivamus sit tellus, viverra turpis lorem. Varius a turpis urna id porttitor.",
                name: "Hellen Jummy",
              },
              {
                text: "Non risus viverra enim, quis. Eget vitae arcu vivamus sit tellus, viverra turpis lorem. Varius a turpis urna id porttitor.",
                name: "Hellen Jummy",
              },
            ],
          },
        },
      });
    })
    .catch((err) => {
      console.log("**********ERROR RESULT****************");
      console.log(err);
    });
  return false;
};

exports.dealerAnalyReport = async (req, res, next) => {
  if (!req.body.orgId || !req.body.month || !req.body.year) {
    next(new AppError("No Record Found", 200));
  }

  const filterDate = moment().month(req.body.month).year(req.body.year);
  const startOfMonth = moment(filterDate).startOf("month").toDate();
  const endOfMonth = moment(filterDate).endOf("month").toDate();

  const getWhatsAppNo = await db.socialMediaConnection.findOne({
    where: {
      organizationOrgId: req.body.orgId,
      name: "WhatsApp",
    },
    attributes: ["socialMediaHandle"],
  });

  const orgWhatsAppNo =
    getWhatsAppNo !== null
      ? getWhatsAppNo?.socialMediaHandle.split(":")[1]
      : "";

  const activeChannels = db.socialMediaConnection.findAll({
    where: {
      organizationOrgId: req.body.orgId,
      status: "Active",
      createdAt: {
        [Op.between]: [startOfMonth, endOfMonth],
      },
    },
    attributes: [
      "name",
      "socialMediaType",
      "organizationOrgId",
      "status",
      "isConfigured",
    ],
    include: [
      {
        model: db.socialMediaPage,
        as: "socialMediaPage",
      },
    ],
  });

  const directMessagingEffectiveness = db.waBroadcastLog.findAll({
    where: {
      fromNumber: 331416323390162, //orgWhatsAppNo,
      // createdAt: {
      //   [Op.between]: [startOfMonth, endOfMonth],
      // },
    },
    attributes: [
      [db.Sequelize.fn("sum", db.Sequelize.col("sent")), "total_sent"],
      [
        db.Sequelize.fn("sum", db.Sequelize.col("delivered")),
        "total_delivered",
      ],
      [db.Sequelize.fn("sum", db.Sequelize.col("read")), "total_read"],
      [db.Sequelize.fn("sum", db.Sequelize.col("replied")), "total_replied"],
    ],
    group: ["fromNumber"],
  });

  const leadScoreSocialInbox = db.socialInbox.findAll({
    where: {
      orgId: req.body.orgId,
      createdAt: {
        [Op.between]: [startOfMonth, endOfMonth],
      },
    },
    attributes: [
      [
        db.Sequelize.fn("count", db.Sequelize.col("socialInboxID")),
        "total_response",
      ],
    ],
    group: ["orgId"],
  });

  const postsOnline = await campaignDefinition.findAll({
    where: {
      organizationOrgId: req.body.orgId,
      status: ["OPEN", "ACTIVE", "COMPLETED", "DONE"],
      createdAt: {
        [Op.between]: [startOfMonth, endOfMonth],
      },
    },
    attributes: ["campaignDefinitionId"],
    include: [
      {
        model: campaignViewer,
        as: "CampaignViewer",
        attributes: ["state"],
      },
      {
        model: campaignSelectionChannel,
        as: "campaignSelectionChannels",
        attributes: ["campaignSelectionId"],
        include: [
          {
            model: socialMediaConnection,
            as: "socialMediaConnection",
            attributes: ["name"],
          },
          {
            model: campaignContent,
            as: "campaignContents",
            attributes: ["descritption"],
            include: [
              {
                model: campaignContentPost,
                as: "campaignContentPosts",
                attributes: ["postAt"],
              },
            ],
          },
        ],
      },
    ],
  });

  Promise.all([
    activeChannels,
    directMessagingEffectiveness,
    leadScoreSocialInbox,
    postsOnline,
  ])
    .then(async (responses) => {
      let socialMediaPosts = [];
      responses[3].map((posts) => {
        posts.campaignSelectionChannels.map((channel) => {
          if (channel.socialMediaConnection !== null) {
            const checkIfExists = socialMediaPosts.findIndex(
              (pst) => pst.name === channel.socialMediaConnection.name
            );
            if (checkIfExists == -1) {
              socialMediaPosts.push({
                name: channel.socialMediaConnection.name,
                posts: channel.campaignContents[0]?.campaignContentPosts.length,
              });
            } else {
              socialMediaPosts[checkIfExists].posts =
                socialMediaPosts[checkIfExists].posts +
                channel.campaignContents[0].campaignContentPosts?.length;
            }
          }
        });
      });

      res.send({
        status: "success",
        data: {
          TotalCampaigns: 1000,
          CampaignsActiveDealer: 14,
          ReachCampaign: 61400,
          TotalPosts: 1000,
          TotalSubscribers: 10000,
          Newsubscribers: 1000,
          TotalReach: 61400,
          TotalEngagement: 40000,
          EngagementRate: "50%",
          ConversionRate: "13%",
          spendAnalysis: {
            WhatsappSpends: 560,
            FacebookSpends: 780,
          },
          subscriptionGrowthRate: {
            labels: ["Jan", "Feb", "Mar", "Apr"],
            data: [5, 10, 15, 18],
          },
          ActiveChannels: {
            facebook: 84,
            WhatsApp: 54,
            Instagram: 84,
          },
          InActiveChannels: {
            facebook: 48,
            WhatsApp: 34,
            Instagram: 93,
          },
          TotalDealers: {
            active: 74,
            inactive: 26,
          },
          SpendAnalysis: {
            whatsappspend: 40,
            facebookspend: 60,
          },
          ChannelPerformance: {
            labels: ["FacebookAds", "WhatsApp", "Instagram", "email", "SEO"],
            data: [91, 75, 50, 78, 13],
          },
          SentimentAnalysis: {
            PositiveReview: 40,
            NegativeReview: 25,
            NeutralReview: 35,
            comments: 12,
            favorites: 10,
            dislikes: 8,
          },
          dealers: [
            {
              dealer: "Dealer A",
              status: "Active",
              location: "Hyderabad",
              total_views: 10000,
              total_spends: 760,
              active_campaigns: 10,
              new_subscribers: 1000,
              engagement_rate: "50%",
            },
            {
              dealer: "Dealer B",
              status: "Active",
              location: "Hyderabad",
              total_views: 10000,
              total_spends: 760,
              active_campaigns: 10,
              new_subscribers: 1000,
              engagement_rate: "50%",
            },
            {
              dealer: "Dealer C",
              status: "Active",
              location: "Hyderabad",
              total_views: 10000,
              total_spends: 760,
              active_campaigns: 10,
              new_subscribers: 1000,
              engagement_rate: "50%",
            },
            {
              dealer: "Dealer D",
              status: "Active",
              location: "Hyderabad",
              total_views: 10000,
              total_spends: 760,
              active_campaigns: 10,
              new_subscribers: 1000,
              engagement_rate: "50%",
            },
            {
              dealer: "Dealer E",
              status: "Active",
              location: "Hyderabad",
              total_views: 10000,
              total_spends: 760,
              active_campaigns: 10,
              new_subscribers: 1000,
              engagement_rate: "50%",
            },
          ],
        },
      });
    })
    .catch((err) => {
      console.log("**********ERROR RESULT****************");
      console.log(err);
    });
  return false;
};
