/**
 * @author [Pradeep]
 * @email [pradeep@promulgateinnovation.com]
 * @create date 2021-03-02 18:44:59
 * @modify date 2021-03-02 18:44:59
 * @desc [Routing for campaign]
 */

const express = require('express');
const campaignController = require('../controllers/campaignController');
const campaignDefinitionController = require('../controllers/campaignDefinitionController');
const campaignContentController = require('../controllers/campaignContentController');
const campaignSelectionController = require('../controllers/campaignSelectionController');
const socialMediaConnectionController = require('../controllers/socailMediaConnectionController');
const campaignViewerController = require('../controllers/campaignViewerController');
const campaignCommentController = require('../controllers/campaignCommentsController');
const { route } = require('./orgRoutes');
const router = express.Router();

/**
 * @swagger
 * /api/v1/saveCampaignDefintion:
 *   post:
 *     summary: Middleware to check the request body
 *     description: This endpoint simply processes the request body by passing the request to the next middleware or handler.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               campaignDefinitionId:
 *                 type: integer
 *                 description: The ID of the campaign definition (example).
 *               someOtherField:
 *                 type: string
 *                 description: Some other field in the request body (example).
 *     responses:
 *       200:
 *         description: The request body was processed successfully and passed to the next handler.
 *       400:
 *         description: Bad request - the request body is missing or invalid.
 */

/**
 * @swagger
 * /api/v1/saveCampaignDefintion:
 *   post:
 *     summary: Create a new campaign definition
 *     description: This endpoint creates a new campaign definition with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the campaign.
 *               topic:
 *                 type: string
 *                 description: The topic of the campaign.
 *               videoUrl:
 *                 type: string
 *                 description: URL for the campaign video.
 *               influencers:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of influencers associated with the campaign.
 *               startAt:
 *                 type: string
 *                 format: date-time
 *                 description: The start date and time of the campaign.
 *               objective:
 *                 type: string
 *                 description: The objective of the campaign.
 *               endAt:
 *                 type: string
 *                 format: date-time
 *                 description: The end date and time of the campaign.
 *               totalAudience:
 *                 type: integer
 *                 description: The total expected audience for the campaign.
 *               status:
 *                 type: string
 *                 description: The status of the campaign (e.g., active, inactive).
 *               campaignTypes:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Types of the campaign (e.g., social media, email).
 *               captiveMembers:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of members who are part of the campaign.
 *               orgId:
 *                 type: string
 *                 description: The organization ID that is creating the campaign.
 *               userId:
 *                 type: string
 *                 description: The user ID of the person creating the campaign.
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Tags associated with the campaign.
 *     responses:
 *       200:
 *         description: Successfully created the campaign definition.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the response.
 *                 data:
 *                   type: object
 *                   description: The created campaign definition data.
 *       400:
 *         description: Bad request, invalid data or missing fields.
 *       500:
 *         description: Internal server error.
 */
router
  .route('/api/v1/saveCampaignDefintion')
  .post(
    campaignDefinitionController.checkPostBody,
    campaignDefinitionController.createCampaignDefintion
  );

/**
 * @swagger
 * /api/v1/getyoutTubeVideos:
 *   get:
 *     summary: Get YouTube videos for a specific organization
 *     description: This endpoint retrieves a list of YouTube videos for an organization using YouTube Hub credentials and the refresh token.
 *     parameters:
 *       - in: path
 *         name: orgId
 *         required: true
 *         description: The ID of the organization whose YouTube videos are requested.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved YouTube videos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Whether the request was successful.
 *                 videos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         description: The title of the YouTube video.
 *                       value:
 *                         type: string
 *                         description: The unique ID of the YouTube video.
 *                       url:
 *                         type: string
 *                         description: The URL of the YouTube video.
 *       400:
 *         description: Bad request, invalid organization ID or YouTube Hub credentials.
 *       500:
 *         description: Internal server error.
 */
router
  .route('/api/v1/getyoutTubeVideos')
  .post(
    campaignDefinitionController.getYoutubeVideos
  );

/**
 * @swagger
 * /api/v1/getYoutubeVideoDetails:
 *   post:
 *     summary: Get details of a specific YouTube video
 *     description: This endpoint retrieves details of a specific YouTube video by its ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orgId:
 *                 type: string
 *                 description: The ID of the organization.
 *               youtubeId:
 *                 type: string
 *                 description: The ID of the YouTube video to fetch details for.
 *     responses:
 *       200:
 *         description: Successfully retrieved YouTube video details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful.
 *                 videos:
 *                   type: object
 *                   description: The details of the YouTube video.
 *                   properties:
 *                     snippet:
 *                       type: object
 *                       properties:
 *                         title:
 *                           type: string
 *                           description: The title of the YouTube video.
 *                         description:
 *                           type: string
 *                           description: A short description of the video.
 *                         publishedAt:
 *                           type: string
 *                           format: date-time
 *                           description: The publish date of the video.
 *                     statistics:
 *                       type: object
 *                       properties:
 *                         viewCount:
 *                           type: string
 *                           description: The number of views for the video.
 *                         likeCount:
 *                           type: string
 *                           description: The number of likes for the video.
 *                         dislikeCount:
 *                           type: string
 *                           description: The number of dislikes for the video.
 *       400:
 *         description: Bad request, missing or invalid parameters.
 *       500:
 *         description: Internal server error.
 */
