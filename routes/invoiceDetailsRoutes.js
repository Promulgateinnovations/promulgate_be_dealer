const express = require('express');
const router = express.Router();
const controller = require('../controllers/invoiceDetailsController');

/**
 * @swagger
 * tags:
 *   name: InvoiceDetails
 *   description: Invoice info linked to budgets
 */

/**
 * @swagger
 * /api/v1/invoices:
 *   post:
 *     summary: Create invoice details
 *     tags: [InvoiceDetails]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               budget_id:
 *                 type: integer
 *               gstin:
 *                 type: string
 *               address:
 *                 type: string
 *               state:
 *                 type: string
 *     responses:
 *       201:
 *         description: Invoice created
 */
router.post('/api/v1/invoices', controller.createInvoice);

/**
 * @swagger
 * /api/v1/invoices:
 *   get:
 *     summary: Get all invoices
 *     tags: [InvoiceDetails]
 *     responses:
 *       200:
 *         description: List of invoices
 */
router.get('/api/v1/invoices', controller.getAllInvoices);

/**
 * @swagger
 * /api/v1/invoices/{id}:
 *   get:
 *     summary: Get invoice by ID
 *     tags: [InvoiceDetails]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Invoice retrieved
 *       404:
 *         description: Not found
 */
router.get('/api/v1/invoices/:id', controller.getInvoiceById);

/**
 * @swagger
 * /api/v1/invoices/{id}:
 *   put:
 *     summary: Update invoice
 *     tags: [InvoiceDetails]
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
router.put('/api/v1/invoices/:id', controller.updateInvoice);

/**
 * @swagger
 * /api/v1/invoices/{id}:
 *   delete:
 *     summary: Delete invoice
 *     tags: [InvoiceDetails]
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
router.delete('/api/v1/invoices/:id', controller.deleteInvoice);

/**
 * @swagger
 * /api/v1/InvoiceDetailsByOEM/{oem_id}:
 *   get:
 *     summary: Get invoice details by OEM ID
 *     tags: [InvoiceDetails]
 *     parameters:
 *       - in: path
 *         name: oem_id
 *         required: true
 *         schema:
 *           type: string
 *         description: OEM UUID
 *     responses:
 *       200:
 *         description: Invoice details retrieved
 *       404:
 *         description: Not found
 */
router.get('/api/v1/InvoiceDetailsByOEM/:oem_id', controller.getInvoiceDetailsByOEM);

module.exports = router;
