const express = require('express');
const router = express.Router();
const dealerDetailcontroller = require('../controllers/dealerDetailsController');

/**
 * @swagger
 * tags:
 *   name: DealerDetails
 *   description: Manage dealer info
 */

/**
 * @swagger
 * /api/v1/dealers:
 *   post:
 *     summary: Create a dealer
 *     tags: [DealerDetails]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dealerName: { type: string }
 *               dealerCode: { type: string }
 *               dealerDescription: { type: string }
 *               admin_name: { type: string }
 *               admin_email: { type: string }
 *               admin_phone: { type: string }
 *               channeltype: { type: string }
 *               channeltypestatus: { type: string }
 *               channelList: { type: string }
 *               oem_id: { type: integer }
 *     responses:
 *       201:
 *         description: Dealer created
 */
router.post('/api/v1/dealers', dealerDetailcontroller.createDealer);

/**
 * @swagger
 * /api/v1/dealers:
 *   get:
 *     summary: Get all dealers
 *     tags: [DealerDetails]
 *     parameters:
 *       - in: query
 *         name: oem_id
 *         schema: { type: integer }
 *         description: Filter dealers by OEM ID
 *     responses:
 *       200:
 *         description: List of dealers
 */
router.get('/api/v1/dealers', dealerDetailcontroller.getAllDealers);

/**
 * @swagger
 * /api/v1/dealers/{id}:
 *   get:
 *     summary: Get dealer by ID
 *     tags: [DealerDetails]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: integer }
 *         required: true
 *     responses:
 *       200:
 *         description: Dealer retrieved
 *       404:
 *         description: Not found
 */
router.get('/api/v1/dealers/:id', dealerDetailcontroller.getDealerById);

/**
 * @swagger
 * /api/v1/dealers/{id}:
 *   put:
 *     summary: Update dealer
 *     tags: [DealerDetails]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: integer }
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { type: object }
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Not found
 */
router.put('/api/v1/dealers/:id', dealerDetailcontroller.updateDealer);

/**
 * @swagger
 * /api/v1/dealers/{id}:
 *   delete:
 *     summary: Delete dealer
 *     tags: [DealerDetails]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: integer }
 *         required: true
 *     responses:
 *       200:
 *         description: Deleted
 *       404:
 *         description: Not found
 */
router.delete('/api/v1/dealers/:id', dealerDetailcontroller.deleteDealer);

/**
 * @swagger
 * /api/v1/dealers/{oem_id}/{zone_id}/{region_id}:
 *   get:
 *     summary: Get all dealers by OEM ID, Zone ID, and Region ID
 *     tags: [DealerDetails]
 *     parameters:
 *       - in: path
 *         name: oem_id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: zone_id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: region_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of dealers
 */
router.get('/api/v1/DealersByOEMZoneRegion/:oem_id/:zone_id/:region_id', dealerDetailcontroller.getDealersByOEMZoneRegion);

module.exports = router;