/**
 * @author [Pradeep]
 * @email [pradeep@promulgateinnovation.com]
 * @create date 2021-03-02 00:05:57
 * @modify date 2021-03-02 00:05:57
 * @desc [Routing for Agency]
 */

const express = require('express');
const organizationController = require('../controllers/organizationController');
const agencyController = require('../controllers/agencyController');

const router = express.Router();

/**
 * @swagger
 * /api/v1/agency/saveAgencyDetails:
 *   post:
 *     summary: Create an agency and update user and team data
 *     description: This endpoint allows a user to create an agency, update their role, and add them to a team.
 *     tags:
 *       - Agency
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the agency
 *                 example: "Example Agency"
 *               description:
 *                 type: string
 *                 description: Description of the agency
 *                 example: "A leading agency providing top-notch services."
 *               email:
 *                 type: string
 *                 description: Email of the agency
 *                 example: "info@\example.com"
 *               userId:
 *                 type: integer
 *                 description: ID of the user creating the agency
 *                 example: 123
 *     responses:
 *       200:
 *         description: Agency created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     agencyId:
 *                       type: integer
 *                       example: 1
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router
  .route('/api/v1/agency/saveAgencyDetails')
  .post(agencyController.createAgencyDetails);

/**
 * @swagger
 * /api/v1/agency/getAgencyDetails:
 *   post:
 *     summary: Retrieve an agency by a specific column
 *     description: Fetches a single agency based on one of the provided fields: `agencyId`, `email`, `name`, or `orgUrl`.
 *     tags:
 *       - Agency
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               agencyId:
 *                 type: integer
 *                 description: ID of the agency.
 *                 example: 1
 *               email:
 *                 type: string
 *                 description: Email of the agency.
 *                 example: "agency@\example.com"
 *               name:
 *                 type: string
 *                 description: Name of the agency.
 *                 example: "Example Agency"
 *               orgUrl:
 *                 type: string
 *                 description: URL of the organization.
 *                 example: "https://example.com"
 *     responses:
 *       200:
 *         description: Successfully retrieved the agency
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     agencyId:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Example Agency"
 *                     email:
 *                       type: string
 *                       example: "agency@\example.com"
 *                     orgUrl:
 *                       type: string
 *                       example: "https://example.com"
 *       400:
 *         description: Invalid request parameters
 *       404:
 *         description: No record found
 *       500:
 *         description: Internal server error
 */
router
  .route('/api/v1/agency/getAgencyDetails')
  .post(agencyController.findOneByAnyColumn);

/**
 * @swagger
 * /api/v1/agency/login:
 *   post:
 *     summary: Handle user login or create a new user
 *     description: Checks if a user exists by email. If the user does not exist, it creates a new user with a `NEW` status. If the user exists, it retrieves the user's roles.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email address of the user.
 *                 example: "user@\example.com"
 *     responses:
 *       200:
 *         description: Successful login or user creation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     agencyId:
 *                       type: string
 *                       description: ID of the associated agency.
 *                       example: ""
 *                     userId:
 *                       type: integer
 *                       description: ID of the user.
 *                       example: 123
 *                     orgId:
 *                       type: string
 *                       description: ID of the associated organization.
 *                       example: ""
 *                     role:
 *                       type: array
 *                       description: List of roles associated with the user.
 *                       items:
 *                         type: object
 *                         properties:
 *                           roleId:
 *                             type: integer
 *                             example: 5
 *                           organizationOrgId:
 *                             type: string
 *                             example: "org123"
 *       400:
 *         description: Invalid request parameters
 *       500:
 *         description: Internal server error
 */
router.route('/api/v1/agency/login').post(agencyController.login);

