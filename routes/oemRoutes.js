const express = require('express');
const router = express.Router();
const oemController = require('../controllers/oemController');

/**
 * @swagger
 * tags:
 *   name: OEM
 *   description: Operations related to OEM management
 */

/**
 * @swagger
 * /api/v1/oems:
 *   post:
 *     summary: Create a new OEM
 *     tags: [OEM]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oem_name:
 *                 type: string
 *               oem_code:
 *                 type: string
 *               oem_logo_url:
 *                 type: string
 *               oem_website_url:
 *                 type: string
 *               primary_contact_name:
 *                 type: string
 *               primary_contact_email:
 *                 type: string
 *               primary_contact_phone:
 *                 type: string
 *               superuser_name:
 *                 type: string
 *               superuser_email:
 *                 type: string
 *               superuser_phone:
 *                 type: string
 *               operating_country:
 *                 type: string
 *               time_zone:
 *                 type: string
 *               regions_states:
 *                 type: string
 *               hierarchy_level:
 *                 type: string
 *               number_of_outlets:
 *                 type: integer
 *               campaign_approval_workflow_id:
 *                 type: integer
 *               campaign_strategy_template_id:
 *                 type: integer
 *               content_approval_role_id:
 *                 type: integer
 *               channel_access:
 *                 type: string
 *                 enum: [Paid, Organic, Both]
 *               channels:
 *                 type: string
 *               analytics_enabled:
 *                 type: boolean
 *               reporting_frequency:
 *                 type: string
 *               custom_kpis:
 *                 type: string
 *     responses:
 *       201:
 *         description: OEM created successfully
 */
router.post('/api/v1/oems', oemController.createOEM);

/**
 * @swagger
 * /api/v1/oems:
 *   get:
 *     summary: Get all OEMs
 *     tags: [OEM]
 *     responses:
 *       200:
 *         description: A list of OEMs
 */
router.get('/api/v1/oems', oemController.getAllOEMs);

/**
 * @swagger
 * /api/v1/oems/{id}:
 *   get:
 *     summary: Get an OEM by ID
 *     tags: [OEM]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OEM data retrieved successfully
 *       404:
 *         description: OEM not found
 */
router.get('/api/v1/oems/:id', oemController.getOEMById);

/**
 * @swagger
 * /api/v1/oems/{id}:
 *   put:
 *     summary: Update an OEM by ID
 *     tags: [OEM]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: OEM updated successfully
 *       404:
 *         description: OEM not found
 */
router.put('/api/v1/oems/:id', oemController.updateOEM);

/**
 * @swagger
 * /api/v1/oems/{id}:
 *   delete:
 *     summary: Delete an OEM by ID
 *     tags: [OEM]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OEM deleted successfully
 *       404:
 *         description: OEM not found
 */
router.delete('/api/v1/oems/:id', oemController.deleteOEM);

/**
 * @swagger
 * /api/v1/updateOEMStatus/{oem_id}/status:
 *   put:
 *     summary: Update OEM status
 *     tags: [OEMs]
 *     parameters:
 *       - in: path
 *         name: oem_id
 *         required: true
 *         schema:
 *           type: string
 *         description: OEM UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: Active
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       404:
 *         description: OEM not found
 */
router.put('/api/v1/updateOEMStatus/:oem_id/status', controller.updateOEMStatus);


/**
 * @swagger
 * /api/v1/getOEMStatus/{oem_id}/status:
 *   get:
 *     summary: Get the status of an OEM by ID
 *     tags: [OEMs]
 *     parameters:
 *       - in: path
 *         name: oem_id
 *         required: true
 *         schema:
 *           type: string
 *         description: OEM UUID
 *     responses:
 *       200:
 *         description: OEM status retrieved
 *       404:
 *         description: OEM not found
 */
router.get('/api/v1/getOEMStatus/:oem_id/status', controller.getOEMStatus);


module.exports = router;
