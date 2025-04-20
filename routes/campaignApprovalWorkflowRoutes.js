const express = require('express');
const router = express.Router();
const controller = require('../controllers/campaignApprovalWorkflowController');

/**
 * @swagger
 * tags:
 *   name: CampaignApprovalWorkflow
 *   description: Manage campaign approval workflows
 */

/**
 * @swagger
 * /api/v1/workflows:
 *   post:
 *     summary: Create a new campaign approval workflow
 *     tags: [CampaignApprovalWorkflow]
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
 *         description: Workflow created
 */
router.post('/api/v1/workflows', controller.createWorkflow);

/**
 * @swagger
 * /api/v1/workflows:
 *   get:
 *     summary: Get all workflows
 *     tags: [CampaignApprovalWorkflow]
 *     responses:
 *       200:
 *         description: List of workflows
 */
router.get('/api/v1/workflows', controller.getAllWorkflows);

/**
 * @swagger
 * /api/v1/workflows/{id}:
 *   get:
 *     summary: Get workflow by ID
 *     tags: [CampaignApprovalWorkflow]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Workflow retrieved
 *       404:
 *         description: Not found
 */
router.get('/api/v1/workflows/:id', controller.getWorkflowById);

/**
 * @swagger
 * /api/v1/workflows/{id}:
 *   put:
 *     summary: Update workflow
 *     tags: [CampaignApprovalWorkflow]
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
router.put('/api/v1/workflows/:id', controller.updateWorkflow);

/**
 * @swagger
 * /api/v1/workflows/{id}:
 *   delete:
 *     summary: Delete workflow
 *     tags: [CampaignApprovalWorkflow]
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
router.delete('/api/v1/workflows/:id', controller.deleteWorkflow);

module.exports = router;