router
  .route('/api/v1/getYoutubeVideoDetails')
  .post(
    campaignDefinitionController.getYoutubeVideoDetails
  );

/**
 * @swagger
 * /api/v1/enrichYoutubeVideo:
 *   post:
 *     summary: Enrich YouTube video details
 *     description: This endpoint allows you to update and enrich details of a specific YouTube video using its credentials and access token.
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: Video details to be updated.
 *         schema:
 *           type: object
 *           properties:
 *             orgId:
 *               type: string
 *               description: The organization ID associated with the YouTube credentials.
 *             videoId:
 *               type: string
 *               description: The ID of the YouTube video to be updated.
 *             title:
 *               type: string
 *               description: The new title for the YouTube video.
 *             description:
 *               type: string
 *               description: The new description for the YouTube video.
 *             tags:
 *               type: array
 *               items:
 *                 type: string
 *               description: List of tags to be added to the YouTube video.
 *             [other fields]:
 *               type: any
 *               description: Other fields to update on the YouTube video (e.g., visibility, category, etc.).
 *     responses:
 *       200:
 *         description: Successfully enriched YouTube video details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the operation was successful.
 *                 videos:
 *                   type: object
 *                   description: The updated video details returned from YouTube.
 *       400:
 *         description: Bad request, missing or invalid parameters.
 *       500:
 *         description: Internal server error.
 */
router
  .route('/api/v1/enrichYoutubeVideo')
  .post(
    campaignDefinitionController.enrichYoutubeVideo
  );

/**
 * @swagger
 * /api/v1/updateCampaignDefintion:
 *   post:
 *     summary: Validate the body of a POST request.
 *     tags: [Middleware]
 *     description: Checks if the request body contains the required fields before proceeding to the next middleware.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               field1:
 *                 type: string
 *                 description: The first required field.
 *                 example: some value
 *               field2:
 *                 type: string
 *                 description: The second required field.
 *                 example: another value
 *     responses:
 *       200:
 *         description: Request body is valid.
 *       400:
 *         description: Missing required fields in the request body.
 */

 /**
 * @swagger
 * /api/v1/updateCampaignDefintion:
 *   put:
 *     summary: Update an existing campaign definition by its ID
 *     description: This endpoint updates the details of an existing campaign definition based on its ID.
 *     parameters:
 *       - in: body
 *         name: campaignDefinitionId
 *         required: true
 *         description: The unique ID of the campaign definition to update.
 *         schema:
 *           type: object
 *           properties:
 *             campaignDefinitionId:
 *               type: string
 *               description: The unique ID of the campaign definition.
 *             name:
 *               type: string
 *               description: The name of the campaign.
 *             topic:
 *               type: string
 *               description: The topic of the campaign.
 *             videoUrl:
 *               type: string
 *               description: URL for the campaign video.
 *             influencers:
 *               type: array
 *               description: List of influencers involved in the campaign.
 *             startAt:
 *               type: string
 *               format: date-time
 *               description: The start date and time of the campaign.
 *             endAt:
 *               type: string
 *               format: date-time
 *               description: The end date and time of the campaign.
 *             totalAudience:
 *               type: integer
 *               description: The total audience size of the campaign.
 *             status:
 *               type: string
 *               description: The current status of the campaign.
 *             campaignTypes:
 *               type: array
 *               description: Types of campaigns being run.
 *             captiveMembers:
 *               type: integer
 *               description: Number of captive members involved in the campaign.
 *             tags:
 *               type: array
 *               description: Tags associated with the campaign.
 *     responses:
 *       200:
 *         description: Successfully updated the campaign definition.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the response (success).
 *                 message:
 *                   type: string
 *                   description: A message indicating the success of the update.
 *       400:
 *         description: Bad request, missing or invalid campaignDefinitionId.
 *       404:
 *         description: Campaign definition not found for the specified ID.
 *       500:
 *         description: Internal server error.
 */

router
  .route('/api/v1/updateCampaignDefintion')
  .post(
    campaignDefinitionController.checkPostBody,
    campaignDefinitionController.updateCampaignDefintion
  );

