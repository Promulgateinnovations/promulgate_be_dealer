/**
 * @author [Pradeep]
 * @email [pradeep@promulgateinnovation.com]
 * @create date 2021-03-02 18:44:59
 * @modify date 2021-03-02 18:44:59
 * @desc [Routing for Role]
 */

const express = require('express');
const roleController = require('../controllers/roleController');
const router = express.Router();

/**
 * @swagger
 * /api/v1/saveRoles:
 *   post:
 *     summary: Validates the presence of `roleName` and `level` in the request body.
 *     description: This endpoint checks if both `roleName` and `level` parameters are present in the request body. If either of them is missing, it returns an error.
 *     parameters:
 *       - in: body
 *         name: body
 *         description: The body of the request containing the `roleName` and `level`.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             roleName:
 *               type: string
 *               description: The name of the role.
 *               example: "Admin"
 *             level:
 *               type: string
 *               description: The level of the role (e.g., "Junior", "Senior").
 *               example: "Senior"
 *     responses:
 *       200:
 *         description: Request is valid with both `roleName` and `level` provided.
 *       400:
 *         description: Missing `roleName` or `level` in the request body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Missing Rolename or Role level"
 */


/**
 * @swagger
 * /api/v1/saveRoles:
 *   post:
 *     summary: Creates a new role.
 *     description: This endpoint allows you to create a new role by providing a `roleName` and a `level`.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roleName:
 *                 type: string
 *                 description: The name of the role to be created.
 *                 example: "Admin"
 *               level:
 *                 type: string
 *                 description: The level associated with the role (e.g., "Junior", "Senior").
 *                 example: "Senior"
 *     responses:
 *       200:
 *         description: The role was successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   description: The created role data.
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: The ID of the created role.
 *                       example: 1
 *                     roleName:
 *                       type: string
 *                       description: The name of the created role.
 *                       example: "Admin"
 *                     level:
 *                       type: string
 *                       description: The level of the created role.
 *                       example: "Senior"
 *       400:
 *         description: Missing or invalid `roleName` or `level` in the request body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Missing or invalid roleName or level"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Some error occurred while creating the role."
 */
router
  .route('/api/v1/saveRoles')
  .post(roleController.checkPostBody, roleController.createRoles);

/**
 * @swagger
 * /api/v1/getRoles:
 *   get:
 *     summary: Retrieves roles for a specific organization.
 *     description: This endpoint retrieves a list of roles associated with a given organization `orgId`.
 *     parameters:
 *       - in: body
 *         name: orgId
 *         description: The organization ID to filter the roles.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             orgId:
 *               type: string
 *               description: The ID of the organization for which roles are being retrieved.
 *               example: "12345"
 *     responses:
 *       200:
 *         description: A list of roles for the specified organization was successfully retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: array
 *                   description: A list of roles associated with the organization.
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The ID of the role.
 *                         example: 1
 *                       roleName:
 *                         type: string
 *                         description: The name of the role.
 *                         example: "Admin"
 *                       level:
 *                         type: string
 *                         description: The level of the role.
 *                         example: "Senior"
 *       400:
 *         description: Missing or invalid `orgId` in the request body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Missing or invalid orgId"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Some error occurred while getting the roles."
 */
router
  .route('/api/v1/getRoles')
  .post(roleController.getRoles);

module.exports = router;
