const { USE } = require('sequelize/lib/index-hints');
const { role } = require('../models');
const db = require('../models');
const AppError = require('../utils/appError');
const Role = db.role;
const User = db.user;
const Agency = db.agency;
const Team = db.team;

exports.createAgencyDetails = async (req, res, next) => {

  // Create a Agency 
  const { name, description, email, userId} = req.body
  const agency = { name, description, email };
  const condition = { returning: true, where: { userId } }

  // Save Agency in the database
  Agency.create(agency).then((data) => { 

    // Update user with role when user creates a agency
    User.update({ agencyAgencyId: data.agencyId, roleRoleId: 1 },condition).then((userInfo)=>{
      const teamData = {
        userUserId: userId ,
        agencyAgencyId: data.agencyId,
        organizationOrgId: '',
        roleRoleId: 5,
      }
      // save Agency Team Members
      Team.create(teamData).then((respnse) => {
        res.send({
          status: 'success',
          data: {
            agencyId: data.agencyId,
          },
        });
      }).
      catch((err) => {
        next(
          new AppError(
            err.message || 'Some error occurred while updating the user.',
            200
          )
        )
      })
    }).catch((err) => {
      next(
        new AppError(
          err.message || 'Some error occurred while updating the user.',
          200
        )
      )
    })
  }).catch((err) => {
    next(
      new AppError(
        err.message || 'Some error occurred while updating the user.',
        200
      )
    )
  })
};

exports.findOneByAnyColumn = (req, res, next) => {
  const { agencyId, email, name, orgUrl } = req.body;
  let condition = '';

  switch (Object.keys(req.body)[0]) {
    case 'name':
      condition = name ? { name: name } : null;
      break;
    case 'agencyId':
      condition = agencyId ? { agencyId: agencyId } : null;
      break;
    case 'email':
      condition = email ? { email: email } : null;
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
    Agency.findOne({ where: condition })
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

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const foundItem = await db.user.findOne({ where: {  email: email, password: password  } });
    if (!foundItem) {
      db.user.create({
        firstName: '',
        lastName: '',
        userName: '',
        email,
        password: '',
        userStatus: 'NEW',
        agencyAgencyId: '',
        organizationOrgId: ''
      })
        .then((userData) => {
          res.send({
            status: 'success',
            data: {
              agencyId: '',
              userId: userData.userId,
              orgId: '',
              role:[]
            }
          })
        }).catch((err) => {
          res.send({
            message: err.message
          })
        })
    } else {
      const roleInfo = await db.team.findAll({
        where: {
          userUserId: foundItem.userId
        }
      })
      if(roleInfo.length){
        res.send({
          status: 'success',
          data: {
            agencyId: foundItem.agencyAgencyId,
            userId: foundItem.userId,
            orgId: foundItem.organizationOrgId,
            role: roleInfo
            // orgId:roleInfo.map(function(a) {return a.organizationOrgId;}),
            // role: roleInfo.map(function(a) {return a.roleRoleId;})
          }
        })
      }else {
        res.send({
          status: 'success',
          data: {
            agencyId: foundItem.agencyAgencyId,
            userId: foundItem.userId,
            orgId: foundItem.organizationOrgId,
            role: []
          }
        })
      }
      
    }
  } catch (err) {
    next(new AppError(err.message, 200));
  }
};

exports.getTeamDetails = (req, res, next) => {
  const { agencyId } = req.body;
  User.findAll({ where: {agencyAgencyId: agencyId}}, {
    attributes: [
      'userId',
      'userName',
      'firstName',
      'lastName',
      'email',
      'userStatus',
      'organizationOrgId'
    ],
        include: [
          { model: Role, as: 'role', attributes: ['roleName', 'level'] },
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
      next(new AppError(`Error retrieving Organization`, 500));
    });
};

exports.updateAgencyDetails = async (req, res, next) => {
  const { agencyId } = req.body;
  try {
    const foundItem = await db.agency.findOne({ where: { agencyId } });
    if (!foundItem) {
      next(new AppError('No Record Found', 200));
    } else {
      try {
        const updateRecord = await db.agency.update(
          req.body,
          {
            returning: true,
            where: { agencyId }
          });
        res.send({
          status: 'success',
          message: 'Agency Updated Succesfully',
        });
      } catch (err) {
        next(new AppError(err.message, 200));
      }
    }
  } catch (err) {
    next(new AppError(err.message, 200));
  }
};

 exports.createTeamDetails = (req, res, next) => {
  const {
    firstName,
    lastName,
    userName,
    password,
    email,
    userStatus,
    agencyId,
    orgId,
  } = req.body;

  User.create({
    firstName,
    lastName,
    userName,
    email,
    password,
    userStatus,
    agencyAgencyId: agencyId,
    organizationOrgId: orgId
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

exports.updateAgencyEmpDetails = async (req, res, next) => {
  const { userId, agencyId } = req.body;
  try {
    const foundItem = await User.findOne({ where: { userId: userId, agencyAgencyId: agencyId } });
    const updatedItem = {};
    if (!foundItem) {
      next(new AppError('No Record Found', 200));
    } else {
      updatedItem.firstName = req.body.firstName || foundItem.firstName;
      updatedItem.lastName = req.body.lastName || foundItem.lastName;
      updatedItem.userName = req.body.userName || foundItem.userName
      updatedItem.password = req.body.password || foundItem.password
      updatedItem.userStatus = req.body.userStatus || foundItem.userStatus
      const updateRecord = await User.update(updatedItem, {
        where: { userId },
      });
      res.send({
        status: 'success',
        message: 'Agency Employee Updated Succesfully',
      });
    }
  }
  catch(err) {
    next(new AppError(err.message, 200));
  }
};

exports.deleteAgencyEmployeeDetails= async (req, res, next) => {
  try {
    const { userId, agencyId } = req.body;
    const userData = await User.findOne({ where: { userId: userId, agencyAgencyId: agencyId } });
    if (userData) {
      const deleteUser = await User.destroy( { where: {userId: userId, agencyAgencyId: agencyId} 
      }) 
      const deleteTeamMember =await Team.destroy( { where: {userUserId: userId, agencyAgencyId: agencyId} 
      }) 

      res.send({
        status: 'success',
        message: 'Agency Employee Deleted Succesfully',
      });
    }
  }
  catch(err){
    next(new AppError(err.message, 200));
  }
}

exports.deleteAgencydetails= async (req, res, next) => {
  try {
    const { agencyId } = req.body;
    const agencyData = await Agency.findOne({ where: { agencyId: agencyId } });
    if (agencyData) {
      const deleteAgency = await Agency.destroy( { where: {agencyId: agencyId} 
      }) 
     
      res.send({
        status: 'success',
        message: 'Agency  Deleted Succesfully',
      });
    }
  }
  catch(err){
    next(new AppError(err.message, 200));
  }
}

exports.getAgencyList = async ( req, res, next) => {
  Agency.findAll( {
    attributes: [
      'agencyId',
      'name',
      'email',
      'description'
    ]
     
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
      next(new AppError(`Error retrieving Organization`, 500));
    });
};