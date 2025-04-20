const db = require('../models');
const CampaignApprovalWorkflow = db.campaignApprovalWorkflow;
const AppError = require('../utils/appError');

// CREATE
exports.createWorkflow = async (req, res, next) => {
  try {
    const workflow = await CampaignApprovalWorkflow.create(req.body);
    res.status(201).json({ status: 'success', data: workflow });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// READ ALL
exports.getAllWorkflows = async (req, res, next) => {
  try {
    const workflows = await CampaignApprovalWorkflow.findAll();
    res.status(200).json({ status: 'success', data: workflows });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// READ ONE
exports.getWorkflowById = async (req, res, next) => {
  try {
    const workflow = await CampaignApprovalWorkflow.findByPk(req.params.id);
    if (!workflow) return next(new AppError('Workflow not found', 404));
    res.status(200).json({ status: 'success', data: workflow });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// UPDATE
exports.updateWorkflow = async (req, res, next) => {
  try {
    const workflow = await CampaignApprovalWorkflow.findByPk(req.params.id);
    if (!workflow) return next(new AppError('Workflow not found', 404));

    await workflow.update(req.body);
    res.status(200).json({ status: 'success', data: workflow });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// DELETE
exports.deleteWorkflow = async (req, res, next) => {
  try {
    const result = await CampaignApprovalWorkflow.destroy({ where: { id: req.params.id } });
    if (!result) return next(new AppError('Workflow not found', 404));
    res.status(200).json({ status: 'success', message: 'Workflow deleted successfully' });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};
