/**
 * @author [Pradeep]
 * @email [pradeep@promulgateinnovation.com]
 * @create date 2021-03-02 00:05:57
 * @modify date 2021-03-02 00:05:57
 * @desc [Routing for Organaization]
 */

const express = require('express');
const organizationController = require('../controllers/organizationController');
const agencyController = require('../controllers/agencyController');

const router = express.Router();

/**
 * @swagger
 * /api/v1/getOrgDetails:
 *   post:
 *     summary: Checks the request body for required fields.
 *     description: This endpoint checks if the request body contains at least one of the following fields: `name`, `aliasName`, `orgUrl`, or `orgId`. If none are present, it returns an error message.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the organization.
 *                 example: "My Organization"
 *               aliasName:
 *                 type: string
 *                 description: An alias for the organization.
 *                 example: "MyOrg"
 *               orgUrl:
 *                 type: string
 *                 description: The organization's website URL.
 *                 example: "https://www.example.com"
 *               orgId:
 *                 type: integer
 *                 description: The unique identifier of the organization.
 *                 example: 123
 *     responses:
 *       200:
 *         description: The request body is valid.
 *       400:
 *         description: Missing required fields in the request body.
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
 *                   example: 'Missing OrgName or AliasName1 or Url'
 *       500:
 *         description: Internal server error while processing the request.
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
 *                   example: 'An error occurred.'
 */

/**
 * @swagger
 * /api/v1/getOrgDetails:
 *   post:
 *     summary: Retrieves an organization based on `orgId`, `name`, `aliasName`, or `orgUrl`.
 *     description: This endpoint allows you to search for an organization by providing one of the following parameters in the request body: `orgId`, `name`, `aliasName`, or `orgUrl`.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orgId:
 *                 type: integer
 *                 description: The unique identifier of the organization.
 *                 example: 123
 *               aliasName:
 *                 type: string
 *                 description: The alias name of the organization.
 *                 example: 'ExampleOrg'
 *               name:
 *                 type: string
 *                 description: The name of the organization.
 *                 example: 'Example Organization'
 *               orgUrl:
 *                 type: string
 *                 description: The URL of the organization's website.
 *                 example: 'https://example.org'
 *     responses:
 *       200:
 *         description: Successfully retrieved the organization details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: 'success'
 *                 data:
 *                   type: object
 *                   description: The organization details.
 *                   properties:
 *                     orgId:
 *                       type: integer
 *                       example: 123
 *                     name:
 *                       type: string
 *                       example: 'Example Organization'
 *                     aliasName:
 *                       type: string
 *                       example: 'ExampleOrg'
 *                     orgUrl:
 *                       type: string
 *                       example: 'https://example.org'
 *       400:
 *         description: Bad request if none of the required fields (`orgId`, `name`, `aliasName`, or `orgUrl`) are provided.
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
 *                   example: 'Please provide Org_id or name or Alias Name to retrieve data'
 *       404:
 *         description: Not Found if no organization is found for the provided criteria.
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
 *                   example: 'No Record Found'
 *       500:
 *         description: Internal server error when retrieving the organization.
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
 *                   example: 'Error retrieving Organization'
 */
router
  .route('/api/v1/getOrgDetails')
  .post(
    organizationController.checkGetBody,
    organizationController.findOneByAnyColumn
  );

/**
 * @swagger
 * /api/v1/getNewConnectionDetails:
 *   post:
 *     summary: Fetches the details of a social media connection for an organization.
 *     description: This endpoint retrieves the details of a social media connection (such as WhatsApp, Facebook) associated with an organization using the provided `orgId` and social media platform name (`from`).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orgId:
 *                 type: integer
 *                 description: The ID of the organization for which the social media connection is being fetched.
 *                 example: 1
 *               from:
 *                 type: string
 *                 description: The name of the social media platform (e.g., "WhatsApp", "Facebook").
 *                 example: "WhatsApp"
 *     responses:
 *       200:
 *         description: Successfully fetched the social media connection details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: 'success'
 *                 data:
 *                   type: object
 *                   description: The social media connection details.
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: 'WhatsApp'
 *                     socialMediaType:
 *                       type: string
 *                       example: 'PAID'
 *                     socialMediaHandle:
 *                       type: string
 *                       example: '1234567890:business_account'
 *                     status:
 *                       type: string
 *                       example: 'ACTIVE'
 *       404:
 *         description: No record found for the specified organization and social media platform.
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
 *                   example: 'No Record Found'
 *       500:
 *         description: Internal server error while retrieving the connection details.
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
 *                   example: 'Error retrieving connection details'
 */
