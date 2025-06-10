const db = require('../models');
const moment = require('moment');
const AppError = require('../utils/appError');

const Organization = db.organization;
const SocialMediaConnection = db.socialMediaConnection;

/**
 * funtion to check if the payload of the get request holds any of the below mentioned property
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */


exports.checkGetBody = (req, res, next) => {
  if (
    !req.body.name &&
    !req.body.aliasName &&
    !req.body.orgUrl &&
    !req.body.orgId
  ) {
    next(new AppError('Missing OrgName or AliasName1 or Url', 200));
  }
  next();
};

/**
 * funtion to check if the payload of the get request holds all of the below mentioned property
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 */


exports.checkPostBody = (req, res, next) => {
  if (!req.body.name || !req.body.aliasName || !req.body.orgUrl) {
    next(new AppError('Missing OrgName or AliasName or Url', 200));
  }
  next();
};

/**
 * Function to create organization into the Database
 * @param {object} req
 * @param {object} res
 * @param {object} next
 */


exports.createOrgDetails = async (req, res, next) => {
  // Create a organization
  const organization = {
    name: req.body.name,
    aliasName: req.body.aliasName,
    orgUrl: req.body.orgUrl,
    orgSmPolicy: req.body.orgSmPolicy,
    orgStatus: req.body.orgStatus,
    agencyAgencyId: req.body.agencyId,
  };

  // Save Organization in the database
  Organization.create(organization)
    .then((data) => {
      // res.send({
      //   status: 'success',
      //   data: {
      //     orgId: data.orgId,
      //   }
      // })
      const condition = { where: { userId: req.body.userId } };
      db.user.findOne(condition).then((foundItem) => {
        const teamData = {
          userUserId: foundItem.userId,
          agencyAgencyId: req.body.agencyId,
          organizationOrgId: data.orgId,
          roleRoleId: 1,
        };

        // Assign the current user to the above created organization
        const updateRecord = db.team
          .create(teamData)
          .then((respnse) => {
            res.send({
              status: 'success',
              data: {
                orgId: data.orgId,
              },
            });
          })
          .catch((err) => {
            next(
              new AppError(
                err.message || 'Some error occurred while updating the user.',
                200
              )
            );
          });
      });
    })
    .catch((err) => {
      next(
        new AppError(
          err.message || 'Some error occurred while creating the Organization.',
          200
        )
      );
    });
};

/**
 * Function to create organization into the Database
 * @param {object} req
 * @param {object} res
 * @param {object} next
 */


exports.createWhatsappDetails = async (req, res, next) => {
  // Save WhatsApp Connection in the database
  const socialMediaConnections = await db.socialMediaConnection.create({
    name: 'WhatsApp',
    socialMediaType: 'PAID',
    socialMediaHandle: `${req.body.phoneNumberId}:${req.body.whatsappBusinesAccountId}`,
    password:
      'EAATZARSkxJXIBO4pDwZCfh1IRHKVOuGk9yDkIqfZAmea2bJkMSZALQTcrKGzZCpfVD79S9QYC6MfkKPu9PZCZC3m0bJOtUtmYtA3OWaS5458jYt4GaTJmMPAbdXKec7loigcAAeixKakb1fL7Ifslvt9IlUb3rZCZAYX1ZATZCPmjEVUjSrBRrbMWvdC3zOZCZByWcS6c',
    tokenExpiry: moment().endOf('year'),
    status: 'ACTIVE',
    isConfigured: 1,
    organizationOrgId: req.body.orgId,
  });
  if (socialMediaConnections) {
    const socialMediapages = await db.socialMediaPage.create({
      socialMediaConnectionSocalMediaConnectionId:
        socialMediaConnections.socalMediaConnectionId,
      url: `${req.body.phoneNumberId}:${req.body.whatsappBusinesAccountId}`,
      password:
        'EAATZARSkxJXIBO4pDwZCfh1IRHKVOuGk9yDkIqfZAmea2bJkMSZALQTcrKGzZCpfVD79S9QYC6MfkKPu9PZCZC3m0bJOtUtmYtA3OWaS5458jYt4GaTJmMPAbdXKec7loigcAAeixKakb1fL7Ifslvt9IlUb3rZCZAYX1ZATZCPmjEVUjSrBRrbMWvdC3zOZCZByWcS6c',
      description: 'Whatsapp Connection Credentials',
      title: 'WhatsApp',
    });
    res.send({
      status: 'success',
      message: 'WhatsApp Connection Added Succesfully',
    });
  } else {
    next(
      new AppError(
        'Some error occurred while creating the Whatsapp Connection.',
        200
      )
    );
  }
};