/**
 * @swagger
 * /api/v1/agency/saveAgencyTeamDetails:
 *   post:
 *     summary: Create a new team member
 *     description: Creates a new user and associates them with an agency and organization.
 *     tags:
 *       - Team
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: First name of the user.
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 description: Last name of the user.
 *                 example: "Doe"
 *               userName:
 *                 type: string
 *                 description: Username for the user.
 *                 example: "johndoe"
 *               password:
 *                 type: string
 *                 description: Password for the user.
 *                 example: "securepassword123"
 *               email:
 *                 type: string
 *                 description: Email address of the user.
 *                 example: "johndoe@example.com"
 *               userStatus:
 *                 type: string
 *                 description: Status of the user (e.g., Active, Inactive).
 *                 example: "Active"
 *               agencyId:
 *                 type: integer
 *                 description: ID of the agency to associate the user with.
 *                 example: 123
 *               orgId:
 *                 type: integer
 *                 description: ID of the organization to associate the user with.
 *                 example: 456
 *     responses:
 *       200:
 *         description: Successfully created a new team member
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: integer
 *                       description: ID of the newly created user.
 *                       example: 789
 *       400:
 *         description: Invalid request parameters
 *       500:
 *         description: Internal server error
 */
router
  .route('/api/v1/agency/saveAgencyTeamDetails')
  .post(agencyController.createTeamDetails);

/**
 * @swagger
 * /api/v1/agency/getTeamDetails:
 *   post:
 *     summary: Retrieve team details for a specific agency
 *     description: Fetches all team members associated with a given agency ID, including user details and their roles.
 *     tags:
 *       - Agency
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               agencyId:
 *                 type: integer
 *                 description: ID of the agency whose team details are to be retrieved.
 *                 example: 123
 *     responses:
 *       200:
 *         description: Successfully retrieved team details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userName:
 *                         type: string
 *                         example: "john_doe"
 *                       firstName:
 *                         type: string
 *                         example: "John"
 *                       lastName:
 *                         type: string
 *                         example: "Doe"
 *                       email:
 *                         type: string
 *                         example: "john.doe@\example.com"
 *                       userStatus:
 *                         type: string
 *                         example: "Active"
 *                       organizationOrgId:
 *                         type: string
 *                         example: "org123"
 *                       role:
 *                         type: object
 *                         properties:
 *                           roleName:
 *                             type: string
 *                             example: "Manager"
 *                           level:
 *                             type: integer
 *                             example: 2
 *       404:
 *         description: No records found for the given agency ID
 *       500:
 *         description: Internal server error
 */
router
  .route('/api/v1/agency/getTeamDetails')
  .post(agencyController.getTeamDetails);

/**
 * @swagger
 * /api/v1/agency/updateAgencyDetails:
 *   tags:
 *       - Agency
 *   put:
 *     summary: Update agency details
 *     description: Updates the details of an agency based on the provided `agencyId`. If the agency is not found, an error message is returned.
 *     tags:
 *       - Agency
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               agencyId:
 *                 type: integer
 *                 description: ID of the agency to be updated.
 *                 example: 123
 *               name:
 *                 type: string
 *                 description: Updated name of the agency.
 *                 example: "Updated Agency Name"
 *               description:
 *                 type: string
 *                 description: Updated description of the agency.
 *                 example: "This is an updated description."
 *               email:
 *                 type: string
 *                 description: Updated email of the agency.
 *                 example: "updated@\example.com"
 *     responses:
 *       200:
 *         description: Successfully updated the agency
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: "Agency Updated Successfully"
 *       404:
 *         description: Agency not found
 *       500:
 *         description: Internal server error
 */
router
  .route('/api/v1/agency/updateAgencyDetails')
  .post(agencyController.updateAgencyDetails);

/**
 * @swagger
 * /api/v1/agency/getOrgLists:
 *   tags:
 *       - Agency
 *   post:
 *     summary: Retrieves the list of organizations for a specific user and agency.
 *     description: This endpoint retrieves all organizations associated with a given agency and where the specified user is part of the team.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               agencyId:
 *                 type: integer
 *                 description: The ID of the agency the organizations belong to.
 *                 example: 101
 *               userId:
 *                 type: integer
 *                 description: The ID of the user whose organizations are being retrieved.
 *                 example: 1001
 *     responses:
 *       200:
 *         description: A list of organizations associated with the specified agency and user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: 'success'
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         description: The name of the organization.
 *                         example: 'Tech Solutions'
 *                       orgId:
 *                         type: integer
 *                         description: The ID of the organization.
 *                         example: 201
 *       500:
 *         description: Internal server error if an unexpected issue occurs.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: 'error'
 *                 message:
 *                   type: string
 *                   example: 'Error retrieving organizations.'
 */
