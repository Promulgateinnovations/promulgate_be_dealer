const XLSX = require('xlsx');
const express = require('express');
const excel = require('exceljs');
const db = require('../models');
const AppError = require('../utils/appError');
const LeadContact = db.leadContact;
const Lead = db.lead;
const User = db.user;
const CampaignContent = db.campaignContent;
const WhatsappBroadcastContnent = db.whatsappBroadcastContnent;
const WhatsappContentPost = db.whatsappContentPost;
const campaignDefinition = db.campaignDefinition;
const WhatsappTemplates = db.whatsappTemplates;
const TempWpToken = db.tempWpToken;
const WaBroadcastLog = db.waBroadcastLog;
const axios = require('axios');
const postController = require('./postController');
const Business = db.business;
const SocialInbox = db.socialInbox;
const Asset = db.asset;
const moment = require('moment');
const Op = db.Sequelize.Op;

exports.broadcastMessage = async (
  number,
  lead_id,
  template_id,
  whatsappContentPostID,
  whatsappBroadcastContnentID,
  accessToken,
  wa_template_lang,
  file_url,
  org_Id,
  wa_campaign,
  whats_app_number
) => {
  //const templateDetails = await WhatsappTemplates.findOne({where:{wp_template_name: template_id}});
  const getCampaignName = await db.campaignDefinition.findOne({
    where: {
      campaignDefinitionId: wa_campaign,
    },
    attributes: ['name'],
  });

  let newNumber = number;
  if (number.toString().length == 10) {
    newNumber = '91' + number;
  }

  let templateData = {
    messaging_product: 'whatsapp',
    to: newNumber,
    type: 'template',
    template: {
      name: template_id,
      language: {
        code: wa_template_lang,
      },
    },
  };

  // if(file_url != "" && file_url != null) {
  //   templateData.template.components = [
  //     {
  //       "type": "header",
  //       "parameters": [
  //         {
  //           "type": "image",
  //           "image": {
  //             "link": file_url
  //           }
  //         }
  //       ]
  //     }
  //   ]
  // }

  if (file_url != null && file_url != '') {
    var mySubString = file_url.substring(
      file_url.indexOf('d/') + 2,
      file_url.lastIndexOf('/view')
    );
    var urlForTemplateImg = file_url;
    if (file_url.includes('drive.google.com')) {
      urlForTemplateImg =
        'https://drive.google.com/uc?export=view&id=' + mySubString;
    } else {
      urlForTemplateImg = file_url;
    }

    templateData.template.components = [
      {
        type: 'header',
        parameters: [
          {
            type: 'image',
            image: {
              link: urlForTemplateImg,
            },
          },
        ],
      },
    ];
  }
  let data = JSON.stringify(templateData);

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `https://graph.facebook.com/v18.0/${
      whats_app_number
    }/messages`,
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json',
    },
    data: data,
  };

  axios
    .request(config)
    .then(async (response) => {
      console.log('response', response);
      if (response.data && response.data.messages && response.data.messages[0].id) {
        console.log('whatsapp response ....', response.data.messages);
        let pId = response.data.messages[0].id;

        const logData = {
          wp_template_name: template_id,
          phone_number: number,
          postID: pId,
          status: 'SUCCESS',
          whatsappBroadcastContnentWhatsappBroadcastContnentID:
            whatsappBroadcastContnentID,
          sent: 1,
          fromNumber:
          whats_app_number,
          leadId: lead_id,
          wa_campaign,
          wa_campaign_name: getCampaignName.dataValues.name,
        };
        await WaBroadcastLog.create(logData);

        const socialInboxData = {
          channelName: 'WhatsApp',
          channelId:
          whats_app_number,
          postID: pId,
          messageType: 'OUTGOING',
          message: 'Template used: ' + template_id,
          isRead: 0,
          sentTo: newNumber,
          orgId: org_Id,
        };
        await SocialInbox.create(socialInboxData);
        
        await WhatsappContentPost.update(
          {
            postId: pId,
            postStatus: 'SUCCESS',
          },
          { where: { whatsappContentPostID } }
        );
        await WhatsappBroadcastContnent.update(
          {
            status: 'LIVE',
          },
          { where: { whatsappBroadcastContnentID } }
        );
        await Lead.update({ status: 1 }, { where: { id: lead_id } });
        await LeadContact.update(
          { status: 1 },
          { where: { phone_number: number } }
        );

        
      } else {
        console.log('else wala response', response);
        const logData = {
          wp_template_name: template_id,
          phone_number: number,
          postID: null,
          status: 'FAILED',
          whatsappBroadcastContnentWhatsappBroadcastContnentID:
            whatsappBroadcastContnentID,
          sent: 9,
          fromNumber:
          whats_app_number,
          leadId: lead_id,
          wa_campaign,
          wa_campaign_name: getCampaignName.dataValues.name,
          error_log: JSON.stringify(response)
        };
        await WaBroadcastLog.create(logData);
      }
    })
    .catch(async (c_err) => {
      console.log('catch error', c_err);
      const logData = {
        wp_template_name: template_id,
        phone_number: number,
        postID: null,
        status: 'FAILED',
        whatsappBroadcastContnentWhatsappBroadcastContnentID:
          whatsappBroadcastContnentID,
        sent: 0,
        fromNumber:
        whats_app_number,
        leadId: lead_id,
        wa_campaign,
        wa_campaign_name: getCampaignName.dataValues.name,
        error_log: JSON.stringify(c_err)
      };
      await WaBroadcastLog.create(logData);

      await WhatsappContentPost.update(
        {
          postStatus: 'FAILED',
        },
        { where: { whatsappContentPostID } }
      );

      await WhatsappBroadcastContnent.update(
        {
          status: 'PARTIAL SUCCESS',
        },
        { where: { whatsappBroadcastContnentID } }
      );
    });
};