router
  .route('/api/v1/getNewConnectionDetails')
  .post(organizationController.getNewConnectionDetails);

/**
 * @swagger
 * /api/v1/updateWhatsappDetails:
 *   put:
 *     summary: Updates an existing WhatsApp connection for the specified organization.
 *     description: This endpoint allows you to update the social media handle and URL associated with a WhatsApp connection using the provided `whatsapp_connection_id`.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               whatsapp_connection_id:
 *                 type: integer
 *                 description: The ID of the WhatsApp connection to update.
 *                 example: 123
 *               phone_number_id:
 *                 type: string
 *                 description: The phone number ID of the WhatsApp account.
 *                 example: "9876543210"
 *               Whatsapp_busines_account_id:
 *                 type: string
 *                 description: The business account ID associated with the WhatsApp account.
 *                 example: "whatsapp_business_account_123"
 *     responses:
 *       200:
 *         description: Successfully updated the WhatsApp connection.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: 'success'
 *                 message:
 *                   type: string
 *                   example: 'WhatsApp Connection Updated Successfully'
 *       404:
 *         description: No record found for the specified WhatsApp connection ID.
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
 *                   example: 'No Record Found'
 *       500:
 *         description: Internal server error while updating the WhatsApp connection.
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
 *                   example: 'Error updating WhatsApp connection'
 */
router
  .route('/api/v1/updateWhatsappDetails')
  .post(organizationController.updateWhatsappDetails);

/**
 * @swagger
 * /api/v1/saveOrgDetails:
 *   post:
 *     summary: Checks the request body for required fields.
 *     description: This endpoint checks if the request body contains the fields `name`, `aliasName`, and `orgUrl`. If any of these are missing, it returns an error message.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the organization.
 *                 example: "My Organization"
 *               aliasName:
 *                 type: string
 *                 description: An alias for the organization.
 *                 example: "MyOrg"
 *               orgUrl:
 *                 type: string
 *                 description: The organization's website URL.
 *                 example: "https://www.example.com"
 *     responses:
 *       200:
 *         description: The request body is valid.
 *       400:
 *         description: Missing required fields in the request body.
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
 *                   example: 'Missing OrgName or AliasName or Url'
 *       500:
 *         description: Internal server error while processing the request.
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
 *                   example: 'An error occurred.'
 */

/**
 * @swagger
 * /api/v1/saveOrgDetails:
 *   post:
 *     summary: Creates a new organization and assigns a user to it.
 *     description: This endpoint creates a new organization and assigns the specified user to the organization as a member with a role. The organization details and user information are provided in the request body.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the organization.
 *                 example: "Tech Innovations"
 *               aliasName:
 *                 type: string
 *                 description: The alias name of the organization.
 *                 example: "TechInnov"
 *               orgUrl:
 *                 type: string
 *                 description: The URL of the organization's website.
 *                 example: "https://www.techinnovations.com"
 *               orgSmPolicy:
 *                 type: string
 *                 description: The social media policy of the organization.
 *                 example: "Follow the company guidelines for social media posts."
 *               orgStatus:
 *                 type: string
 *                 description: The status of the organization (e.g., active, inactive).
 *                 example: "active"
 *               agencyId:
 *                 type: integer
 *                 description: The ID of the agency associated with the organization.
 *                 example: 5
 *               userId:
 *                 type: integer
 *                 description: The ID of the user to be assigned to the organization.
 *                 example: 123
 *     responses:
 *       200:
 *         description: The organization was successfully created and the user was assigned to it.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: 'success'
 *                 data:
 *                   type: object
 *                   properties:
 *                     orgId:
 *                       type: integer
 *                       example: 10
 *       400:
 *         description: Missing required fields in the request body or invalid data.
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
 *                   example: 'Missing or invalid data.'
 *       500:
 *         description: Internal server error while creating the organization or assigning the user.
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
 *                   example: 'Some error occurred while creating the organization or assigning the user.'
 */