exports.getNewConnectionDetails = async (req, res, next) => {
  const { orgId, from } = req.body;
  SocialMediaConnection.findOne({
    where: { organizationOrgId: orgId, name: from },
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
      next(new AppError(`Error retrieving ${from} Connection`, 200));
    });
};

exports.updateWhatsappDetails = async (req, res, next) => {
  const { whatsapp_connection_id } = req.body;
  try {
    const foundItem = await db.socialMediaConnection.findOne({
      where: { socalMediaConnectionId: whatsapp_connection_id },
    });
    if (!foundItem) {
      next(new AppError('No Record Found', 200));
    } else {
      try {
        const updateRecord = await db.socialMediaConnection.update(
          {
            socialMediaHandle: `${req.body.phone_number_id}:${req.body.Whatsapp_busines_account_id}`,
          },
          {
            returning: true,
            where: { socalMediaConnectionId: whatsapp_connection_id },
          }
        );
        const updateSocialMediaPageData = await db.socialMediaPage.update(
          {
            url: `${req.body.phone_number_id}:${req.body.Whatsapp_busines_account_id}`,
          },
          {
            returning: true,
            where: {
              socialMediaConnectionSocalMediaConnectionId:
                whatsapp_connection_id,
            },
          }
        );
        res.send({
          status: 'success',
          message: 'WhatsApp Connection Updated Succesfully',
        });
      } catch (err) {
        next(new AppError(err.message, 200));
      }
    }
  } catch (err) {
    next(new AppError(err.message, 200));
  }
};

exports.createNewConnectionDetails = async (req, res, next) => {
  if (req.body.form_source == 'connect_google_reviews') {
    // Save Google Review Connection in the database
    const socialMediaConnections = await db.socialMediaConnection.create({
      name: 'Google Reviews',
      socialMediaType: 'PAID',
      socialMediaHandle: `${req.body.googlePlaceName}:${req.body.googlePlaceId}`,
      password: 'AIzaSyCsczrOWyH7WbVc3l_VbzgpYoBrjJ9GHm0',
      tokenExpiry: moment().endOf('year'),
      status: 'ACTIVE',
      isConfigured: 1,
      organizationOrgId: req.body.orgId,
    });
    if (socialMediaConnections) {
      const socialMediapages = await db.socialMediaPage.create({
        socialMediaConnectionSocalMediaConnectionId:
          socialMediaConnections.socalMediaConnectionId,
        url: `${req.body.googlePlaceName}:${req.body.googlePlaceId}`,
        password: 'AIzaSyCsczrOWyH7WbVc3l_VbzgpYoBrjJ9GHm0',
        description: 'Google Review Connection Credentials',
        title: 'Google Reviews',
      });
      res.send({
        status: 'success',
        message: 'Google Review Connection Added Succesfully',
      });
    } else {
      next(
        new AppError(
          'Some error occurred while creating the Google Review Connection.',
          200
        )
      );
    }
  }
};

exports.updateNewConnectionDetails = async (req, res, next) => {
  const { google_reviews_connection_id, form_source } = req.body;
  if (form_source == 'connect_google_reviews') {
    try {
      const foundItem = await db.socialMediaConnection.findOne({
        where: { socalMediaConnectionId: google_reviews_connection_id },
      });
      if (!foundItem) {
        next(new AppError('No Record Found', 200));
      } else {
        try {
          const updateRecord = await db.socialMediaConnection.update(
            {
              socialMediaHandle: `${req.body.googlePlaceName}:${req.body.googlePlaceId}`,
            },
            {
              returning: true,
              where: { socalMediaConnectionId: google_reviews_connection_id },
            }
          );
          const updateSocialMediaPageData = await db.socialMediaPage.update(
            { url: `${req.body.googlePlaceName}:${req.body.googlePlaceId}` },
            {
              returning: true,
              where: {
                socialMediaConnectionSocalMediaConnectionId:
                  google_reviews_connection_id,
              },
            }
          );
          res.send({
            status: 'success',
            message: 'Google Reviews Connection Updated Succesfully',
          });
        } catch (err) {
          next(new AppError(err.message, 200));
        }
      }
    } catch (err) {
      next(new AppError(err.message, 200));
    }
  }
};