exports.getLeadContacts = async (req, res, next) => {
  try {
    const lead_contacts = await LeadContact.findAll({
      where: {
        lead_id: req.body.lead_id,
      },
      attributes: [
        'first_name',
        'last_name',
        'phone_number',
        'email',
        'status',
        'is_duplicate',
      ],
      order: [['first_name', 'DESC']],
    });
    res.send({
      status: 'success',
      data: lead_contacts,
    });
  } catch (err) {
    next(new AppError(err.message, 200));
  }
};

exports.getLeadLogs = async (req, res, next) => {
  //
  try {
    const lead_contacts = await WaBroadcastLog.findAll({
      where: {
        whatsappBroadcastContnentWhatsappBroadcastContnentID:
          req.body.broadcast_id,
      },
      attributes: [
        'phone_number',
        'postID',
        'status',
        'sent',
        'delivered',
        'read',
        'received',
        'createdAt',
      ],
      order: [['phone_number', 'DESC']],
    });
    res.send({
      status: 'success',
      data: lead_contacts,
    });
  } catch (err) {
    next(new AppError(err.message, 200));
  }
};

exports.getLeadDetails = async (req, res, next) => {
  const { org_id } = req.body;
  try {
    const leads = await Lead.findAll({
      attributes: [
        'source',
        'id',
        'total_records',
        'duplicates',
        'response',
        'file_name',
        'status',
        'createdAt',
        'orgId',
      ],
      where: {
        orgId: org_id,
      },
      order: [['createdAt', 'DESC']],
    });
    res.send({
      status: 'success',
      data: leads,
    });
  } catch (err) {
    next(new AppError(err.message, 200));
  }
};

exports.getBroadcastedLeads = async (req, res, next) => {
  const { org_id } = req.body;

  try {
    const leads = await WhatsappBroadcastContnent.findAll({
      attributes: [
        'whatsappBroadcastContnentID',
        'wp_template',
        'status',
        'selected_leads',
        'createdAt',
        'updatedAt',
        'wa_campaign',
        'orgId',
      ],
      where: {
        wa_campaign: {
          [Op.ne]: null,
        },
        orgId: org_id,
      },
      order: [['createdAt', 'DESC']],
    });

    for (const lead of leads) {
      const leadCampaign = await campaignDefinition.findOne({
        where: {
          campaignDefinitionId: lead.dataValues.wa_campaign,
        },
        attributes: ['name'],
      });
      lead.dataValues.campName = leadCampaign.dataValues.name;

      const getAllSent = await WaBroadcastLog.findAll({
        where: {
          sent: 1,
          whatsappBroadcastContnentWhatsappBroadcastContnentID:
            lead.dataValues.whatsappBroadcastContnentID,
        },
        attributes: [
          'sent',
          'wa_campaign',
          'whatsappBroadcastContnentWhatsappBroadcastContnentID',
        ],
      });
      const getAllBroadcasts = await WaBroadcastLog.findAll({
        where: {
          whatsappBroadcastContnentWhatsappBroadcastContnentID:
            lead.dataValues.whatsappBroadcastContnentID,
        },
        attributes: [
          'wa_campaign',
          'whatsappBroadcastContnentWhatsappBroadcastContnentID',
        ],
      });
      lead.dataValues.campName = leadCampaign.dataValues.name;
      lead.dataValues.totalSent = getAllSent.length;
      lead.dataValues.allBroadcasted = getAllBroadcasts.length;
    }

    res.send({
      status: 'success',
      data: leads,
    });
  } catch (err) {
    next(new AppError(err.message, 200));
  }
};

exports.saveLeadsDetails = async (req, res, next) => {
  var path = require('path');
  var workbook = new excel.Workbook();
  var workbook = XLSX.readFile(
    require('path').resolve(__dirname, '..') + '/uploads/' + req.body.file_name
  );
  var sheet_name_list = workbook.SheetNames;
  var workbook_response = XLSX.utils.sheet_to_json(
    workbook.Sheets[sheet_name_list[0]]
  );

  const leadData = {
    source: req.body.source,
    description: req.body.lead_desc,
    total_records: workbook_response.length,
    file_name: req.body.file_name,
    orgId: req.body.org_id,
  };

  Lead.create(leadData)
    .then((res) => {
      let duplicates = 0;
      workbook_response.forEach(async (row) => {
        row.lead_id = res.dataValues.id;

        await LeadContact.findOne({
          where: {
            phone_number: row['Phone'],
            orgId: leadData.orgId
          },
        })
          .then(async (res) => {
            if (res == null) {
              row.phone_number = row['Phone'];
              const leadContactToSave = {
                lead_id: row.lead_id,
                first_name: row['First Name'],
                last_name: row['Last Name'],
                phone_number: row['Phone'],
                email: row['Email'],
                orgId: leadData.orgId,
                status: 0,
                is_duplicate: 0,
              };

              await LeadContact.create(leadContactToSave);
            } else {
              row.phone_number = row['Phone'];
              const leadContactToSave = {
                lead_id: row.lead_id,
                first_name: row['First Name'],
                last_name: row['Last Name'],
                phone_number: row['Phone'],
                email: row['Email'],
                orgId: leadData.orgId,
                status: 0,
                is_duplicate: 1,
              };

              await LeadContact.create(leadContactToSave);
              duplicates += 1;
              await Lead.update(
                { duplicates: duplicates },
                { where: { id: row.lead_id } }
              );
            }
          })
          .catch((err) => {});
      });
    })
    .catch((err) => {
      console.log('err', err);
    });

  const file = req.body.file_name;
  if (!file) {
    const error = new Error('Please upload a file');
    error.httpStatusCode = 400;
    return next(error);
  }
  res.send({ status: 'success' });
};

