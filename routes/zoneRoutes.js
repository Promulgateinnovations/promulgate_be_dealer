const express = require('express');
const router = express.Router();
const zoneController = require('../controllers/zoneController');

/**
 * @swagger
 * tags:
 *   name: Zone
 *   description: Zone management related to OEMs
 */

/**
 * @swagger
 * /api/v1/zones:
 *   post:
 *     summary: Create a new zone
 *     tags: [Zone]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oem_id:
 *                 type: integer
 *               zone_name:
 *                 type: string
 *               zone_code:
 *                 type: string
 *               admin_email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Zone created successfully
 */
router.post('/api/v1/zones', zoneController.createZone);

/**
 * @swagger
 * /api/v1/zones:
 *   get:
 *     summary: Get all zones
 *     tags: [Zone]
 *     responses:
 *       200:
 *         description: List of zones
 */
router.get('/api/v1/zones', zoneController.getAllZones);

/**
 * @swagger
 * /api/v1/zones/{id}:
 *   get:
 *     summary: Get zone by ID
 *     tags: [Zone]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Zone retrieved
 *       404:
 *         description: Zone not found
 */
router.get('/api/v1/zones/:id', zoneController.getZoneById);

/**
 * @swagger
 * /api/v1/zones/{id}:
 *   put:
 *     summary: Update a zone
 *     tags: [Zone]
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
 *         description: Zone updated
 *       404:
 *         description: Zone not found
 */
router.put('/api/v1/zones/:id', zoneController.updateZone);

/**
 * @swagger
 * /api/v1/zones/{id}:
 *   delete:
 *     summary: Delete a zone
 *     tags: [Zone]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Zone deleted
 *       404:
 *         description: Zone not found
 */
router.delete('/api/v1/zones/:id', zoneController.deleteZone);

/**
 * @swagger
 * /api/v1/oemzones/{oem_id}:
 *   get:
 *     summary: Get all zones by OEM ID
 *     tags: [Zones]
 *     parameters:
 *       - in: path
 *         name: oem_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of zones
 */
router.get('/api/v1/ZonesByOEM/:oem_id',  zoneController.getZonesByOEM);

module.exports = router;
