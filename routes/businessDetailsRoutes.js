const express = require('express');
const router = express.Router();
const businessDetailsController = require('../controllers/businessDetailsController');

/**
 * @swagger
 * tags:
 *   name: BusinessDetails
 *   description: Business settings for each OEM
 */

/**
 * @swagger
 * /api/v1/business-details:
 *   post:
 *     summary: Create new business details
 *     tags: [BusinessDetails]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oem_id:
 *                 type: integer
 *               tagline:
 *                 type: string
 *               website_url:
 *                 type: string
 *               asset_categories:
 *                 type: string
 *               is_dam_connected:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Business details created
 */
router.post('/api/v1/business-details', businessDetailsController.createBusinessDetails);

/**
 * @swagger
 * /api/v1/business-details:
 *   get:
 *     summary: Get all business details
 *     tags: [BusinessDetails]
 *     responses:
 *       200:
 *         description: List of business details
 */
router.get('/api/v1/business-details', businessDetailsController.getAllBusinessDetails);

/**
 * @swagger
 * /api/v1/business-details/{id}:
 *   get:
 *     summary: Get business details by ID
 *     tags: [BusinessDetails]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Business details retrieved
 *       404:
 *         description: Not found
 */
router.get('/api/v1/business-details/:id', businessDetailsController.getBusinessDetailsById);

/**
 * @swagger
 * /api/v1/business-details/{id}:
 *   put:
 *     summary: Update business details
 *     tags: [BusinessDetails]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Updated successfully
 *       404:
 *         description: Not found
 */
router.put('/api/v1/business-details/:id', businessDetailsController.updateBusinessDetails);

/**
 * @swagger
 * /api/v1/business-details/{id}:
 *   delete:
 *     summary: Delete business details
 *     tags: [BusinessDetails]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted successfully
 *       404:
 *         description: Not found
 */
router.delete('/api/v1/business-details/:id', businessDetailsController.deleteBusinessDetails);

module.exports = router;