exports.getTemplates = async (req, res, next) => {
  const { org_id } = req.body;

  const foundItem = await db.socialMediaConnection.findOne({
    where: { organizationOrgId: org_id, name: 'WhatsApp' },
  });
  var accessToken = '';
  var whatsappBusinessAccountId = '';
  if (foundItem) {
    accessToken = foundItem.dataValues.password;
    whatsappBusinessAccountId =
      foundItem.dataValues.socialMediaHandle.split(':')[1];
  } else {
    next(new AppError('Connect whatsapp first...', 200));
  }
  try {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://graph.facebook.com/v16.0/${whatsappBusinessAccountId}/message_templates`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    };

    axios
      .request(config)
      .then((response) => {
        res.send({
          status: 'success',
          data: response.data.data,
        });
      })
      .catch((error) => {
        console.log(JSON.stringify(error));
        res.send({
          status: 'error',
          data: JSON.stringify(error),
        });
      });
  } catch (err) {
    next(new AppError(err.message, 200));
  }
};

exports.addNewWaTemplate = async (req, res, next) => {
  const { description, url, cta, templateName, agency_id, org_id } = req.body;

  const getWhatsAppDetails = await db.socialMediaConnection.findOne({
    where: { organizationOrgId: org_id, name: 'WhatsApp' },
  });
  var accessToken = '';
  if (getWhatsAppDetails) {
    accessToken = getWhatsAppDetails.dataValues.password;
  } else {
    next(new AppError('Connect whatsapp first...', 200));
  }

  let assetData;
  let assetCredentials;
  const busniessData = await Business.findOne({
    where: {
      organizationOrgId: org_id,
    },
  });

  if (busniessData) {
    if (busniessData.assetAssetId) {
      assetData = await Asset.findOne({
        where: { assetId: busniessData.assetAssetId },
      });
    }
  }

  if (assetData && assetData.credentials) {
    assetCredentials = assetData.credentials;
  } else {
    assetCredentials = {};
  }

  $fbAppId = 1364790973900146;
  $waBusinessId = getWhatsAppDetails.dataValues.socialMediaHandle.split(':')[1];
  try {
    const createTempplate = await postController.addWaTemplates(
      description,
      url,
      cta,
      templateName,
      accessToken,
      assetCredentials,
      $fbAppId,
      $waBusinessId
    );
    if (createTempplate.status) {
      res.send({
        status: 'success',
        data: createTempplate.data,
      });
    } else {
      next(new AppError(createTempplate, 200));
    }
  } catch (err) {
    next(new AppError(err.message, 200));
  }
};