/**
 * @swagger
 * /api/v1/saveCampaignSelectionChannels:
 *   post:
 *     summary: Create campaign selection channels.
 *     description: This endpoint creates campaign selection channels by associating them with a specific campaign definition. It takes a list of channels and campaign details and returns the result of the creation process.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               channels:
 *                 type: array
 *                 description: A list of channel names to be associated with the campaign.
 *                 items:
 *                   type: string
 *               campaignDefinitionId:
 *                 type: integer
 *                 description: The ID of the campaign definition to associate the channels with.
 *               orgId:
 *                 type: integer
 *                 description: The ID of the organization to which the campaign and channels belong.
 *     responses:
 *       200:
 *         description: Successfully created campaign selection channels.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the creation operation.
 *                 data:
 *                   type: array
 *                   description: A list of campaign selection channels that were created.
 *                   items:
 *                     type: object
 *                     properties:
 *                       campaignSelectionId:
 *                         type: integer
 *                         description: The ID of the created campaign selection channel.
 *                       name:
 *                         type: string
 *                         description: The name of the campaign selection channel.
 *       400:
 *         description: Bad request due to missing or incorrect parameters.
 *       500:
 *         description: Internal server error.
 */
router
  .route('/api/v1/saveCampaignSelectionChannels')
  .post(campaignSelectionController.createCampaignSelectionChannels);

/**
 * @swagger
 * /api/v1/getCampaignSelectionChannels:
 *   post:
 *     summary: Retrieve campaign selection channels by campaign definition ID.
 *     description: This endpoint fetches the campaign selection channels and associated social media connections for a specific campaign definition ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               campaignDefinitionId:
 *                 type: integer
 *                 description: The ID of the campaign definition to retrieve associated campaign selection channels.
 *     responses:
 *       200:
 *         description: Successfully fetched campaign selection channels.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the request.
 *                 data:
 *                   type: array
 *                   description: The list of campaign selection channels and social media connections.
 *                   items:
 *                     type: object
 *                     properties:
 *                       campaignDefinitionId:
 *                         type: integer
 *                         description: The ID of the campaign definition.
 *                       campaignSelectionChannels:
 *                         type: array
 *                         description: The list of campaign selection channels associated with the campaign definition.
 *                         items:
 *                           type: object
 *                           properties:
 *                             campaignSelectionId:
 *                               type: integer
 *                               description: The ID of the campaign selection channel.
 *                             socialMediaConnection:
 *                               type: object
 *                               properties:
 *                                 name:
 *                                   type: string
 *                                   description: The name of the social media connection.
 *       400:
 *         description: Bad request due to missing or incorrect parameters.
 *       404:
 *         description: No campaign selection channels found for the given campaign definition ID.
 *       500:
 *         description: Internal server error.
 */
router
  .route('/api/v1/getCampaignSelectionChannels')
  .post(campaignSelectionController.getCampaignSelectionChannels);

/**
 * @swagger
 * /api/v1/saveCampaignContent:
 *   post:
 *     summary: Create a new campaign content
 *     description: Creates a new content for a campaign, including its details and scheduled post times.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               campaignChannelId:
 *                 type: integer
 *                 description: The ID of the campaign channel.
 *               description:
 *                 type: string
 *                 description: A brief description of the content.
 *               url:
 *                 type: string
 *                 description: The URL associated with the content.
 *               postAt:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: date-time
 *                 description: List of dates and times when the post should be made (ISO 8601 format).
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of tags related to the content.
 *               toEmail:
 *                 type: string
 *                 description: The email to send notifications to.
 *               subject:
 *                 type: string
 *                 description: The subject of the email notifications.
 *               publishVideoAs:
 *                 type: string
 *                 description: Specifies how to publish the video (e.g., public or private).
 *             required:
 *               - campaignChannelId
 *               - description
 *               - url
 *               - postAt
 *               - tags
 *               - toEmail
 *               - subject
 *               - publishVideoAs
 *     responses:
 *       200:
 *         description: Successfully created the campaign content and scheduled posts.
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
 *                       campaignContentID:
 *                         type: integer
 *                         description: The ID of the created campaign content.
 *                       postAt:
 *                         type: string
 *                         format: date-time
 *                         description: The scheduled date and time for the post.
 *       400:
 *         description: Bad request due to missing or invalid parameters.
 *       500:
 *         description: Server error occurred while creating the campaign content.
 */
router
  .route('/api/v1/saveCampaignContent')
  .post(campaignContentController.createCampaignContent);

/**
 * @swagger
 * /api/v1/getSocailMediaConnections:
 *   get:
 *     summary: Retrieves all social media connections for a given organization.
 *     description: This endpoint fetches all social media connections linked to the specified organization by its `orgId`.
 *     parameters:
 *       - in: body
 *         name: orgId
 *         description: The organization ID to filter social media connections.
 *         required: true
 *         schema:
 *           type: string
 *           example: "12345"
 *     responses:
 *       200:
 *         description: Successfully retrieved the social media connections for the organization.
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
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         description: The name of the social media connection.
 *                         example: "Facebook"
 *                       socialMediaType:
 *                         type: string
 *                         description: The type of the social media platform.
 *                         example: "SOCIAL_MEDIA"
 *                       organizationOrgId:
 *                         type: string
 *                         description: The organization ID.
 *                         example: "12345"
 *                       status:
 *                         type: string
 *                         description: The status of the social media connection.
 *                         example: "Active"
 *                       isConfigured:
 *                         type: boolean
 *                         description: Indicates if the social media connection is configured.
 *                         example: true
 *       404:
 *         description: No social media connections were found for the provided `orgId`.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No social media connections found."
 *       500:
 *         description: Internal server error when fetching social media connections.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Some error occurred while retrieving the connections."
 */
