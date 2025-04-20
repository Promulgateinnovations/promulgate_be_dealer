// models/campaignStrategyTemplate.model.js
module.exports = (sequelize, Sequelize) => {
    const CampaignStrategyTemplate = sequelize.define('campaignStrategyTemplate', {
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
  
    return CampaignStrategyTemplate;
  };
  