router
  .route('/api/v1/saveOrgDetails')
  .post(
    organizationController.checkPostBody,
    organizationController.createOrgDetails
  );

/**
 * @swagger
 * /api/v1/updateOrgDetails:
 *   post:
 *     summary: Updates the details of an organization.
 *     description: This endpoint allows you to update the details of an existing organization. You need to provide the `orgId` along with the fields to be updated.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orgId:
 *                 type: integer
 *                 description: The unique identifier of the organization.
 *                 example: 123
 *               name:
 *                 type: string
 *                 description: The name of the organization.
 *                 example: 'Updated Organization Name'
 *               aliasName:
 *                 type: string
 *                 description: The alias name of the organization.
 *                 example: 'Updated Alias'
 *               orgUrl:
 *                 type: string
 *                 description: The updated URL of the organization's website.
 *                 example: 'https://updated-org-url.com'
 *               orgSmPolicy:
 *                 type: string
 *                 description: The social media policy for the organization.
 *                 example: 'Updated Policy'
 *               orgStatus:
 *                 type: string
 *                 description: The current status of the organization.
 *                 example: 'Active'
 *     responses:
 *       200:
 *         description: Successfully updated the organization details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: 'success'
 *                 message:
 *                   type: string
 *                   example: 'Organization Updated Successfully'
 *       400:
 *         description: Bad request if `orgId` is missing or the update operation fails.
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
 *                   example: 'No Record Found'
 *       500:
 *         description: Internal server error if there is an error during the update process.
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
 *                   example: 'Error updating Organization'
 */
router
  .route('/api/v1/updateOrgDetails')
  .post(organizationController.updateOrgDetails);

/**
 * @swagger
 * /api/v1/saveWhatsappDetails:
 *   post:
 *     summary: Creates a WhatsApp connection and adds it to the database.
 *     description: This endpoint saves the WhatsApp connection details, including the phone number and business account ID, and creates the associated social media page with the connection credentials.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumberId:
 *                 type: string
 *                 description: The phone number ID associated with the WhatsApp account.
 *                 example: "1234567890"
 *               whatsappBusinesAccountId:
 *                 type: string
 *                 description: The WhatsApp business account ID.
 *                 example: "business_account_id"
 *               orgId:
 *                 type: integer
 *                 description: The ID of the organization to which the WhatsApp account is associated.
 *                 example: 10
 *     responses:
 *       200:
 *         description: The WhatsApp connection was successfully created and added.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: 'success'
 *                 message:
 *                   type: string
 *                   example: 'WhatsApp Connection Added Successfully'
 *       400:
 *         description: Missing or invalid data in the request body.
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
 *                   example: 'Missing or invalid data.'
 *       500:
 *         description: Internal server error while creating the WhatsApp connection.
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
 *                   example: 'Some error occurred while creating the WhatsApp connection.'
 */
router
  .route('/api/v1/saveWhatsappDetails')
  .post(organizationController.createWhatsappDetails);