router
  .route('/api/v1/getSocailMediaConnections')
  .post(socialMediaConnectionController.getSocailMediaConnections);

/**
 * @swagger
 * /api/v1/saveSocialMediaConnections:
 *   post:
 *     summary: Validates the required fields for saving a social media connection.
 *     description: This endpoint ensures that all the required fields for a social media connection are provided before saving the data.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Facebook"
 *               socialMediaType:
 *                 type: string
 *                 example: "SocialMedia"
 *               socialMediaHandle:
 *                 type: string
 *                 example: "@example"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               tokenExpiry:
 *                 type: string
 *                 example: "2024-12-31T23:59:59Z"
 *               status:
 *                 type: string
 *                 example: "active"
 *               isConfigured:
 *                 type: boolean
 *                 example: true
 *               pageId:
 *                 type: string
 *                 example: "123456789"
 *               pageToken:
 *                 type: string
 *                 example: "abc123xyz"
 *     responses:
 *       200:
 *         description: Successfully validated the required fields.
 *       400:
 *         description: Bad request if the required fields are missing or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Missing required fields."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred while validating the data."
 */

/**
 * @swagger
 * /api/v1/saveSocialMediaConnections:
 *   post:
 *     summary: Saves or updates social media connections for an organization.
 *     description: This endpoint either creates a new social media connection or updates an existing one based on the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orgId:
 *                 type: string
 *                 example: "1234567890"
 *               name:
 *                 type: string
 *                 example: "Facebook"
 *               socialMediaType:
 *                 type: string
 *                 example: "SocialMedia"
 *               socialMediaHandle:
 *                 type: string
 *                 example: "@example"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               tokenExpiry:
 *                 type: string
 *                 example: "2024-12-31T23:59:59Z"
 *               status:
 *                 type: string
 *                 example: "active"
 *               isConfigured:
 *                 type: boolean
 *                 example: true
 *               pageId:
 *                 type: string
 *                 example: "123456789"
 *               pageToken:
 *                 type: string
 *                 example: "abc123xyz"
 *               description:
 *                 type: string
 *                 example: "Facebook page description"
 *               title:
 *                 type: string
 *                 example: "Facebook Page"
 *     responses:
 *       200:
 *         description: Social media connection saved or updated successfully.
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
 *                     socalMediaConnectionId:
 *                       type: string
 *                       example: "1"
 *                     name:
 *                       type: string
 *                       example: "Facebook"
 *                     socialMediaType:
 *                       type: string
 *                       example: "SocialMedia"
 *                     socialMediaHandle:
 *                       type: string
 *                       example: "@example"
 *       400:
 *         description: Bad request if required fields are missing or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Missing required fields"
 *       500:
 *         description: Internal server error if something goes wrong while saving/updating the data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred while saving the social media connection."
 */
router
  .route('/api/v1/saveSocialMediaConnections')
  .post(socialMediaConnectionController.checkSaveSocialMediaConnection, socialMediaConnectionController.saveSocialMediaConnections);

/**
 * @swagger
 * /api/v1/updateSocialMediaConnectionStatus:
 *   put:
 *     summary: Updates the status and configuration of a social media connection.
 *     description: This endpoint allows updating the status and configuration (`isConfigured`) of an existing social media connection for an organization.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orgId:
 *                 type: string
 *                 example: "1234567890"
 *               name:
 *                 type: string
 *                 example: "Facebook"
 *               status:
 *                 type: string
 *                 example: "inactive"
 *               isConfigured:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Social media connection status updated successfully.
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
 *                   example: "socialMedia connection status Updated Successfully"
 *       400:
 *         description: Bad request if required fields are missing or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No Record Found"
 *       500:
 *         description: Internal server error if something goes wrong while updating the data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred while updating the social media connection."
 */
router
  .route('/api/v1/updateSocialMediaConnectionStatus')
  .post(socialMediaConnectionController.updateSocialMediaConnectionStatus);


