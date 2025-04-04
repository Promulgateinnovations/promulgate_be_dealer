/**
 * @author [Pradeep]
 * @email [pradeep@promulgateinnovation.com]
 * @create date 2021-03-02 18:44:59
 * @modify date 2021-03-02 18:44:59
 * @desc [Routing for PostingData to Socail media]
 */

const express = require('express');
const router = express.Router();
const postController = require("../controllers/postController")

/**
 * @swagger
 * /api/v1/getPostDetails:
 *   post:
 *     summary: Validates the presence of an organization ID in the request body.
 *     description: This endpoint checks if the `orgId` parameter exists and is not empty or only whitespace. If the `orgId` is missing or invalid, it returns an error.
 *     parameters:
 *       - in: body
 *         name: body
 *         description: The body of the request containing the `orgId`.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             orgId:
 *               type: string
 *               description: The organization ID associated with the request.
 *               example: "12345"
 *     responses:
 *       200:
 *         description: Request is valid with the provided `orgId`.
 *       400:
 *         description: Missing or invalid `orgId` in the request body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Missing Organization Id"
 */


 /**
 * @swagger
 * /api/v1/getPostDetails:
 *   post:
 *     summary: Retrieve post details for a specific organization within a time frame.
 *     description: This endpoint retrieves campaign content posts within a 10-minute window, starting from the current time minus 10 minutes and ending 1 minute ahead.
 *     parameters:
 *       - in: body
 *         name: orgId
 *         description: Organization ID to filter posts by.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             orgId:
 *               type: string
 *               example: '12345'
 *     responses:
 *       200:
 *         description: Successfully retrieved the post details.
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
 *                       campaignContentPostID:
 *                         type: integer
 *                         example: 1
 *                       postAt:
 *                         type: string
 *                         format: date-time
 *                         example: '2024-12-20T12:34:56Z'
 *                       postId:
 *                         type: integer
 *                         example: null
 *                       postStatus:
 *                         type: string
 *                         example: 'active'
 *                       campaignContent:
 *                         type: object
 *                         properties:
 *                           description:
 *                             type: string
 *                             example: 'Campaign post description'
 *                           url:
 *                             type: string
 *                             example: 'https://example.com/campaign-post'
 *                           campaignSelectionChannel:
 *                             type: object
 *                             properties:
 *                               campaignSelectionId:
 *                                 type: integer
 *                                 example: 101
 *                               socialMediaConnection:
 *                                 type: object
 *                                 properties:
 *                                   name:
 *                                     type: string
 *                                     example: 'Facebook'
 *                                   socialMediaType:
 *                                     type: string
 *                                     example: 'Social Media'
 *                                   socialMediaHandle:
 *                                     type: string
 *                                     example: '@exampleHandle'
 *                                   password:
 *                                     type: string
 *                                     example: 'secretpassword'
 *                                   socialMediaPage:
 *                                     type: object
 *                                     properties:
 *                                       url:
 *                                         type: string
 *                                         example: 'https://facebook.com/examplePage'
 *                               campaignDefinition:
 *                                 type: object
 *                                 properties:
 *                                   name:
 *                                     type: string
 *                                     example: 'Holiday Campaign'
 *                                   organization:
 *                                     type: object
 *                                     properties:
 *                                       name:
 *                                         type: string
 *                                         example: 'My Organization'
 *       400:
 *         description: Invalid organization ID.
 *       500:
 *         description: Internal server error.
 */
router
  .route('/api/v1/getPostDetails')
  .post(postController.checkPostBody, postController.getPostDetails);

module.exports = router;
