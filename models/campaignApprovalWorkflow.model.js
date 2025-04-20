// models/campaignApprovalWorkflow.model.js
module.exports = (sequelize, Sequelize) => {
    const CampaignApprovalWorkflow = sequelize.define('campaignApprovalWorkflow', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
    });
  
    return CampaignApprovalWorkflow;
  };
  