/**
 * @swagger
 * /api/v1/saveCaimpaignViewers:
 *   post:
 *     summary: Create campaign viewers
 *     description: This endpoint creates a new campaign viewer for the specified campaign, ensuring no duplicate viewers for the same campaign.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               campaignDefinitionId:
 *                 type: integer
 *                 description: The ID of the campaign associated with the viewer.
 *               ageMax:
 *                 type: integer
 *                 description: The maximum age of the target viewers.
 *               ageMin:
 *                 type: integer
 *                 description: The minimum age of the target viewers.
 *               psychographic:
 *                 type: string
 *                 description: The psychographic profile of the target viewers (e.g., interests, values).
 *               gender:
 *                 type: string
 *                 description: The gender of the target viewers (e.g., male, female, other).
 *               state:
 *                 type: string
 *                 description: The state where the target viewers are located.
 *               country:
 *                 type: string
 *                 description: The country where the target viewers are located.
 *               languages:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of languages spoken by the target viewers.
 *             required:
 *               - campaignDefinitionId
 *               - ageMax
 *               - ageMin
 *               - psychographic
 *               - gender
 *               - state
 *               - country
 *               - languages
 *     responses:
 *       200:
 *         description: Successfully created the campaign viewer.
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
 *                     campaignViewerId:
 *                       type: integer
 *                       description: The ID of the created campaign viewer.
 *                     ageMax:
 *                       type: integer
 *                       description: The maximum age of the viewer.
 *                     ageMin:
 *                       type: integer
 *                       description: The minimum age of the viewer.
 *                     psychographic:
 *                       type: string
 *                       description: The psychographic profile of the viewer.
 *                     gender:
 *                       type: string
 *                       description: The gender of the viewer.
 *                     state:
 *                       type: string
 *                       description: The state of the viewer.
 *                     country:
 *                       type: string
 *                       description: The country of the viewer.
 *                     languages:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: List of languages spoken by the viewer.
 *       400:
 *         description: Bad request due to missing or invalid parameters.
 *       409:
 *         description: Conflict, the campaign viewer is already associated with the campaign.
 *       500:
 *         description: Server error occurred while creating the campaign viewer.
 */
router
  .route('/api/v1/saveCaimpaignViewers')
  .post(campaignViewerController.createCampaignViewers);

/**
 * @swagger
 * /api/v1/getCampaginViewers:
 *   post:
 *     summary: Get campaign viewer details
 *     description: This endpoint retrieves the campaign viewer details associated with a given `campaignDefinitionId` and optional `campaignViewerId`.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               campaignViewerId:
 *                 type: integer
 *                 description: The ID of the campaign viewer to retrieve (optional).
 *               campaignDefinitionId:
 *                 type: integer
 *                 description: The ID of the campaign definition to fetch associated viewers.
 *             required:
 *               - campaignDefinitionId
 *     responses:
 *       200:
 *         description: Successfully retrieved the campaign viewer details.
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
 *                       campaignDefinitionId:
 *                         type: integer
 *                         description: The ID of the campaign definition.
 *                       CampaignViewer:
 *                         type: object
 *                         properties:
 *                           campaignViewerId:
 *                             type: integer
 *                             description: The ID of the campaign viewer.
 *                           ageMax:
 *                             type: integer
 *                             description: The maximum age of the viewer.
 *                           ageMin:
 *                             type: integer
 *                             description: The minimum age of the viewer.
 *                           psychographic:
 *                             type: string
 *                             description: Psychographic profile of the viewer.
 *                           gender:
 *                             type: string
 *                             description: The gender of the viewer.
 *                           state:
 *                             type: string
 *                             description: The state where the viewer is located.
 *                           country:
 *                             type: string
 *                             description: The country where the viewer is located.
 *                           languages:
 *                             type: array
 *                             items:
 *                               type: string
 *                             description: Languages spoken by the viewer.
 *       404:
 *         description: No campaign viewer found for the given campaignDefinitionId.
 *       500:
 *         description: Server error occurred while retrieving the campaign viewer details.
 */
router
  .route('/api/v1/getCampaginViewers')
  .post(campaignViewerController.getCampaginViewers);

/**
 * @swagger
 * /api/v1/updateCampaignViewers:
 *   post:
 *     summary: Update an existing campaign viewer
 *     description: This endpoint updates an existing campaign viewer's information such as age, psychographic data, and location details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               campaignViewerId:
 *                 type: integer
 *                 description: The ID of the campaign viewer to be updated.
 *               ageMax:
 *                 type: integer
 *                 description: The maximum age of the viewer (optional, updates only if provided).
 *               ageMin:
 *                 type: integer
 *                 description: The minimum age of the viewer (optional, updates only if provided).
 *               psychographic:
 *                 type: string
 *                 description: The psychographic profile of the viewer (optional).
 *               gender:
 *                 type: string
 *                 description: The gender of the viewer (optional).
 *               state:
 *                 type: string
 *                 description: The state of the viewer (optional).
 *               country:
 *                 type: string
 *                 description: The country of the viewer (optional).
 *               languages:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of languages spoken by the viewer (optional).
 *             required:
 *               - campaignViewerId
 *     responses:
 *       200:
 *         description: Successfully updated the campaign viewer's details.
 *       400:
 *         description: Bad request due to invalid or missing parameters.
 *       404:
 *         description: No record found with the given campaign viewer ID.
 *       500:
 *         description: Server error occurred while updating the campaign viewer.
 */
router
  .route('/api/v1/updateCampaignViewers')
  .post(campaignViewerController.updateCampaignViewers);

