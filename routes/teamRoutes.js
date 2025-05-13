/**
 * @author [Pradeep]
 * @email [pradeep@promulgateinnovation.com]
 * @create date 2021-03-02 18:44:59
 * @modify date 2021-03-02 18:44:59
 * @desc [Routing for Team]
 */

/**
 * @swagger
 * /sample:
 *   get:
 *     summary: Returns a sample message
 *     responses:
 *       200:
 *         description: A successful response
 */

const express = require("express");
const teamController = require("../controllers/teamController");
const router = express.Router();

/**
 * @swagger
 * /api/v1/getTeamDetails:
 *  tags:
 *       - Employee
 *   post:
 *     summary: Retrieves team details for an organization.
 *     description: This endpoint fetches team details for a specific organization, including associated roles and user details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orgId:
 *                 type: string
 *                 example: "12345"
 *     responses:
 *       200:
 *         description: Successfully retrieved the team details.
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
 *                   properties:
 *                     organizationId:
 *                       type: string
 *                       example: "12345"
 *                     teams:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           teamId:
 *                             type: string
 *                             example: "team1"
 *                           role:
 *                             type: object
 *                             properties:
 *                               roleName:
 *                                 type: string
 *                                 example: "Developer"
 *                               level:
 *                                 type: string
 *                                 example: "1"
 *                           user:
 *                             type: object
 *                             properties:
 *                               userName:
 *                                 type: string
 *                                 example: "john_doe"
 *                               firstName:
 *                                 type: string
 *                                 example: "John"
 *                               lastName:
 *                                 type: string
 *                                 example: "Doe"
 *                               email:
 *                                 type: string
 *                                 example: "john.doe@example.com"
 *                               userStatus:
 *                                 type: string
 *                                 example: "Active"
 *       404:
 *         description: No record found for the provided organization ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No Record Found"
 *       500:
 *         description: Server error when retrieving the organization.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error retrieving Organization"
 */
router
  .route("/api/v1/getTeamDetails")
  .post(teamController.checkGetBody, teamController.getTeamDetails);

/**
 * @swagger
 * /api/v1/saveTeamDetails:
 *  tags:
 *       - Employee
 *   post:
 *     summary: Creates a new team for the organization.
 *     description: This endpoint creates a new team by assigning a user to a team within an organization with the specified role and agency.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "user123"
 *               orgId:
 *                 type: string
 *                 example: "org123"
 *               roleId:
 *                 type: string
 *                 example: "role123"
 *               agencyId:
 *                 type: string
 *                 example: "agency123"
 *     responses:
 *       200:
 *         description: Successfully created the team and assigned the user to the team.
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
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: "user123"
 *       400:
 *         description: Bad request, missing or invalid data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Some error occurred while creating the User."
 *       500:
 *         description: Server error during the creation of the team.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Some error occurred while creating the User."
 */
router.route("/api/v1/saveTeamDetails").post(teamController.createTeamDetails);

/**
 * @swagger
 * /api/v1/updateTeamDetails:
 *  tags:
 *       - Employee
 *   post:
 *     summary: Updates team member details.
 *     description: This endpoint updates the details of a user (team member) within an organization based on either the provided email or organization ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               orgId:
 *                 type: string
 *                 example: "org123"
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               userName:
 *                 type: string
 *                 example: "john.doe"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               userStatus:
 *                 type: string
 *                 example: "active"
 *               roleId:
 *                 type: string
 *                 example: "role123"
 *     responses:
 *       200:
 *         description: Successfully updated the user details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "User Updated Successfully"
 *       400:
 *         description: Bad request, missing or invalid data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No Record Found"
 *       500:
 *         description: Server error during the update process.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error occurred while updating the user details."
 */
router
  .route("/api/v1/updateTeamDetails")
  .post(teamController.updateTeamDetails);

/**
 * @swagger
 * /api/v1/deleteTeamMember:
 *  tags:
 *       - Employee
 *   post:
 *     summary: Deletes a team member from an organization.
 *     description: This endpoint deletes a user from the team based on either the provided email or organization ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               orgId:
 *                 type: string
 *                 example: "org123"
 *     responses:
 *       200:
 *         description: Successfully deleted the team member.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "User Deleted Successfully"
 *       400:
 *         description: Bad request, missing or invalid data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No Record Found"
 *       500:
 *         description: Server error during the deletion process.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error occurred while deleting the user."
 */
router.route("/api/v1/deleteTeamMember").post(teamController.deleteTeamMember);

/**
 * @swagger
 * /api/v1/getEmpDetailbyEmpID
 *   Post:
 *     summary: Retrieve employee details by user ID
 *     description: Fetches the details of an employee using their user ID.
 *     tags:
 *       - Employee
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user.
 *                 example: "12345"
 *     responses:
 *       200:
 *         description: Successfully retrieved employee details.
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
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     userStatus:
 *                       type: string
 *       404:
 *         description: User not found.
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
 *                   example: User not found
 *       500:
 *         description: Internal server error.
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
  .route("/api/v1/getEmpDetailbyEmpID")
  .post(teamController.getEmpDetailbyEmpID);

module.exports = router;
