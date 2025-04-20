const express = require('express');
const router = express.Router();
const controller = require('../controllers/campaignStrategyTemplateController');

/**
 * @swagger
 * tags:
 *   name: CampaignStrategyTemplate
 *   description: Strategy templates for campaign planning
 */

/**
 * @swagger
 * /api/v1/strategy-templates:
 *   post:
 *     summary: Create a new campaign strategy template
 *     tags: [CampaignStrategyTemplate]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Strategy created
 */
router.post('/api/v1/strategy-templates', controller.createStrategy);

/**
 * @swagger
 * /api/v1/strategy-templates:
 *   get:
 *     summary: Get all strategy templates
 *     tags: [CampaignStrategyTemplate]
 *     responses:
 *       200:
 *         description: List of templates
 */
router.get('/api/v1/strategy-templates', controller.getAllStrategies);

/**
 * @swagger
 * /api/v1/strategy-templates/{id}:
 *   get:
 *     summary: Get a strategy template by ID
 *     tags: [CampaignStrategyTemplate]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Template retrieved
 *       404:
 *         description: Not found
 */
router.get('/api/v1/strategy-templates/:id', controller.getStrategyById);

/**
 * @swagger
 * /api/v1/strategy-templates/{id}:
 *   put:
 *     summary: Update a strategy template
 *     tags: [CampaignStrategyTemplate]
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
 *         description: Updated
 *       404:
 *         description: Not found
 */
router.put('/api/v1/strategy-templates/:id', controller.updateStrategy);

/**
 * @swagger
 * /api/v1/strategy-templates/{id}:
 *   delete:
 *     summary: Delete a strategy template
 *     tags: [CampaignStrategyTemplate]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted
 *       404:
 *         description: Not found
 */
router.delete('/api/v1/strategy-templates/:id', controller.deleteStrategy);

module.exports = router;
