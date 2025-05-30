/**
 * @author [Pradeep]
 * @email [pradeep@promulgateinnovation.com]
 * @create date 2021-03-02 18:44:59
 * @modify date 2021-03-02 18:44:59
 * @desc [Routing for Team Information]
 */

const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

/**
 * @swagger
 * /api/v1/getCampaginAnalytics:
 *   post:
 *     summary: Retrieve campaign analytics data
 *     tags: [Campaign Analytics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               campaignDefinitionId:
 *                 type: string
 *                 description: The ID of the campaign definition to retrieve analytics for
 *             required:
 *               - campaignDefinitionId
 *             example:
 *               campaignDefinitionId: "b488054b-480a-4465-b820-ec9a7b6449jh"
 *     responses:
 *       200:
 *         description: Analytics data for the specified campaign
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the response
 *                   example: success
 *                 data:
 *                   type: object
 *                   description: The analytics data for the campaign
 *                   properties:
 *                     campaign_name:
 *                       type: string
 *                       description: The name of the campaign
 *                     campaign_start_date:
 *                       type: string
 *                       format: date-time
 *                       description: The start date of the campaign
 *                     campaign_end_date:
 *                       type: string
 *                       format: date-time
 *                       description: The end date of the campaign
 *                     campaign_total_audience:
 *                       type: integer
 *                       description: The total audience of the campaign
 *                     campaign_status:
 *                       type: string
 *                       description: The status of the campaign
 *                     connections:
 *                       type: object
 *                       description: Analytics for various connections
 *                       properties:
 *                         facebook:
 *                           type: object
 *                           properties:
 *                             viewCount:
 *                               type: integer
 *                             like:
 *                               type: integer
 *                             wow:
 *                               type: integer
 *                             comment:
 *                               type: integer
 *                         youtube:
 *                           type: object
 *                           properties:
 *                             viewCount:
 *                               type: integer
 *                             likeCount:
 *                               type: integer
 *                             dislikeCount:
 *                               type: integer
 *                             favoriteCount:
 *                               type: integer
 *                             commentCount:
 *                               type: integer
 *                         instagram:
 *                           type: object
 *                           properties:
 *                             view_count:
 *                               type: integer
 *                             like_count:
 *                               type: integer
 *                             comments_count:
 *                               type: integer
 *                         email:
 *                           type: object
 *                           properties:
 *                             No_of_Email:
 *                               type: integer
 *                         sms:
 *                           type: object
 *                           properties:
 *                             No_of_SMS:
 *                               type: integer
 *                         whatsapp:
 *                           type: object
 *                           properties:
 *                             No_of_Message_send:
 *                               type: integer
 *                     reach:
 *                       type: integer
 *                       description: The reach of the campaign
 *                     engagement:
 *                       type: integer
 *                       description: The engagement of the campaign
 *                     analyticsid:
 *                       type: string
 *                       description: The ID of the analytics record
 *             example:
 *               status: "success"
 *               data:
 *                 campaign_name: "Sample Campaign"
 *                 campaign_start_date: "2025-01-01T00:00:00.000Z"
 *                 campaign_end_date: "2025-01-10T00:00:00.000Z"
 *                 campaign_total_audience: 1000
 *                 campaign_status: "active"
 *                 connections:
 *                   facebook:
 *                     viewCount: 100
 *                     like: 50
 *                     wow: 10
 *                     comment: 20
 *                   youtube:
 *                     viewCount: 200
 *                     likeCount: 80
 *                     dislikeCount: 5
 *                     favoriteCount: 10
 *                     commentCount: 15
 *                   instagram:
 *                     view_count: 150
 *                     like_count: 60
 *                     comments_count: 30
 *                   email:
 *                     No_of_Email: 500
 *                   sms:
 *                     No_of_SMS: 300
 *                   whatsapp:
 *                     No_of_Message_send: 250
 *                 reach: 500
 *                 engagement: 300
 *                 analyticsid: "analytics-12345"
 *       400:
 *         description: Invalid request data
 *       404:
 *         description: Campaign not found
 *       500:
 *         description: Internal server error
 */
router
  .route('/api/v1/getCampaginAnalytics')
  .post(analyticsController.getCampaginAnalytics);