router
  .route('/api/v1/agency/getOrgLists')
  .post(organizationController.getOrganizationLists);

/**
 * @swagger
 * /api/v1/agency/updateAgencyEmpDetails:
 *    tags:
 *       - Agency
 *   put:
 *     summary: Update an agency employee's details
 *     description: Updates the details of an agency employee identified by `userId` and `agencyId`. Fields that are not provided in the request will retain their current values.
 *     tags:
 *       - Agency
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID of the user to be updated.
 *                 example: 123
 *               agencyId:
 *                 type: integer
 *                 description: ID of the agency the user belongs to.
 *                 example: 456
 *               firstName:
 *                 type: string
 *                 description: Updated first name of the employee.
 *                 example: "Jane"
 *               lastName:
 *                 type: string
 *                 description: Updated last name of the employee.
 *                 example: "Doe"
 *               userName:
 *                 type: string
 *                 description: Updated username for the employee.
 *                 example: "janedoe"
 *               password:
 *                 type: string
 *                 description: Updated password for the employee.
 *                 example: "newpassword123"
 *               userStatus:
 *                 type: string
 *                 description: Updated status of the employee (e.g., Active, Inactive).
 *                 example: "Active"
 *     responses:
 *       200:
 *         description: Successfully updated the employee's details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: "Agency Employee Updated Successfully"
 *       404:
 *         description: No record found for the given `userId` and `agencyId`.
 *       500:
 *         description: Internal server error
 */
router
  .route('/api/v1/agency/updateAgencyEmpDetails')
  .post(agencyController.updateAgencyEmpDetails);

/**
 * @swagger
 * /api/v1/deleteAgencyEmployeeDetails:
 *   tags:
 *       - Agency
 *   delete:
 *     summary: Delete an agency employee
 *     description: Deletes an employee and their team membership based on the provided `userId` and `agencyId`.
 *     tags:
 *       - Agency
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID of the user to be deleted.
 *                 example: 123
 *               agencyId:
 *                 type: integer
 *                 description: ID of the agency the user belongs to.
 *                 example: 456
 *     responses:
 *       200:
 *         description: Successfully deleted the employee and their team membership
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: "Agency Employee Deleted Successfully"
 *       404:
 *         description: No record found for the given `userId` and `agencyId`.
 *       500:
 *         description: Internal server error
 */
router
  .route('/api/v1/deleteAgencyEmployeeDetails')
  .delete(agencyController.deleteAgencyEmployeeDetails);

/**
 * @swagger
 * /api/v1/agency/deleteAgencydetails:
 *   tags:
 *       - Agency
 *   post:
 *     summary: Delete an agency by ID
 *     tags:
 *       - Agency
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - agencyId
 *             properties:
 *               agencyId:
 *                 type: string
 *                 description: The unique ID of the agency to delete.
 *                 example: "12345"
 *     responses:
 *       200:
 *         description: Agency deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Agency deleted successfully
 *       400:
 *         description: Agency ID is missing from the request body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Agency ID is required
 *       404:
 *         description: Agency not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Agency not found
 *       500:
 *         description: Unexpected server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router
  .route('/api/v1/agency/deleteAgencydetails')
  .post(agencyController.deleteAgencydetails);

/**
 * @swagger
 * /api/v1/agency/getAgencyList:
 *   tags:
 *       - Agency
 *   get:
 *     summary: Retrieve a list of all agencies
 *     tags:
 *       - Agency
 *     responses:
 *       200:
 *         description: A list of agencies was successfully retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       agencyId:
 *                         type: string
 *                         description: Unique ID of the agency.
 *                         example: "12345"
 *                       name:
 *                         type: string
 *                         description: Name of the agency.
 *                         example: "ABC Agency"
 *                       email:
 *                         type: string
 *                         description: Email of the agency.
 *                         example: "contact@abcagency.com"
 *                       description:
 *                         type: string
 *                         description: Brief description of the agency.
 *                         example: "Leading marketing agency."
 *       404:
 *         description: No records found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: No Record Found
 *       500:
 *         description: Unexpected server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Error retrieving Organization
 */
router
  .route('/api/v1/agency/getAgencyList')
  .get(agencyController.getAgencyList);

module.exports = router;