exports.broadcastWhatsappMessages = async (req, res, next) => {
  const {
    curation_channel,
    selected_leads,
    wa_template,
    postAt,
    agency_id,
    org_id,
    wa_template_lang,
    file_url,
    wa_campaign,
  } = req.body;
  //const foundItem = await db.tempWpToken.findOne();
  const getWhatsAppDetails = await db.socialMediaConnection.findOne({
    where: { organizationOrgId: org_id, name: 'WhatsApp', status: 'Active' },
  });

  var accessToken = '';
  if (getWhatsAppDetails) {
    accessToken = getWhatsAppDetails.dataValues.password;
  } else {
    next(new AppError('Connect whatsapp first...', 200));
    return false;
  }

  if(wa_campaign == null || wa_campaign == 'null') {
    next(new AppError('Missing campaign, please select campaign...', 200));
    return false;
  }

  if(wa_template == null || wa_template == 'null') {
    next(new AppError('Missing template, please select template...', 200));
    return false;
  }

  const content = {
    curation_channel: curation_channel,
    selected_leads: JSON.stringify(selected_leads),
    wa_template_lang,
    file_url: file_url,
    wp_template: wa_template,
    wa_campaign,
    orgId: org_id,
  };
  try {
    const contents = await WhatsappBroadcastContnent.create(content);
    
    const getWhatsAppDetails = await db.socialMediaConnection.findOne({
      where: { organizationOrgId: org_id, name: 'WhatsApp' },
    });

    const whatsAppId = getWhatsAppDetails.dataValues.socialMediaHandle.split(':')[0];

    let promises = [];
    postAt.forEach((currentPostAt) => {
      promises.push(
        this.createContentPost(
          currentPostAt,
          contents.whatsappBroadcastContnentID,
          accessToken,
          org_id,
          whatsAppId,
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
  } catch (err) {
    next(new AppError(err.message, 200));
  }
};

exports.createContentPost = async (
  postAt,
  whatsappBroadcastContnentID,
  accessToken,
  org_id,
  whatsAppId,
  next
) => {
  try {
    const postContent = await WhatsappContentPost.create({
      whatsappBroadcastContnentWhatsappBroadcastContnentID:
        whatsappBroadcastContnentID,
      postAt,
      accessToken,
      orgID: org_id,
      whatsAppId
    });
    return postContent;
  } catch (err) {
    next(new AppError(err.message, 200));
  }
};

exports.updateWACampaignCompletedStatus = async () => {
  const waCampaignStatus = await WhatsappBroadcastContnent.update(
    { status: 'COMPLETED' },
    {
      returning: true,
      where: {
        status: {
          [Op.or]: ['NEW', 'LIVE'],
        },
        endAt: {
          [Op.lt]: Sequelize.fn('NOW'),
        },
      },
    }
  );
  return waCampaignStatus;
};

exports.getCurrentPostDetails = async () => {
  return new Promise((resolve, reject) => {
    var utcMoment = moment.utc();
    var utcDate = new Date(utcMoment.format());
    const toDate = moment(utcDate).add(1, 'minutes').toDate();
    const fromDate = moment(utcDate).toDate();
    db.whatsappContentPost
      .findAll({
        where: {
          postAt: {
            [Op.lte]: toDate,
          },
          postStatus: {
            [Op.or]: ['WAITING'],
          },
          postId: null,
        },
        attributes: [
          'whatsappContentPostID',
          'postAt',
          'postStatus',
          'whatsappBroadcastContnentWhatsappBroadcastContnentID',
          'accessToken',
          'orgID',
          'whatsAppId',
        ],
        include: [
          {
            model: db.whatsappBroadcastContnent,
            as: 'whatsappBroadcastContnent',
            attributes: [
              'wp_template',
              'selected_leads',
              'wa_template_lang',
              'file_url',
              'wa_campaign',
            ],
          },
        ],
      })
      .then((postDetails) => {
        let filteredPost = [];
        if (postDetails.length > 0) {
          filteredPost = postDetails.map(async (item) => {
            return {
              whatsappContentPostID: item.dataValues.whatsappContentPostID,
              postStatus: item.dataValues.postStatus,
              whatsappBroadcastContnentID:
                item.dataValues
                  .whatsappBroadcastContnentWhatsappBroadcastContnentID,
              wp_template:
                item.dataValues.whatsappBroadcastContnent.wp_template,
              wa_template_lang:
                item.dataValues.whatsappBroadcastContnent.wa_template_lang,
              file_url: item.dataValues.whatsappBroadcastContnent.file_url,
              selected_leads:
                item.dataValues.whatsappBroadcastContnent.selected_leads,
              accessToken: item.dataValues.accessToken,
              orgID: item.dataValues.orgID,
              wa_campaign:
                item.dataValues.whatsappBroadcastContnent.wa_campaign,
              whatsAppId: item.dataValues.whatsAppId,
            };
          });
        }
        resolve({
          status: 'success',
          data: filteredPost,
        });
      })
      .catch((err) => {
        resolve({
          status: 'success',
          data: [],
        });
      });
  });
};

exports.checkIfTokenExists = async (req, res, next) => {
  const { org_id } = req.body;

  const foundItem = await db.socialMediaConnection.findOne({
    where: { organizationOrgId: org_id, name: 'WhatsApp' },
  });

  if (foundItem) {
    res.send({
      status: 'success',
    });
  } else {
    next(new AppError('Connect whatsapp first...', 200));
  }
};

exports.deleteLead = async (req, res, next) => {
  try {
    const { lead_id } = req.body;
    const leadData = await Lead.destroy({
      where: {
        id: lead_id,
      },
    });

    if (leadData) {
      res.send({
        status: 'success',
        message: 'Lead Deleted Succesfully',
      });
    }
  } catch (err) {
    next(new AppError(err.message, 200));
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { user_id } = req.body;
    const getUserData = await User.findOne({
      where: {
        userId: user_id,
      }
    })
    const userData = await User.update({
        email: getUserData.email+'_deleted_'+moment().format('YYYY-MM-DD').toString(),
      },
      { where: { userId: user_id } });

    if (userData) {
      res.send({
        status: 'success',
        message: 'User Deleted Succesfully',
      });
    }
  } catch (err) {
    next(new AppError(err.message, 200));
  }
};

exports.readSocialInbox = async (req, res, next) => {
  try {
    const { inbox_id, inbox_read_status } = req.body;
    const updateInbox = await SocialInbox.update(
      {
        isRead: inbox_read_status,
        updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      },
      { where: { socialInboxID: inbox_id } }
    );

    if (updateInbox) {
      res.send({
        status: 'success',
        message: 'Inbox updated succesfully',
      });
    }
  } catch (err) {
    next(new AppError(err.message, 200));
  }
};

exports.postWebhookWhatsapp = async (req, res, next) => {
  const token =
    'EAATZARSkxJXIBO4pDwZCfh1IRHKVOuGk9yDkIqfZAmea2bJkMSZALQTcrKGzZCpfVD79S9QYC6MfkKPu9PZCZC3m0bJOtUtmYtA3OWaS5458jYt4GaTJmMPAbdXKec7loigcAAeixKakb1fL7Ifslvt9IlUb3rZCZAYX1ZATZCPmjEVUjSrBRrbMWvdC3zOZCZByWcS6c';
  // Parse the request body from the POST
  let body = req.body;

  // Check the Incoming webhook message
  console.log(JSON.stringify(req.body, null, 2));

  // info on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
  if (req.body.object) {
    //sent
    if (
      req.body.entry &&
      req.body.entry[0].changes &&
      req.body.entry[0].changes[0] &&
      req.body.entry[0].changes[0].value.statuses &&
      req.body.entry[0].changes[0].value.statuses[0] &&
      req.body.entry[0].changes[0].value.statuses[0].status
    ) {
      const waId = req.body.entry[0].changes[0].value.statuses[0].id;
      const timestamp =
        req.body.entry[0].changes[0].value.statuses[0].timestamp;
      if (req.body.entry[0].changes[0].value.statuses[0].status == 'sent') {
        await WaBroadcastLog.update(
          { sent: 1, sentDateTime: moment.unix(timestamp).format() }, //delivered, //read, //received //replied
          { where: { postID: waId } }
        );
      }

      if (
        req.body.entry[0].changes[0].value.statuses[0].status == 'delivered'
      ) {
        await WaBroadcastLog.update(
          { delivered: 1, deliveredDateTime: moment.unix(timestamp).format() }, //delivered, //read, //received //replied
          { where: { postID: waId } }
        );
      }

      if (req.body.entry[0].changes[0].value.statuses[0].status == 'read') {
        await WaBroadcastLog.update(
          { read: 1, readDateTime: moment.unix(timestamp).format() }, //delivered, //read, //received //replied
          { where: { postID: waId } }
        );
      }
    }

    // replied
    if (
      req.body.entry &&
      req.body.entry[0].changes &&
      req.body.entry[0].changes[0] &&
      req.body.entry[0].changes[0].value.messages &&
      req.body.entry[0].changes[0].value.messages[0]
    ) {
      const timestamp =
        req.body.entry[0].changes[0].value.messages[0].timestamp;
      let phone_number_id =
        req.body.entry[0].changes[0].value.metadata.phone_number_id;
      let from = req.body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
      let msg_body;
      if (req.body.entry[0].changes[0].value.messages[0].type == 'image') {
        msg_body = req.body.entry[0].changes[0].value.messages[0].image.caption; // extract the message text from the webhook payload
      } else if (req.body.entry[0].changes[0].value.messages[0].type == 'reaction') {
        msg_body = req.body.entry[0].changes[0].value.messages[0].reaction.emoji; // extract the message text from the webhook payload
      } else if (req.body.entry[0].changes[0].value.messages[0].type == 'video') {
        msg_body = 'its a video, cant play.'; // extract the message text from the webhook payload
      } else {
        msg_body = req.body.entry[0].changes[0].value.messages[0].text.body;
      }

      if (req.body.entry[0].changes[0].value.messages[0].context) {
        const waId = req.body.entry[0].changes[0].value.messages[0].context.id;
        await WaBroadcastLog.update(
          {
            replied: 1,
            repliedDateTime: moment.unix(timestamp).format(),
            repliedMsg: msg_body,
          }, //delivered, //read, //received //replied
          { where: { postID: waId } }
        );

        const getOrgId = await db.socialMediaConnection.findOne({
          where: {
            socialMediaHandle: {
              [Op.like]: '%' + phone_number_id + '%',
            },
          },
        });
        const socialInboxData = {
          channelName: 'WhatsApp',
          channelId: from,
          postID: waId,
          messageType: 'INCOMING',
          message: msg_body,
          isRead: 0,
          sentTo: phone_number_id,
          orgId: getOrgId.dataValues.organizationOrgId,
        };
        if (msg_body != null) {
          await SocialInbox.create(socialInboxData);
        }
      } else {
        const waId = req.body.entry[0].changes[0].value.messages[0].id;
        const getOrgId = await db.socialMediaConnection.findOne({
          where: {
            socialMediaHandle: {
              [Op.like]: '%' + phone_number_id + '%',
            },
          },
        });
        const socialInboxData = {
          channelName: 'WhatsApp',
          channelId: from,
          postID: waId,
          messageType: 'INCOMING',
          message: msg_body,
          isRead: 0,
          sentTo: phone_number_id,
          orgId: getOrgId.dataValues.organizationOrgId,
        };
        if (msg_body != null) {
          await SocialInbox.create(socialInboxData);
        }
      }

      if (phone_number_id == '134632433069005') {
        //api call to grads leads
        axios({
          method: 'GET', // Required, HTTP method, a string, e.g. POST, GET
          url: `https://portal.gradsgateway.com/api/v1/leads?StudentName=Trial-Name&Email=Trial-Email&MobileNumber=${from}&Message=${msg_body}`,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }
    res.sendStatus(200);
  } else {
    // Return a '404 Not Found' if event is not from a WhatsApp API
    res.sendStatus(404);
  }
};

exports.getWebhookWhatsapp = async (req, res, next) => {
  /**
   * UPDATE YOUR VERIFY TOKEN
   *This will be the Verify Token value when you set up webhook
   **/
  const verify_token = 'ace1234';
  console.log('res', res);
  // Parse params from the webhook verification request
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  // Check if a token and mode were sent
  if (mode && token) {
    console.log('aaaa');
    // Check the mode and token sent are correct
    if (mode === 'subscribe' && token === verify_token) {
      // Respond with 200 OK and challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
};

exports.getWhatsAppAnalytics = async (req, res, next) => {
  const { orgId, startDate, endDate, duration } = req.body;

  const foundItem = await db.socialMediaConnection.findOne({
    where: { organizationOrgId: orgId, name: 'WhatsApp' },
  });

  if (foundItem) {
    const whatsAppPhoneNoId =
      foundItem.dataValues.socialMediaHandle.split(':')[0];
    //whatsappBroadcastContnentWhatsappBroadcastContnentID
    const getAllWhatsAppLeads = WaBroadcastLog.findAll({
      where: {
        fromNumber: whatsAppPhoneNoId,
      },
      attributes: [
        'waBroadcastLogID',
        'leadId',
        'fromNumber',
        'postID',
        'status',
        'wp_template_name',
        'createdAt',
        'wa_campaign',
        'wa_campaign_name',
      ],
      order: [['createdAt', 'DESC']],
      group: ['wa_campaign'],
    });

    const getAllWhatsAppSent = WaBroadcastLog.findAll({
      where: {
        fromNumber: whatsAppPhoneNoId,
        wa_campaign: {
          [Op.ne]: null,
        },
      },
      attributes: ['leadId', 'sent', 'wa_campaign'],
    });

    Promise.all([getAllWhatsAppLeads, getAllWhatsAppSent])
      .then((responses) => {
        res.send({
          status: 'success',
          message: 'Whatsapp Leads Fetched Succesfully',
          totalLeads: responses[0].length,
          totalWhatsappSent: responses[1].length,
          getUniqueCampaigns: responses[0],
        });
      })
      .catch((err) => {
        console.log('**********ERROR RESULT****************');
        console.log(err);
        res.send({
          status: 'success',
          message: 'Whatsapp Leads Not Fetched',
          totalLeads: 0,
          totalWhatsappSent: 0,
          getUniqueCampaigns: [],
        });
      });
  } else {
    res.send({
      status: 'success',
      message: 'Whatsapp Leads Not Fetched Succesfully',
      totalLeads: 0,
      totalWhatsappSent: 0,
      getUniqueCampaigns: [],
    });
  }

  // try {
  //   let config = {
  //       method: 'get',
  //       maxBodyLength: Infinity,
  //       url: `https://graph.facebook.com/v16.0/${foundItem.dataValues.socialMediaHandle.split(':')[1]}?fields=analytics.start(1704067200).end(1734785999).granularity(Day)&access_token=${accessToken}`
  //     };

  //   axios.request(config)
  //     .then((response) => {
  //       console.log(response.data.analytics);
  //       res.send({
  //         status: 'success',
  //         data: response.data
  //       });
  //     })
  //     .catch((error) => {
  //       console.log(JSON.stringify(error));
  //       res.send({
  //         status: 'error',
  //         data: JSON.stringify(error)
  //       });

  //     });

  // } catch (err) {
  //   next(new AppError(err.message, 200));
  // }
};

exports.getSocialInbox = async (req, res, next) => {
  const { orgId, startDate, endDate, duration, type, filterBy, page } = req.body;  
  const { pageSize = 10 } = req.query;
  console.log(req.body);
  console.log(orgId, startDate, endDate, duration, type, filterBy);

  if (filterBy == 'all') {
    const totalCount = await SocialInbox.count({
      where: {
        orgId: orgId,
        messageType: type,
        isRead: 0,
        message: {
          [Op.ne]: null,
        }
      },
      order: [['createdAt', 'DESC']]
    });
    const getSocialInboxData = await SocialInbox.findAll({
      where: {
        orgId: orgId,
        messageType: type,
        isRead: 0,
        message: {
          [Op.ne]: null,
        }
      },
      order: [['createdAt', 'DESC']],
      limit: parseInt(pageSize),
      offset: page > 1 ? (page-1) * pageSize : 0
    });
    res.send(
    {
      "status": 'success',
      "draw": page,
      "recordsTotal": totalCount,
      "recordsFiltered": totalCount,
      "data": getSocialInboxData,
    })
  } else if (filterBy == 'WhatsApp' && type == 'OUTGOING') {
    try {

      const totalCount = await SocialInbox.count({
        where: {
          orgId: orgId,
          messageType: type,
          channelName: filterBy,
          isRead: 0,
          message: {
            [Op.ne]: null,
          }
        },
        order: [['createdAt', 'DESC']],
      });
      const getSocialInboxData = await SocialInbox.findAll({
        where: {
          orgId: orgId,
          messageType: type,
          channelName: filterBy,
          isRead: 0,
          message: {
            [Op.ne]: null,
          }
        },
        order: [['createdAt', 'DESC']],
        limit: parseInt(pageSize),
        offset: totalCount > 10 ? page * pageSize : 0
      });
      res.send(
      {
        "status": 'success',
        "draw": page,
        "recordsTotal": totalCount,
        "recordsFiltered": totalCount,
        "data": getSocialInboxData
      })

      // const totalCount = await db.sequelize.query(
      //   'SELECT socialInboxes.*,waBroadcastLogs.sent, waBroadcastLogs.read,waBroadcastLogs.replied, waBroadcastLogs.repliedMsg FROM `socialInboxes` LEFT JOIN `waBroadcastLogs` ON socialInboxes.postID COLLATE utf8mb4_general_ci = waBroadcastLogs.postID WHERE socialInboxes.messageType = :type AND socialInboxes.channelName = "WhatsApp" AND socialInboxes.isRead = 0 AND socialInboxes.orgId = :orgId ORDER BY `socialInboxes`.`createdAt`  DESC',
      //   {
      //     replacements: { type: type, orgId: orgId },
      //     type: db.sequelize.QueryTypes.SELECT,
      //   }
      // );
      // const getSocialInboxData = await db.sequelize.query(
      //   'SELECT socialInboxes.*,waBroadcastLogs.sent, waBroadcastLogs.read,waBroadcastLogs.replied, waBroadcastLogs.repliedMsg FROM `socialInboxes` LEFT JOIN `waBroadcastLogs` ON socialInboxes.postID COLLATE utf8mb4_general_ci = waBroadcastLogs.postID WHERE socialInboxes.messageType = :type AND socialInboxes.channelName = "WhatsApp" AND socialInboxes.isRead = 0 AND socialInboxes.orgId = :orgId ORDER BY `socialInboxes`.`createdAt`  DESC LIMIT 10 OFFSET :page',
      //   {
      //     replacements: { type: type, orgId: orgId, page: page*10 },
      //     type: db.sequelize.QueryTypes.SELECT,
      //   }
      // );

      // res.send(
      //   {
      //     "status": 'success',
      //     "draw": page,
      //     "recordsTotal": totalCount.length,
      //     "recordsFiltered": totalCount.length,
      //     "data": getSocialInboxData
      //   })
    } catch (e) {
      res.send({
        "status": 'success',
        "draw": 1,
        "recordsTotal": 0,
        "recordsFiltered": 0,
        "data": []
      });
      console.error(e);
    }
  } else {
    const totalCount = await SocialInbox.count({
      where: {
        orgId: orgId,
        messageType: type,
        channelName: filterBy,
        isRead: 0,
        message: {
          [Op.ne]: null,
        }
      },
      order: [['createdAt', 'DESC']],
    });
    const getSocialInboxData = await SocialInbox.findAll({
      where: {
        orgId: orgId,
        messageType: type,
        channelName: filterBy,
        isRead: 0,
        message: {
          [Op.ne]: null,
        }
      },
      order: [['createdAt', 'DESC']],
      limit: parseInt(pageSize),
      offset: totalCount > 10 ? page * pageSize : 0
    });
    res.send(
    {
      "status": 'success',
      "draw": page,
      "recordsTotal": totalCount,
      "recordsFiltered": totalCount,
      "data": getSocialInboxData
    })
  }
};

exports.getWhatsAppAnalyticsDetails = async (req, res, next) => {
  const { leadId, orgId } = req.body;
  //leadId is wa_campaign
  // try {
  if (leadId == 'all') {
    const getWhatsAppDetails = await db.socialMediaConnection.findOne({
      where: { organizationOrgId: orgId, name: 'WhatsApp' },
    });
    if (getWhatsAppDetails != null) {
      const fromNumber =
        getWhatsAppDetails.dataValues.socialMediaHandle.split(':')[0];

      const getAllLeads = WaBroadcastLog.findAll({
        where: {
          fromNumber,
        },
        attributes: ['fromNumber', 'createdAt'],
        order: [['createdAt', 'DESC']],
      });

      const getAllSent = WaBroadcastLog.findAll({
        where: {
          fromNumber,
          sent: 1,
        },
        attributes: ['fromNumber', 'sent', 'createdAt'],
        order: [['createdAt', 'DESC']],
      });

      const getAllFailed = WaBroadcastLog.findAll({
        where: {
          fromNumber,
          sent: 0,
        },
        attributes: ['fromNumber', 'sent', 'createdAt'],
        order: [['createdAt', 'DESC']],
      });

      const getAllDelivered = WaBroadcastLog.findAll({
        where: {
          fromNumber,
          delivered: 1,
        },
        attributes: ['fromNumber', 'delivered', 'createdAt'],
        order: [['createdAt', 'DESC']],
      });

      const getAllRead = WaBroadcastLog.findAll({
        where: {
          fromNumber,
          read: 1,
        },
        attributes: ['fromNumber', 'read', 'createdAt'],
        order: [['createdAt', 'DESC']],
      });

      const getAllReplied = WaBroadcastLog.findAll({
        where: {
          fromNumber,
          replied: 1,
        },
        attributes: ['fromNumber', 'replied', 'createdAt'],
        order: [['createdAt', 'DESC']],
      });

      Promise.all([
        getAllLeads,
        getAllSent,
        getAllDelivered,
        getAllRead,
        getAllReplied,
        getAllFailed,
      ])
        .then((responses) => {
          res.send({
            status: 'success',
            allLeads: responses[0],
            totalSent: responses[1].length,
            totalReceived: responses[2].length,
            totalRead: responses[3].length,
            totalReplied: responses[4].length,
            totalFailed: responses[5].length,
            message: 'Whatsapp Lead  Details Fetched',
          });
        })
        .catch((err) => {
          console.log('**********ERROR RESULT****************');
          console.log(err);
          res.send({
            status: 'success',
            allLeads: [],
            totalSent: 0,
            totalReceived: 0,
            totalRead: 0,
            totalReplied: 0,
            totalFailed: 0,
            message: 'Whatsapp Leads Not Fetched',
          });
        });
    } else {
      res.send({
        status: 'success',
        allLeads: [],
        totalSent: 0,
        totalReceived: 0,
        totalRead: 0,
        totalReplied: 0,
        totalFailed: 0,
        message: 'Whatsapp Not Connected',
      });
    }
  } else {
    const getAllLeads = WaBroadcastLog.findAll({
      where: {
        wa_campaign: leadId,
      },
      attributes: ['wa_campaign', 'createdAt'],
      order: [['createdAt', 'DESC']],
    });

    const getAllSent = WaBroadcastLog.findAll({
      where: {
        wa_campaign: leadId,
        sent: 1,
      },
      attributes: ['wa_campaign', 'sent', 'createdAt'],
      order: [['createdAt', 'DESC']],
    });

    const getAllFailed = WaBroadcastLog.findAll({
      where: {
        wa_campaign: leadId,
        sent: 0,
      },
      attributes: ['wa_campaign', 'sent', 'createdAt'],
      order: [['createdAt', 'DESC']],
    });

    const getAllDelivered = WaBroadcastLog.findAll({
      where: {
        wa_campaign: leadId,
        delivered: 1,
      },
      attributes: ['wa_campaign', 'delivered', 'createdAt'],
      order: [['createdAt', 'DESC']],
    });

    const getAllRead = WaBroadcastLog.findAll({
      where: {
        wa_campaign: leadId,
        read: 1,
      },
      attributes: ['wa_campaign', 'read', 'createdAt'],
      order: [['createdAt', 'DESC']],
    });

    const getAllReplied = WaBroadcastLog.findAll({
      where: {
        wa_campaign: leadId,
        replied: 1,
      },
      attributes: ['wa_campaign', 'replied', 'createdAt'],
      order: [['createdAt', 'DESC']],
    });

    Promise.all([
      getAllLeads,
      getAllSent,
      getAllDelivered,
      getAllRead,
      getAllReplied,
      getAllFailed,
    ])
      .then((responses) => {
        res.send({
          status: 'success',
          allLeads: responses[0],
          totalSent: responses[1].length,
          totalReceived: responses[2].length,
          totalRead: responses[3].length,
          totalReplied: responses[4].length,
          totalFailed: responses[5].length,
          message: 'Whatsapp Lead  Details Fetched',
        });
      })
      .catch((err) => {
        console.log('**********ERROR RESULT****************');
        console.log(err);
        res.send({
          status: 'success',
          allLeads: [],
          totalSent: 0,
          totalReceived: 0,
          totalRead: 0,
          totalReplied: 0,
          totalFailed: 0,
          message: 'Whatsapp Leads Not Fetched',
        });
      });
  }

  // } catch (err) {
  //   next(new AppError(err.message, 200));
  // }
};

exports.addToSocialInboxViaApi = async (req, res, next) => {
  const { orgId, channelName, channelId, postId, messageType, createdDate } = req.body;
  console.log(orgId, channelName, channelId, postId, messageType, createdDate);

  if (!orgId || !channelName || !channelId || !postId || !messageType || !createdDate) {
    res.send({
      status: 'error',
      message: 'Mising Data.'
    });
  }
  
  const foundItem = await db.socialInbox.findOne({
    where: { orgId: orgId, postID: postId },
  });
  console.log(foundItem);

  if (!foundItem) {
    try {
      const socialInboxData = {
        channelName: channelName,
        channelId: channelId,
        postID: postId,
        messageType: 'INCOMING',
        message: messageType,
        isRead: 0,
        sentTo: null,
        orgId: orgId,
        createdAt: moment(createdDate).format('YYYY-MM-DD HH:mm:ss'),
      };
      await SocialInbox.create(socialInboxData);
      res.send({
        status: 'success',
        message: 'Record Added Successfully.'
      });
    } catch (err) {
      console.log(err);
    }
  } else {
    res.send({
      status: 'success',
      message: 'Record Already Added.'
    });
  }

};

exports.addToSocialInboxViaApiForCF7 = async (req, res, next) => {
  const { orgId, channelName, channelId, messageType } = req.query;
  const { postId, message, name, email } = req.body;
  console.log(orgId, channelName, channelId, postId, messageType, message);

  if (!orgId || !channelName || !channelId || !postId || !messageType || !message) {
    res.send({
      status: 'error',
      message: 'Mising Data.'
    });
  }
  
  const foundItem = await db.socialInbox.findOne({
    where: { orgId: orgId, postID: postId },
  });

  if (!foundItem) {
    try {
      const socialInboxData = {
        channelName: channelName,
        channelId: channelId,
        postID: name+': '+postId,
        messageType: messageType,
        message: message,
        isRead: 0,
        sentTo: 'Website',
        orgId: orgId,
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      };
      await SocialInbox.create(socialInboxData);
      res.send({
        status: 'success',
        message: 'Record Added Successfully.'
      });
    } catch (err) {
      //console.log(err);
    }
  } else {
    res.send({
      status: 'success',
      message: 'Record Already Added.'
    });
  }

};
