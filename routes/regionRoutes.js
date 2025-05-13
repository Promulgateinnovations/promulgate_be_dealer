const express = require('express');
const router = express.Router();
const regionController = require('../controllers/regionController');

/**
 * @swagger
 * tags:
 *   name: Region
 *   description: Region management under Zones
 */

/**
 * @swagger
 * /api/v1/regions:
 *   post:
 *     summary: Create a new region
 *     tags: [Region]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               zone_id:
 *                 type: integer
 *               region_name:
 *                 type: string
 *               region_code:
 *                 type: string
 *               admin_email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Region created successfully
 */
router.post('/api/v1/regions', regionController.createRegion);

/**
 * @swagger
 * /api/v1/regions:
 *   get:
 *     summary: Get all regions
 *     tags: [Region]
 *     responses:
 *       200:
 *         description: List of regions
 */
router.get('/api/v1/regions', regionController.getAllRegions);

/**
 * @swagger
 * /api/v1/regions/{id}:
 *   get:
 *     summary: Get a region by ID
 *     tags: [Region]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Region retrieved
 *       404:
 *         description: Region not found
 */
router.get('/api/v1/regions/:id', regionController.getRegionById);

/**
 * @swagger
 * /api/v1/regions/{id}:
 *   put:
 *     summary: Update a region
 *     tags: [Region]
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
 *         description: Region updated
 *       404:
 *         description: Region not found
 */
router.put('/api/v1/regions/:id', regionController.updateRegion);

/**
 * @swagger
 * /api/v1/regions/{id}:
 *   delete:
 *     summary: Delete a region
 *     tags: [Region]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Region deleted
 *       404:
 *         description: Region not found
 */
router.delete('/api/v1/regions/:id', regionController.deleteRegion);

/**
 * @swagger
 * /api/v1/regions/{oem_id}/{zone_id}:
 *   get:
 *     summary: Get all regions by OEM ID and Zone ID
 *     tags: [Regions]
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
 *     responses:
 *       200:
 *         description: List of regions
 */
router.get('/api/v1/regions/:oem_id/:zone_id', regionController.getRegionsByOEMAndZone);


/**
 * @swagger
 * /api/v1/regions/{oem_id}:
 *   get:
 *     summary: Get all regions by OEM ID
 *     tags: [Regions]
 *     parameters:
 *       - in: path
 *         name: oem_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of regions
 */
router.get('/api/v1/regions/:oem_id', regionController.getRegionsByOEM);

module.exports = router;