/**
 * @swagger
 * /api/v1/getSubscriptionAnalytics:
 *   post:
 *     summary: Retrieve subscription analytics for an organization
 *     tags: [Subscription Analytics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orgId:
 *                 type: string
 *                 description: The ID of the organization to retrieve subscription analytics for
 *             required:
 *               - orgId
 *             example:
 *               orgId: "12345678-abcd-1234-efgh-9876543210ij"
 *     responses:
 *       200:
 *         description: Subscription analytics data for the specified organization
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the response
 *                   example: success
 *                 data:
 *                   type: object
 *                   description: Analytics data for various platforms
 *                   properties:
 *                     facebook:
 *                       type: object
 *                       description: Facebook subscription analytics
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: "Facebook"
 *                         analytics:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               title:
 *                                 type: string
 *                               count:
 *                                 type: integer
 *                                 example: 0
 *                     instagram:
 *                       type: object
 *                       description: Instagram subscription analytics
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: "Instagram"
 *                         analytics:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               title:
 *                                 type: string
 *                               count:
 *                                 type: integer
 *                                 example: 0
 *                     youtube:
 *                       type: object
 *                       description: YouTube subscription analytics
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: "Youtube"
 *                         analytics:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               title:
 *                                 type: string
 *                               count:
 *                                 type: integer
 *                                 example: 0
 *       400:
 *         description: Invalid request data
 *       404:
 *         description: Subscription analytics not found for the given organization
 *       500:
 *         description: Internal server error
 */
router
  .route('/api/v1/getSubscriptionAnalytics')
  .post(analyticsController.getSubscriptionAnalytics);

/**
 * @swagger
 * /api/v1/getYoutubeAnalytics:
 *   post:
 *     summary: Retrieve YouTube analytics data for an organization
 *     tags: [YouTube Analytics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orgId:
 *                 type: string
 *                 description: The ID of the organization to retrieve YouTube analytics for
 *             required:
 *               - orgId
 *             example:
 *               orgId: "12345678-abcd-1234-efgh-9876543210ij"
 *     responses:
 *       200:
 *         description: YouTube analytics data for the specified organization
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the request was successful
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: The YouTube analytics data
 *                   properties:
 *                     viewCount:
 *                       type: string
 *                       description: The subscriber count of the YouTube channel
 *                       example: "1000"
 *                     Subscribers:
 *                       type: string
 *                       description: The view count of the YouTube channel
 *                       example: "5000"
 *                     hiddenSubscriberCount:
 *                       type: string
 *                       description: The hidden subscriber count of the YouTube channel
 *                       example: "NA"
 *                     "Video Published":
 *                       type: string
 *                       description: The count of video views on the channel
 *                       example: "200"
 *                     playlist:
 *                       type: string
 *                       description: The number of playlists available on the channel
 *                       example: "10"
 *                     popularvideo:
 *                       type: object
 *                       description: The details of the popular video on the channel
 *                       properties:
 *                         title:
 *                           type: string
 *                           description: The title of the popular video
 *                           example: "Most Popular Video"
 *                         viewCount:
 *                           type: integer
 *                           description: The view count of the popular video
 *                           example: 100000
 *                         likeCount:
 *                           type: integer
 *                           description: The like count of the popular video
 *                           example: 5000
 *                         commentCount:
 *                           type: integer
 *                           description: The comment count of the popular video
 *                           example: 300
 *       400:
 *         description: Invalid request data
 *       404:
 *         description: YouTube analytics not found for the given organization
 *       500:
 *         description: Internal server error
 */
router
  .route('/api/v1/getYoutubeAnalytics')
  .post(analyticsController.getYoutubeAnalytics);

/**
 * @swagger
 * /api/v1/getSocialPresence:
 *   post:
 *     summary: Retrieve social presence data for an organization
 *     tags: [Social Presence]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orgId:
 *                 type: string
 *                 description: The ID of the organization to retrieve social presence data for
 *             required:
 *               - orgId
 *             example:
 *               orgId: "12345678-abcd-1234-efgh-9876543210ij"
 *     responses:
 *       200:
 *         description: Social media presence data for the specified organization
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the response
 *                   example: success
 *                 data:
 *                   type: array
 *                   description: List of social media connections for the organization
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: "Facebook"
 *                       socialMediaType:
 *                         type: string
 *                         example: "facebook"
 *                       organizationOrgId:
 *                         type: string
 *                         example: "12345678-abcd-1234-efgh-9876543210ij"
 *                       status:
 *                         type: string
 *                         example: "active"
 *                       isConfigured:
 *                         type: boolean
 *                         example: true
 *                       socialMediaPage:
 *                         type: object
 *                         description: The social media page associated with the connection
 *                         properties:
 *                           url:
 *                             type: string
 *                             example: "https://www.facebook.com/organization"
 *                           pageName:
 *                             type: string
 *                             example: "Organization Facebook Page"
 *                 socialData:
 *                   type: array
 *                   description: List of social presence data for each social media connection
 *                   items:
 *                     type: object
 *                     properties:
 *                       socialName:
 *                         type: string
 *                         example: "Organization's Facebook Page"
 *                       totalPosts:
 *                         type: integer
 *                         example: 100
 *                       totalFollowing:
 *                         type: integer
 *                         example: 5000
 *                       totalFollowers:
 *                         type: integer
 *                         example: 10000
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-01-10T14:20:00Z"
 *       400:
 *         description: Invalid request data
 *       404:
 *         description: Social media data not found for the given organization
 *       500:
 *         description: Internal server error
 */