/**
 * Function to find the organizatin by org_Id
 * @param {object} req
 * @param {object} res
 * @param {object} next
 */

exports.findById = (req, res, next) => {
  const { orgId } = req.body;
  Organization.findByPk(orgId)
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
      next(new AppError(`Error retrieving Organization`, 200));
    });
};

/**
 * Function to find the organizatin based on the payload
 * @param {object} req
 * @param {object} res
 * @param {object} next
 */


exports.findOneByAnyColumn = (req, res, next) => {
  const { orgId, aliasName, name, orgUrl } = req.body;
  let condition = '';

  switch (Object.keys(req.body)[0]) {
    case 'Name':
      condition = name ? { name: name } : null;
      break;
    case 'AliasName':
      condition = aliasName ? { aliasName: aliasName } : null;
      break;
    case 'orgId':
      condition = orgId ? { orgId: orgId } : null;
      break;
    case 'OrgUrl':
      condition = orgUrl ? { orgUrl: orgUrl } : null;
      break;
  }

  if (!condition) {
    next(
      new AppError(
        'Please provide Org_id or name or Alias Name to retrieve data',
        200
      )
    );
  } else {
    Organization.findOne({ where: condition })
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
        next(new AppError(`Error retrieving Organization`, 200));
      });
  }
};

/**
 * Function to update Organization Information
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */


exports.updateOrgDetails = async (req, res, next) => {
  const { orgId } = req.body;
  try {
    const foundItem = await db.organization.findOne({ where: { orgId } });
    if (!foundItem) {
      next(new AppError('No Record Found', 200));
    } else {
      try {
        const updateRecord = await db.organization.update(req.body, {
          returning: true,
          where: { orgId },
        });
        res.send({
          status: 'success',
          message: 'Organization Updated Succesfully',
        });
      } catch (err) {
        next(new AppError(err.message, 200));
      }
    }
  } catch (err) {
    next(new AppError(err.message, 200));
  }
};

exports.login = async (req, res, next) => {
  const { email } = req.body;
  try {
    const foundItem = await db.user.findOne({ where: { email } });
    if (!foundItem) {
      db.user
        .create({
          firstName: '',
          lastName: '',
          userName: '',
          email,
          password: '',
          userStatus: '',
          organizationOrgId: '',
          roleRoleId: '',
        })
        .then((userData) => {
          res.send({
            status: 'success',
            data: {
              orgId: null,
              userId: userData.userId,
              roleId: userData.roleRoleId || null,
            },
          });
        })
        .catch((err) => {
          console.log('errrr=>');
          console.log(err.message);
          res.send({
            message: err.message,
          });
        });
    } else {
      res.send({
        status: 'success',
        data: {
          orgId: foundItem.organizationOrgId,
          userId: foundItem.userId,
          roleId: foundItem.roleRoleId,
        },
      });
    }
  } catch (err) {
    next(new AppError(err.message, 200));
  }
};

exports.getOrganizationLists = (req, res) => {
  const { agencyId, userId } = req.body;
  Organization.findAll({
    where: {
      agencyAgencyId: agencyId,
    },
    attributes: ['name', 'orgId'],
    include: [
      {
        model: db.team,
        as: 'teams',
        where: [
          {
            userUserId: userId,
          },
        ],
      },
    ],
  }).then((organizationList) => {
    res.send({
      status: 'success',
      data: organizationList,
    });
  });
};


exports.getOrganizationListsbyAgyID = (req, res) => {
  const { agencyId } = req.body;
  Organization.findAll({
    where: {
      agencyAgencyId: agencyId,
    },
    attributes: ['orgId','name','orgStatus']
    
  }).then((organizationList) => {
    res.send({
      status: 'success',
      data: organizationList,
    });
  });
};