/**
 * @swagger
 * /api/v1/getCampaignListing:
 *   post:
 *     summary: Get a list of campaigns for a given organization ID
 *     tags: [Campaign]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orgId:
 *                 type: string
 *                 description: The organization ID to fetch campaigns
 *                 example: "12345"
 *     parameters:
 *       - name: pageSize
 *         in: query
 *         description: The number of campaigns to return per page
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *       - name: page
 *         in: query
 *         description: The page number to fetch (starting from 0)
 *         required: false
 *         schema:
 *           type: integer
 *           example: 0
 *     responses:
 *       200:
 *         description: Campaign list retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the request
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     campaignList:
 *                       type: object
 *                       properties:
 *                         count:
 *                           type: integer
 *                           description: The total number of campaigns
 *                           example: 50
 *                         rows:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               campaignDefinitionId:
 *                                 type: string
 *                                 description: The campaign ID
 *                                 example: "c123"
 *                               name:
 *                                 type: string
 *                                 description: Name of the campaign
 *                                 example: "Campaign A"
 *                               status:
 *                                 type: string
 *                                 description: Status of the campaign
 *                                 example: "Active"
 *                               campaignTypes:
 *                                 type: string
 *                                 description: Types of the campaign
 *                                 example: "Email, Social"
 *                               createdAt:
 *                                 type: string
 *                                 format: date-time
 *                                 description: Date the campaign was created
 *                                 example: "2024-12-20T12:34:56Z"
 *                               tags:
 *                                 type: array
 *                                 items:
 *                                   type: string
 *                                 description: Tags associated with the campaign
 *                                 example: ["promo", "2024"]
 *                               user:
 *                                 type: object
 *                                 properties:
 *                                   firstName:
 *                                     type: string
 *                                     description: First name of the user associated with the campaign
 *                                     example: "John"
 *                                   lastName:
 *                                     type: string
 *                                     description: Last name of the user associated with the campaign
 *                                     example: "Doe"
 *                     currentPage:
 *                       type: integer
 *                       description: The current page number
 *                       example: 0
 *                     pageSize:
 *                       type: integer
 *                       description: The number of items per page
 *                       example: 10
 *       400:
 *         description: Invalid request parameters or no campaigns found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No Record Found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error retrieving campaign list"
 */
router
  .route('/api/v1/getCampaignListing')
  .post(campaignController.getCampaignListing);

/**
 * @swagger
 * /api/v1/getAllCampaignDetails:
 *   post:
 *     summary: Get all campaign details for a given organization ID
 *     tags: [Campaign]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orgId:
 *                 type: string
 *                 description: The organization ID to fetch campaign details
 *                 example: "12345"
 *     responses:
 *       200:
 *         description: List of campaign details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the request
 *                   example: "success"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       campaignDefinitionId:
 *                         type: string
 *                         description: ID of the campaign
 *                         example: "c123"
 *                       tags:
 *                         type: array
 *                         description: List of tags associated with the campaign
 *                         items:
 *                           type: string
 *                       CampaignViewer:
 *                         type: object
 *                         properties:
 *                           ageMax:
 *                             type: integer
 *                             description: Maximum age of the viewer
 *                             example: 40
 *                           ageMin:
 *                             type: integer
 *                             description: Minimum age of the viewer
 *                             example: 18
 *                           state:
 *                             type: string
 *                             description: State of the viewer
 *                             example: "California"
 *                           country:
 *                             type: string
 *                             description: Country of the viewer
 *                             example: "USA"
 *                           gender:
 *                             type: string
 *                             description: Gender of the viewer
 *                             example: "Male"
 *                           psychographic:
 *                             type: string
 *                             description: Psychographic of the viewer
 *                             example: "Tech Enthusiast"
 *                           languages:
 *                             type: array
 *                             description: Languages spoken by the viewer
 *                             items:
 *                               type: string
 *                             example: ["English", "Spanish"]
 *                       campaignSelectionChannels:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             campaignSelectionId:
 *                               type: string
 *                               description: ID of the selection channel
 *                             socialMediaConnection:
 *                               type: object
 *                               properties:
 *                                 name:
 *                                   type: string
 *                                   description: Name of the social media connection
 *                                   example: "Facebook"
 *                             campaignContents:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   description:
 *                                     type: string
 *                                     description: Description of the campaign content
 *                                     example: "Special Offer"
 *                                   url:
 *                                     type: string
 *                                     description: URL for the campaign content
 *                                     example: "http://example.com"
 *                                   tags:
 *                                     type: array
 *                                     description: Tags associated with the content
 *                                     items:
 *                                       type: string
 *                                     example: ["promo", "holiday"]
 *                                   toEmail:
 *                                     type: string
 *                                     description: Email recipient for the content
 *                                     example: "user@example.com"
 *                                   subject:
 *                                     type: string
 *                                     description: Subject of the content
 *                                     example: "Holiday Sale"
 *                                   campaignContentPosts:
 *                                     type: array
 *                                     items:
 *                                       type: object
 *                                       properties:
 *                                         postAt:
 *                                           type: string
 *                                           format: date-time
 *                                           description: Date and time of the post
 *                                           example: "2024-12-20T14:00:00Z"
 *       400:
 *         description: Invalid request parameters or no campaigns found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No Record Found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error retrieving campaign details"
 */