router
  .route('/api/v1/getSocialPresence')
  .post(analyticsController.getSocialPresence);

/**
 * @swagger
 * /api/v1/fetchSocialPresence:
 *   post:
 *     summary: Fetch and store social media presence data for active organic social media connections (Instagram, Facebook, Youtube).
 *     tags: [Social Presence]
 *     description: This endpoint fetches the social media statistics for active social media connections of type 'ORGANIC'. It supports Instagram, Facebook, and YouTube platforms.
 *     responses:
 *       200:
 *         description: Successfully fetched and stored social media presence data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the operation
 *                   example: success
 *       500:
 *         description: Internal server error
 *       400:
 *         description: Invalid request data or no active social media connections found
 */router
  .route('/api/v1/fetchSocialPresence')
  .get(analyticsController.fetchSocialPresence);

/**
 * @swagger
 * /api/v1/setYoutubeAnalytics:
 *   post:
 *     summary: Save YouTube analytics data.
 *     tags: [YouTube Analytics]
 *     description: This endpoint is used to store YouTube analytics data such as views, watch time, videos published, and audience information in the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               channelId:
 *                 type: string
 *                 description: The ID of the YouTube channel.
 *                 example: UC_x5XG1OV2P6uZZ5FSM9Ttw
 *               views:
 *                 type: number
 *                 description: Total number of views on the channel.
 *                 example: 100000
 *               whatch_time:
 *                 type: number
 *                 description: Total watch time (in minutes or hours).
 *                 example: 5000
 *               videos_published:
 *                 type: number
 *                 description: Total number of videos published on the channel.
 *                 example: 50
 *               total_likes:
 *                 type: number
 *                 description: Total number of likes on all videos.
 *                 example: 2000
 *               playlists:
 *                 type: number
 *                 description: Total number of playlists on the channel.
 *                 example: 10
 *               audience_retention:
 *                 type: object
 *                 description: Audience retention data.
 *                 additionalProperties:
 *                   type: string
 *                 example:
 *                   averageViewDuration: "2:30"
 *                   retentionRate: "50%"
 *               recent_videos:
 *                 type: array
 *                 description: Details of recent videos.
 *                 items:
 *                   type: object
 *                   properties:
 *                     videoId:
 *                       type: string
 *                       description: The ID of the video.
 *                       example: abc123
 *                     title:
 *                       type: string
 *                       description: Title of the video.
 *                       example: "How to Learn JavaScript"
 *               audience_by_countries:
 *                 type: object
 *                 description: Audience breakdown by countries.
 *                 additionalProperties:
 *                   type: string
 *                 example:
 *                   US: "40%"
 *                   IN: "30%"
 *               audience_by_demographics:
 *                 type: object
 *                 description: Audience demographics information.
 *                 additionalProperties:
 *                   type: string
 *                 example:
 *                   age18_24: "30%"
 *                   male: "60%"
 *               traffic_source:
 *                 type: object
 *                 description: Traffic source details.
 *                 additionalProperties:
 *                   type: string
 *                 example:
 *                   youtubeSearch: "40%"
 *                   suggestedVideos: "30%"
 *               external_source:
 *                 type: object
 *                 description: External traffic source details.
 *                 additionalProperties:
 *                   type: string
 *                 example:
 *                   googleSearch: "25%"
 *                   socialMedia: "15%"
 *               audience:
 *                 type: object
 *                 description: Audience engagement details.
 *                 additionalProperties:
 *                   type: string
 *                 example:
 *                   likesPerView: "10%"
 *                   commentsPerView: "5%"
 *               campaignDefinitionCampaignDefinitionId:
 *                 type: number
 *                 description: ID of the campaign definition associated with this data.
 *                 example: 123
 *               addedBy:
 *                 type: string
 *                 description: The user who added this data.
 *                 example: admin
 *     responses:
 *       200:
 *         description: Successfully stored YouTube analytics data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the operation.
 *                   example: success
 *                 msg:
 *                   type: object
 *                   description: Details of the added data.
 *       500:
 *         description: Internal server error.
 */
