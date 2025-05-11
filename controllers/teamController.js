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
const { user } = require('../models');
const Organization = db.organization;
const Role = db.role;
const User = db.user;
const Team = db.team
const Agency = db.agency;


exports.checkPostBody = (req, res, next) => {
  if (
    !req.body.firstName ||
    !req.body.lastName ||
    !req.body.userName ||
    !req.body.password ||
    !req.body.email ||
    !req.body.roleId
  ) {
    next(new AppError('Missing Name or Email or Role', 200));
  }
  next();
};

exports.checkGetBody = (req, res, next) => {
  if (!req.body.orgId) {
    next(new AppError('Missing OrgID', 200));
  }
  next();
};

/**
 * Route to get the team Details for the organization
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */

exports.getTeamDetails = (req, res, next) => {
  const { orgId } = req.body;
  Organization.findByPk(orgId, {
    attributes: [],
    include: [
      {
        model: Team,
        as: 'teams',
        include: 
        [
          { model: Role,
            as: 'role', 
            attributes: ['roleName', 'level'] 
          },
            { 
              model: user, 
              as: 'user' ,
              attributes: [
                'userId',
                'userName',
                'firstName',
                'lastName',
                'email',
                'userStatus',
              ]
            },
        ],
       
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
        next(new AppError('No Record Found', 404));
      }
    })
    .catch((err) => {
      console.log(err.message);
      next(new AppError(`Error retrieving Organization`, 500));
    });
};

/**
 * Route to Create Team Details
 * @param {*} req
 * @param {*} res
 */

exports.createTeamDetails = (req, res, next) => {
  const {
    userId,
    orgId,
    roleId,
    agencyId,
  } = req.body;

  Team.create({
    userUserId: userId,
    agencyAgencyId: agencyId,
    organizationOrgId: orgId,
    roleRoleId: roleId,
  })
    .then((userData) => {
      res.send({
        status: 'success',
        data: {
          userId: userData.userId,
        },
      });
    })
    .catch((err) => {
      next(
        new AppError(
          err.message || 'Some error occurred while creating the User.',
          200
        )
      );
    });
};

/**
 * Function to update Organization Information
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */

exports.updateTeamDetails = async (req, res, next) => {
  const { orgId, email } = req.body;
  try {
    let condition = null
    if (email) {
      condition = { where: { email } }
    }
    if (orgId) {
      condition = { where: { orgId } }
    }
    const foundItem = await db.user.findOne(condition);
    if (!foundItem) {
      next(new AppError('No Record Found', 200));
    } else {
      try {
        const updatedItem = {};
        updatedItem.firstName = req.body.firstName || foundItem.firstName;
        updatedItem.lastName = req.body.lastName || foundItem.lastName;
        updatedItem.userName = req.body.userName || foundItem.userName;
        updatedItem.password = req.body.password || foundItem.password;
        updatedItem.userStatus = req.body.userStatus || foundItem.userStatus;
        updatedItem.organizationOrgId = req.body.orgId || foundItem.organizationOrgId;
        updatedItem.roleRoleId = req.body.roleId || foundItem.roleId;

        const updateRecord = await db.user.update(updatedItem, condition);
        res.send({
          status: 'success',
          message: 'User Updated Succesfully',
        });
      } catch (err) {
        next(new AppError(err.message, 200));
      }
    }
  } catch (err) {
    next(new AppError(err.message, 200));
  }
};

/**
 * Function to delete Team Member
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */

exports.deleteTeamMember = async (req, res, next) => {
  const { orgId, email } = req.body;
  try {
    let condition = null
    if (email) {
      condition = { where: { email } }
    }
    if (orgId) {
      condition = { where: { orgId } }
    }
    const foundItem = await db.user.findOne(condition);
    if (!foundItem) {
      next(new AppError('No Record Found', 200));
    } else {
      try {
        // const deleteRecord = await db.user.destroy(condition);
        const deleteFromTeam = await db.team.destroy({where: {userUserId: foundItem.userId}});

        res.send({
          status: 'success',
          message: 'User Deleted Succesfully',
        });
      } catch (err) {
        next(new AppError(err.message, 200));
      }
    }
  } catch (err) {
    next(new AppError(err.message, 200));
  }
};


/**
 * Route to get the team Details for the organization
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */


exports.getEmpDetailbyEmpID = (req, res, next) => {
  try {
    const { userId } = req.body;

    User.findOne({
      where: { userId: userId },
      attributes: ['userId', 'firstName', 'lastName', 'email', 'userStatus','userName'],
      include: [
        {
          model: Agency, // Reference to the Agency model
          attributes: ['agencyId'], // Only include the agencyId field
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
          next(new AppError('No Record Found', 404));
        }
      })
      .catch((err) => {
        console.error(err.message);
        next(new AppError(`Error retrieving User`, 500));
      });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};