/**
 * @swagger
 * /api/v1/createNewConnectionDetails:
 *   post:
 *     summary: Creates a new Google Reviews connection for the specified organization.
 *     description: This endpoint allows you to create a new Google Reviews connection by providing the Google Place Name and Google Place ID along with the organization ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               form_source:
 *                 type: string
 *                 description: The source of the connection, must be 'connect_google_reviews' to create a Google Reviews connection.
 *                 example: 'connect_google_reviews'
 *               googlePlaceName:
 *                 type: string
 *                 description: The name of the Google Place (location) associated with the reviews.
 *                 example: 'Example Place Name'
 *               googlePlaceId:
 *                 type: string
 *                 description: The unique Google Place ID for the location.
 *                 example: 'ChIJN1t_tDeuEmsRUsoyG83frY4'
 *               orgId:
 *                 type: integer
 *                 description: The ID of the organization for which the Google Reviews connection is being created.
 *                 example: 123
 *     responses:
 *       200:
 *         description: Successfully created the Google Reviews connection.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: 'success'
 *                 message:
 *                   type: string
 *                   example: 'Google Review Connection Added Successfully'
 *       400:
 *         description: Bad request if the form source is not 'connect_google_reviews' or missing required fields.
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
 *                   example: 'Invalid form source or missing data.'
 *       500:
 *         description: Internal server error during the connection creation.
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
 *                   example: 'Some error occurred while creating the Google Review Connection.'
 */
router
  .route('/api/v1/createNewConnectionDetails')
  .post(organizationController.createNewConnectionDetails);

/**
 * @swagger
 * /api/v1/updateNewConnectionDetails:
 *   post:
 *     summary: Updates an existing Google Reviews connection.
 *     description: This endpoint allows you to update an existing Google Reviews connection by providing the connection ID, Google Place Name, and Google Place ID along with the form source.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               google_reviews_connection_id:
 *                 type: integer
 *                 description: The unique ID of the Google Reviews connection to be updated.
 *                 example: 123
 *               form_source:
 *                 type: string
 *                 description: The source of the connection, must be 'connect_google_reviews' to update a Google Reviews connection.
 *                 example: 'connect_google_reviews'
 *               googlePlaceName:
 *                 type: string
 *                 description: The name of the Google Place (location) associated with the reviews.
 *                 example: 'Example Place Name'
 *               googlePlaceId:
 *                 type: string
 *                 description: The unique Google Place ID for the location.
 *                 example: 'ChIJN1t_tDeuEmsRUsoyG83frY4'
 *     responses:
 *       200:
 *         description: Successfully updated the Google Reviews connection.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: 'success'
 *                 message:
 *                   type: string
 *                   example: 'Google Reviews Connection Updated Successfully'
 *       400:
 *         description: Bad request if the form source is not 'connect_google_reviews' or missing required fields.
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
 *                   example: 'Invalid form source or missing data.'
 *       404:
 *         description: Not Found if the specified Google Reviews connection does not exist.
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
 *                   example: 'No Record Found'
 *       500:
 *         description: Internal server error during the update process.
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
 *                   example: 'Some error occurred while updating the Google Reviews Connection.'
 */
router
  .route('/api/v1/updateNewConnectionDetails')
  .post(organizationController.updateNewConnectionDetails);


/**
 * @swagger
 * /api/v1/login:
 *   post:
 *     summary: Logs in a user or creates a new user if they do not exist.
 *     description: This endpoint checks if the user exists by their email. If the user exists, their information is returned. If the user does not exist, a new user is created and the information is returned.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address of the user attempting to log in.
 *                 example: 'user@example.com'
 *     responses:
 *       200:
 *         description: Successfully logged in or created a new user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: 'success'
 *                 data:
 *                   type: object
 *                   properties:
 *                     orgId:
 *                       type: integer
 *                       description: The ID of the organization the user belongs to, or null if the user has no organization.
 *                       example: null
 *                     userId:
 *                       type: integer
 *                       description: The unique ID of the user.
 *                       example: 123
 *                     roleId:
 *                       type: integer
 *                       description: The role ID of the user.
 *                       example: 1
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
 *                   example: 'Internal server error'
 */
router.route('/api/v1/login').post(organizationController.login);


router.route('/api/v1/getOrgListbyAgencyID').post(organizationController.getOrganizationListsbyAgyID);

module.exports = router;