router
  .route('/api/v1/setYoutubeAnalytics')
  .post(analyticsController.setYoutubeAnalytics);

/**
 * @swagger
 * /api/v1/fetchYoutubeAnalytics:
 *   post:
 *     summary: Fetch YouTube analytics data.
 *     tags: [YouTube Analytics]
 *     description: Retrieve YouTube analytics data based on the provided channel ID or fetch all analytics data if no channel ID is provided.
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               channelId:
 *                 type: string
 *                 description: The ID of the YouTube channel to fetch analytics for.
 *                 example: UC_x5XG1OV2P6uZZ5FSM9Ttw
 *     responses:
 *       200:
 *         description: Successfully fetched YouTube analytics data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the operation.
 *                   example: success
 *                 data:
 *                   type: array
 *                   description: List of YouTube analytics data.
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                         description: Unique ID of the record.
 *                       channelId:
 *                         type: string
 *                         description: The YouTube channel ID.
 *                       views:
 *                         type: number
 *                         description: Total number of views.
 *                       whatch_time:
 *                         type: number
 *                         description: Total watch time.
 *                       videos_published:
 *                         type: number
 *                         description: Total number of videos published.
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Date and time when the record was created.
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: Date and time when the record was last updated.
 *       500:
 *         description: Internal server error.
 */
router
  .route('/api/v1/fetchYoutubeAnalytics')
  .post(analyticsController.fetchYoutubeAnalytics);

/**
 * @swagger
 * /api/v1/manually-run-social-media-cron-for-comments:
 *   get:
 *     summary: Manually run cron jobs for social media comments or analytics.
 *     tags: [Social Media]
 *     description: Trigger cron jobs to fetch social media comments or update analytics for campaigns based on the provided connection type and duration.
 *     parameters:
 *       - in: query
 *         name: connectionType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [analytics, social]
 *         description: Type of connection for the cron job. Use "analytics" to update campaign analytics or "social" to fetch comments.
 *       - in: query
 *         name: duration
 *         required: false
 *         schema:
 *           type: string
 *           description: Duration for fetching comments (e.g., "7d" for the last 7 days). Ignored if connectionType is "analytics".
 *     responses:
 *       200:
 *         description: Successfully triggered the cron job.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status message of the operation.
 *                   example: Analytics Started
 *       500:
 *         description: Internal server error.
 */
router
  .route('/api/v1/manually-run-social-media-cron-for-comments')
  .get(analyticsController.manuallyRunCronForSocialMediaComments);

/**
 * @swagger
 * /api/v1/run-cron-manually:
 *   get:
 *     summary: Manually run a cron job for fetching Facebook comments.
 *     tags: [Social Media]
 *     description: Triggers a cron job to fetch Facebook comments for today's duration.
 *     responses:
 *       200:
 *         description: Successfully triggered the cron job.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the operation.
 *                   example: success
 *                 message:
 *                   type: string
 *                   description: A message confirming the cron job has started.
 *                   example: Cron started.
 *       500:
 *         description: Internal server error.
 */
router
  .route('/api/v1/run-cron-manually')
  .post(analyticsController.runCronManually);

/**
 * @swagger
 * /api/v1/analytics-report:
 *   post:
 *     summary: Fetch analytics report for a specific organization and date range.
 *     tags: [Analytics]
 *     description: Retrieves various analytics data for the specified organization ID, month, and year.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orgId:
 *                 type: string
 *                 description: The organization ID for which the analytics report is being generated.
 *                 example: "12345"
 *               month:
 *                 type: string
 *                 description: The month (in text or numeric format) to filter the report.
 *                 example: "January"
 *               year:
 *                 type: number
 *                 description: The year for the report.
 *                 example: 2024
 *     responses:
 *       200:
 *         description: Successfully retrieved the analytics report.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the operation.
 *                   example: success
 *                 data:
 *                   type: object
 *                   description: The detailed analytics report.
 *       400:
 *         description: Bad Request - Missing required parameters.
 *       500:
 *         description: Internal Server Error.
 */
router
  .route('/api/v1/analytics-report')
  .post(analyticsController.analyticsReport);


router
  .route('/api/v1/delear-analy-report')
  .post(analyticsController.dealerAnalyReport);
module.exports = router;
