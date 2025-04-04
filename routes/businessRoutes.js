/**
 * @author [Pradeep]
 * @email [pradeep@promulgateinnovation.com]
 * @create date 2021-03-02 18:44:59
 * @modify date 2021-03-02 18:44:59
 * @desc [Routing for Business]
 */

const express = require('express');
const businessController = require('../controllers/businessController');
const router = express.Router();

/**
 * @swagger
 * /api/v1/getBusinessDetails:
 *   post:
 *     summary: Get detailed business information by organization ID
 *     tags: [Business]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orgId:
 *                 type: integer
 *                 description: Organization ID to fetch business details
 *                 example: 101
 *     responses:
 *       200:
 *         description: Business details retrieved successfully
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
 *                     businessId:
 *                       type: integer
 *                       description: Unique ID of the business
 *                       example: 123
 *                     description:
 *                       type: string
 *                       description: Description of the business
 *                       example: "A leading tech company"
 *                     tagLine:
 *                       type: string
 *                       description: Tagline of the business
 *                       example: "Innovating the future"
 *                     competitor1:
 *                       type: string
 *                       description: First competitor of the business
 *                       example: "Competitor A"
 *                     competitor2:
 *                       type: string
 *                       description: Second competitor of the business
 *                       example: "Competitor B"
 *                     descriptionTags:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Tags associated with the business
 *                       example: ["technology", "innovation"]
 *                     hubHubId:
 *                       type: string
 *                       nullable: true
 *                       description: Hub ID associated with the business
 *                       example: "12345"
 *                     type:
 *                       type: string
 *                       description: Type of hub (if available)
 *                       example: "API Hub"
 *                     url:
 *                       type: string
 *                       description: URL of the hub (if available)
 *                       example: "https://example.com/hub"
 *                     credentials:
 *                       type: string
 *                       description: Hub credentials (if available)
 *                       example: "apikey123"
 *                     assetAssetId:
 *                       type: string
 *                       nullable: true
 *                       description: Asset ID associated with the business
 *                       example: "67890"
 *                     assetName:
 *                       type: string
 *                       description: Name of the asset (if available)
 *                       example: "API Key"
 *                     assetExpiry:
 *                       type: string
 *                       format: date
 *                       description: Expiry date of the asset (if available)
 *                       example: "2024-12-31"
 *                     assetCredentials:
 *                       type: string
 *                       description: Asset credentials (if available)
 *                       example: "securekey123"
 *       404:
 *         description: No business found for the provided organization ID
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
 *                   example: "No Record Found"
 *       500:
 *         description: Error retrieving business details
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
 *                   example: "Error retrieving Business"
 */
router
  .route('/api/v1/getBusinessDetails')
  .post(businessController.getBusinessDetails);

/**
 * @swagger
 * /api/v1/saveBusinessDetails:
 *   post:
 *     summary: Save business details
 *     tags: [Business]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: Description of the business
 *               descriptionTags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Tags related to the business description
 *               tagLine:
 *                 type: string
 *                 description: Tagline for the business
 *               orgId:
 *                 type: integer
 *                 description: Organization ID the business belongs to
 *               competitor1:
 *                 type: string
 *                 description: Competitor 1 name (optional)
 *               competitor2:
 *                 type: string
 *                 description: Competitor 2 name (optional)
 *               hubType:
 *                 type: string
 *                 description: Type of hub associated with the business (optional)
 *               assetName:
 *                 type: string
 *                 description: Name of the asset associated with the business (optional)
 *     responses:
 *       200:
 *         description: Business successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the response
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     businessId:
 *                       type: integer
 *                       description: The ID of the created business
 *       500:
 *         description: Some error occurred while creating the business
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
 *                   description: Error message
 */
router
  .route('/api/v1/saveBusinessDetails')
  .post(businessController.saveBusinessDetails);

/**
 * @swagger
 * /api/v1/updateBusinessDetails:
 *   put:
 *     summary: Update the business details
 *     tags: [Business]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               businessId:
 *                 type: string
 *                 description: Unique ID of the business to be updated
 *                 example: "12345"
 *               description:
 *                 type: string
 *                 description: Business description
 *                 example: "A technology company specializing in APIs."
 *               descriptionTags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Tags associated with the description
 *                 example: ["API", "Tech"]
 *               tagLine:
 *                 type: string
 *                 description: Tagline for the business
 *                 example: "Innovating the future"
 *               competitor1:
 *                 type: string
 *                 description: First competitor
 *                 example: "Company A"
 *               competitor2:
 *                 type: string
 *                 description: Second competitor
 *                 example: "Company B"
 *               hubType:
 *                 type: string
 *                 description: Type of the hub (e.g., "API", "Social")
 *                 example: "API"
 *               hubUrl:
 *                 type: string
 *                 description: URL of the hub
 *                 example: "https://api.example.com"
 *               credentials:
 *                 type: string
 *                 description: Credentials for the hub
 *                 example: "secure-key"
 *               assetName:
 *                 type: string
 *                 description: Name of the asset
 *                 example: "API Key"
 *               assetExpiry:
 *                 type: string
 *                 format: date
 *                 description: Expiry date of the asset
 *                 example: "2024-12-31"
 *               assetCredentials:
 *                 type: string
 *                 description: Credentials for the asset
 *                 example: "asset-credentials"
 *     responses:
 *       200:
 *         description: Business updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the request
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: "Business Updated Successfully"
 *       400:
 *         description: Invalid request parameters
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
 *                   example: "Error updating business"
 */
router
  .route('/api/v1/updateBusinessDetails')
  .post(businessController.updateBusinessDetails);

/**
 * @swagger
 * /api/v1/deleteAssestDetails:
 *   delete:
 *     summary: Delete a digital asset associated with a business
 *     tags: [Business]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orgId:
 *                 type: string
 *                 description: The organization ID whose asset is to be deleted
 *                 example: "12345"
 *     responses:
 *       200:
 *         description: Asset deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the request
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: "Digital Asset Deleted Successfully"
 *       400:
 *         description: Invalid request parameters or business not found
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
 *                   example: "Error deleting asset"
 */
router
 .route('/api/v1/deleteAssestDetails')
 .delete(businessController.deleteAssestDetails);

module.exports = router;

module.exports = router;


