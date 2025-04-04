/**
 * @author [Pradeep]
 * @email [pradeep@promulgateinnovation.com]
 * @create date 2021-03-02 18:46:24
 * @modify date 2021-03-02 18:46:24
 * @desc [Helper functions for Team related task]
 */
const AppError = require('../utils/appError');
const db = require('../models');
const Role = db.role;


exports.checkPostBody = (req, res, next) => {
  if (!req.body.roleName || !req.body.level) {
    next(new AppError('Missing Rolename or Role level', 200));
  }
  next();
};

exports.createRoles = (req, res, next) => {
  const { roleName, level } = req.body;

  Role.create({
    roleName,
    level,
  })
    .then((roleData) => {
      res.send({
        status: 'success',
        data: roleData,
      });
    })
    .catch((err) => {
      next(
        new AppError(
          err.message || 'Some error occurred while creating the role.',
          200
        )
      );
    });
};

exports.getRoles = (req, res, next) => {

  const { orgId } = req.body

  Role.findAll({
    orgId
  })
    .then((roleData) => {
      res.send({
        status: 'success',
        data: roleData,
      });
    })
    .catch((err) => {
      next(
        new AppError(
          err.message || 'Some error occurred while getting the role.',
          200
        )
      );
    });
};