router
  .route('/api/v1/getAllCampaignDetails')
  .post(campaignController.getAllCampaignDetails);

/**
 * @swagger
 * /api/v1/getCampaignDetails:
 *   post:
 *     summary: Get details of a specific campaign by organization and campaign definition ID
 *     tags: [Campaign]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orgId:
 *                 type: string
 *                 description: The organization ID for which to fetch the campaign details
 *                 example: "12345"
 *               campaignDefinitionId:
 *                 type: string
 *                 description: The ID of the campaign to fetch the details
 *                 example: "c123"
 *     responses:
 *       200:
 *         description: Campaign details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the request
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     campaignDefinitionId:
 *                       type: string
 *                       description: The ID of the campaign
 *                       example: "c123"
 *                     tags:
 *                       type: array
 *                       description: Tags associated with the campaign
 *                       items:
 *                         type: string
 *                       example: ["promo", "holiday"]
 *                     CampaignViewer:
 *                       type: object
 *                       properties:
 *                         ageMax:
 *                           type: integer
 *                           description: Maximum age of the viewer
 *                           example: 40
 *                         ageMin:
 *                           type: integer
 *                           description: Minimum age of the viewer
 *                           example: 18
 *                         state:
 *                           type: string
 *                           description: State of the viewer
 *                           example: "California"
 *                         country:
 *                           type: string
 *                           description: Country of the viewer
 *                           example: "USA"
 *                         gender:
 *                           type: string
 *                           description: Gender of the viewer
 *                           example: "Male"
 *                         psychographic:
 *                           type: string
 *                           description: Psychographic of the viewer
 *                           example: "Tech Enthusiast"
 *                         languages:
 *                           type: array
 *                           description: Languages spoken by the viewer
 *                           items:
 *                             type: string
 *                           example: ["English", "Spanish"]
 *                     campaignSelectionChannels:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           campaignSelectionId:
 *                             type: string
 *                             description: ID of the selection channel
 *                             example: "cs123"
 *                           socialMediaConnection:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                                 description: Name of the social media connection
 *                                 example: "Facebook"
 *                           campaignContents:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 description:
 *                                   type: string
 *                                   description: Description of the campaign content
 *                                   example: "Special Offer"
 *                                 url:
 *                                   type: string
 *                                   description: URL for the campaign content
 *                                   example: "http://example.com"
 *                                 tags:
 *                                   type: array
 *                                   description: Tags associated with the content
 *                                   items:
 *                                     type: string
 *                                   example: ["promo", "holiday"]
 *                                 toEmail:
 *                                   type: string
 *                                   description: Email recipient for the content
 *                                   example: "user@example.com"
 *                                 subject:
 *                                   type: string
 *                                   description: Subject of the content
 *                                   example: "Holiday Sale"
 *                                 publishVideoAs:
 *                                   type: string
 *                                   description: The status of the video (e.g., "draft" or "published")
 *                                   example: "draft"
 *                                 campaignContentPosts:
 *                                   type: array
 *                                   items:
 *                                     type: object
 *                                     properties:
 *                                       postAt:
 *                                         type: string
 *                                         format: date-time
 *                                         description: Date and time of the post
 *                                         example: "2024-12-20T14:00:00Z"
 *                                       postId:
 *                                         type: string
 *                                         description: The ID of the post
 *                                         example: "p123"
 *                                       postStatus:
 *                                         type: string
 *                                         description: The status of the post
 *                                         example: "active"
 *       400:
 *         description: Invalid request parameters or campaign not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No Record Found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error retrieving campaign details"
 */
router
  .route('/api/v1/getCampaignDetails')
  .post(campaignController.getCampaignDetails);


/**
 * @swagger
 * /api/v1/getCampaignWhatsAppDetails:
 *   post:
 *     summary: Get WhatsApp campaign details by organization and campaign definition ID
 *     tags: [Campaign]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orgId:
 *                 type: string
 *                 description: The organization ID for which to fetch the WhatsApp campaign details
 *                 example: "12345"
 *               campaignDefinitionId:
 *                 type: string
 *                 description: The ID of the campaign to fetch the WhatsApp details
 *                 example: "c123"
 *     responses:
 *       200:
 *         description: WhatsApp campaign details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the request
 *                   example: "success"
 *                 data:
 *                   type: array
 *                   description: List of WhatsApp content posts and broadcast information
 *                   items:
 *                     type: object
 *                     properties:
 *                       postId:
 *                         type: string
 *                         description: The ID of the WhatsApp content post
 *                         example: "wp123"
 *                       message:
 *                         type: string
 *                         description: The message content of the post
 *                         example: "New promotion now available!"
 *                       postAt:
 *                         type: string
 *                         format: date-time
 *                         description: The date and time the WhatsApp post was scheduled
 *                         example: "2024-12-20T10:00:00Z"
 *                       wa_campaign:
 *                         type: string
 *                         description: The ID of the campaign associated with the WhatsApp post
 *                         example: "c123"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: The date and time the WhatsApp broadcast content was created
 *                         example: "2024-12-19T09:00:00Z"
 *       400:
 *         description: Invalid request parameters or campaign not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No Record Found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error retrieving WhatsApp campaign details"
 */
