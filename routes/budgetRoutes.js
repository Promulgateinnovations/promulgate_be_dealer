const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');

/**
 * @swagger
 * tags:
 *   name: Budget
 *   description: Budget configuration for OEMs
 */

/**
 * @swagger
 * /api/v1/budgets:
 *   post:
 *     summary: Create a new budget
 *     tags: [Budget]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oem_id:
 *                 type: integer
 *               currency:
 *                 type: string
 *               over_budget_approval:
 *                 type: boolean
 *               billing_cycle:
 *                 type: string
 *     responses:
 *       201:
 *         description: Budget created successfully
 */
router.post('/api/v1/budgets', budgetController.createBudget);

/**
 * @swagger
 * /api/v1/budgets:
 *   get:
 *     summary: Get all budgets
 *     tags: [Budget]
 *     responses:
 *       200:
 *         description: List of budgets
 */
router.get('/api/v1/budgets', budgetController.getAllBudgets);

/**
 * @swagger
 * /api/v1/budgets/{id}:
 *   get:
 *     summary: Get a budget by ID
 *     tags: [Budget]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Budget retrieved
 *       404:
 *         description: Budget not found
 */
router.get('/api/v1/budgets/:id', budgetController.getBudgetById);

/**
 * @swagger
 * /api/v1/budgets/{id}:
 *   put:
 *     summary: Update a budget
 *     tags: [Budget]
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
 *         description: Budget updated
 *       404:
 *         description: Budget not found
 */
router.put('/api/v1/budgets/:id', budgetController.updateBudget);

/**
 * @swagger
 * /api/v1/budgets/{id}:
 *   delete:
 *     summary: Delete a budget
 *     tags: [Budget]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Budget deleted
 *       404:
 *         description: Budget not found
 */
router.delete('/api/v1/budgets/:id', budgetController.deleteBudget);

/**
 * @swagger
 * tags:
 *   name: Budget
 *   description: Budget details management
 */

/**
 * @swagger
 * /api/v1/budgets/{oem_id}:
 *   get:
 *     summary: Get budget details by OEM ID
 *     tags: [Budget]
 *     parameters:
 *       - in: path
 *         name: oem_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The OEM UUID
 *     responses:
 *       200:
 *         description: Budget details retrieved
 *       404:
 *         description: Budget not found
 */
router.get('/api/v1/BudgetDetailsByOEM/:oem_id', controller.getBudgetDetailsByOEM);

module.exports = router;
