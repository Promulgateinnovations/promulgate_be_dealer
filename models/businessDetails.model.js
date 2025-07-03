// models/businessDetails.model.js
module.exports = (sequelize, Sequelize) => {
    const BusinessDetails = sequelize.define('businessDetails', {
      business_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        primaryKey: true,
      },
      oem_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'oems',
          key: 'oem_id',
        },
        onDelete: 'CASCADE',
      },
      tagline: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      website_url: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      asset_categories: {
        type: Sequelize.TEXT, // could be JSON if you're storing structured data
        allowNull: true,
      },
      is_dam_connected: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      "outlet_focus": {
         type: Sequelize.VARCHAR5(50),
         allowNull: true,
      },
      "oem_brand_affiliation": {
         type: Sequelize.VARCHAR5(50),
         allowNull: true,
      }, 
      "primary_outlet_type": {
         type: Sequelize.VARCHAR5(50),
         allowNull: true,
      }, 
      "customer_segments": {
         type: Sequelize.VARCHAR5(50),
         allowNull: true,
      },
      "marketing_channels_used": {
         type: Sequelize.VARCHAR5(50),
         allowNull: true,
      }, 
      "advertising_budget_allocation": {
         type: Sequelize.VARCHAR5(50),
         allowNull: true,
      }, 
      "lead_capture_mechanism": {
         type: Sequelize.VARCHAR5(50),
         allowNull: true,
      }
    });
  
    return BusinessDetails;
  };
  