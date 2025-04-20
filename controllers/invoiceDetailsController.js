const db = require('../models');
const InvoiceDetails = db.invoiceDetails;
const AppError = require('../utils/appError');

// CREATE
exports.createInvoice = async (req, res, next) => {
  try {
    const invoice = await InvoiceDetails.create(req.body);
    res.status(201).json({ status: 'success', data: invoice });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// READ ALL
exports.getAllInvoices = async (req, res, next) => {
  try {
    const invoices = await InvoiceDetails.findAll({ include: db.budget });
    res.status(200).json({ status: 'success', data: invoices });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// READ ONE
exports.getInvoiceById = async (req, res, next) => {
  try {
    const invoice = await InvoiceDetails.findByPk(req.params.id, { include: db.budget });
    if (!invoice) return next(new AppError('Invoice not found', 404));
    res.status(200).json({ status: 'success', data: invoice });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// UPDATE
exports.updateInvoice = async (req, res, next) => {
  try {
    const invoice = await InvoiceDetails.findByPk(req.params.id);
    if (!invoice) return next(new AppError('Invoice not found', 404));

    await invoice.update(req.body);
    res.status(200).json({ status: 'success', data: invoice });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// DELETE
exports.deleteInvoice = async (req, res, next) => {
  try {
    const result = await InvoiceDetails.destroy({ where: { invoice_id: req.params.id } });
    if (!result) return next(new AppError('Invoice not found', 404));
    res.status(200).json({ status: 'success', message: 'Invoice deleted successfully' });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};