router
  .route('/api/v1/getCampaignWhatsAppDetails')
  .post(campaignController.getCampaignWhatsAppDetails);


/**
 * @swagger
 * /api/v1/getCampaignDefinition:
 *   get:
 *     summary: Get a specific campaign definition by its ID
 *     description: This endpoint retrieves the details of a specific campaign definition based on its ID.
 *     parameters:
 *       - in: query
 *         name: campaignDefinitionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the campaign definition to fetch.
 *     responses:
 *       200:
 *         description: Successfully retrieved the campaign definition details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the response (success).
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: The name of the campaign.
 *                     topic:
 *                       type: string
 *                       description: The topic of the campaign.
 *                     videoUrl:
 *                       type: string
 *                       description: URL for the campaign video.
 *                     influencers:
 *                       type: array
 *                       description: List of influencers involved in the campaign.
 *                     objective:
 *                       type: string
 *                       description: The objective of the campaign.
 *                     startAt:
 *                       type: string
 *                       format: date-time
 *                       description: The start date and time of the campaign.
 *                     endAt:
 *                       type: string
 *                       format: date-time
 *                       description: The end date and time of the campaign.
 *                     totalAudience:
 *                       type: integer
 *                       description: The total audience size of the campaign.
 *                     campaignTypes:
 *                       type: array
 *                       description: Types of campaigns being run.
 *                     captiveMembers:
 *                       type: integer
 *                       description: Number of captive members involved in the campaign.
 *                     tags:
 *                       type: array
 *                       description: Tags associated with the campaign.
 *       400:
 *         description: Bad request, missing or invalid campaignDefinitionId.
 *       404:
 *         description: Campaign definition not found for the specified ID.
 *       500:
 *         description: Internal server error.
 */
router
  .route('/api/v1/getCampaignDefinition')
  .post(campaignDefinitionController.getCampaignDefintion);

/**
 * @swagger
 * /api/v1/saveCampaignComments:
 *   post:
 *     summary: Create a new campaign comment
 *     description: Allows a user to create a comment for a campaign.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comments:
 *                 type: string
 *                 description: The content of the comment
 *               campaignDefinitionId:
 *                 type: integer
 *                 description: The ID of the campaign definition
 *               userId:
 *                 type: integer
 *                 description: The ID of the user creating the comment
 *             required:
 *               - comments
 *               - campaignDefinitionId
 *               - userId
 *     responses:
 *       200:
 *         description: The comment was successfully created.
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
 *                     id:
 *                       type: integer
 *                       description: The ID of the created comment
 *                     comments:
 *                       type: string
 *                       description: The content of the comment
 *                     campaignDefinitionCampaignDefinitionId:
 *                       type: integer
 *                       description: The campaign definition ID
 *                     userUserId:
 *                       type: integer
 *                       description: The user ID of the creator
 *       400:
 *         description: Bad request, possibly due to missing parameters.
 *       500:
 *         description: Server error.
 */
router
  .route('/api/v1/saveCampaignComments')
  .post(campaignCommentController.createCampaignComments);


/**
 * @swagger
 * /api/v1/savePaidAnalyticsAmount:
 *   post:
 *     summary: Save paid analytics amount for a campaign
 *     description: Saves the paid amount for specific types of leads (e.g., Facebook or WhatsApp).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               campaign_id:
 *                 type: integer
 *                 description: The ID of the campaign to update
 *               orgId:
 *                 type: integer
 *                 description: The ID of the organization (optional, not used in logic)
 *               amt:
 *                 type: number
 *                 description: The amount to be saved for the specific lead type
 *               amtFor:
 *                 type: string
 *                 description: Specifies the lead type ("fbLeads" for Facebook, "whatsApp" for WhatsApp)
 *                 enum:
 *                   - fbLeads
 *                   - whatsApp
 *             required:
 *               - campaign_id
 *               - amt
 *               - amtFor
 *     responses:
 *       200:
 *         description: Successfully saved the paid amount.
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
 *                   example: Paid amount saved.
 *       400:
 *         description: Bad request due to missing or invalid parameters.
 *       500:
 *         description: Server error occurred while saving the paid amount.
 */
router
  .route('/api/v1/savePaidAnalyticsAmount')
  .post(campaignCommentController.savePaidAnalyticsAmount);

module.exports = router;
