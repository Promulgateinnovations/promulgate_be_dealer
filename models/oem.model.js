// models/oem.model.js
module.exports = (sequelize, Sequelize) => {
    const OEM = sequelize.define('oem', {
      oem_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        primaryKey: true,
      },
      oem_name: {
        type: Sequelize.STRING,
      },
      oem_code: {
        type: Sequelize.STRING(50),
      },
      oem_logo_url: {
        type: Sequelize.TEXT,
      },
      oem_website_url: {
        type: Sequelize.TEXT,
      },
      primary_contact_name: {
        type: Sequelize.STRING,
      },
      primary_contact_email: {
        type: Sequelize.STRING,
      },
      primary_contact_phone: {
        type: Sequelize.STRING(50),
      },
      superuser_name: {
        type: Sequelize.STRING,
      },
      superuser_email: {
        type: Sequelize.STRING,
      },
      superuser_phone: {
        type: Sequelize.STRING(50),
      },
      operating_country: {
        type: Sequelize.STRING(100),
      },
      time_zone: {
        type: Sequelize.STRING(100),
      },
      regions_states: {
        type: Sequelize.TEXT,
      },
      hierarchy_level: {
        type: Sequelize.STRING(100),
      },
      number_of_outlets: {
        type: Sequelize.INTEGER,
      },
      campaign_approval_workflow_id: {
        type: Sequelize.STRING(100),
      },
      campaign_strategy_template_id: {
        type: Sequelize.INTEGER,
      },
      content_approval_role_id: {
         type: Sequelize.STRING(100),
      },
      channel_access: {
        type: Sequelize.ENUM('Paid', 'Organic', 'Both'),
      },
      channels: {
        type: Sequelize.TEXT,
      },
      analytics_enabled: {
        type: Sequelize.BOOLEAN,
      },
      reporting_frequency: {
        type: Sequelize.STRING(100),
      },
      custom_kpis: {
        type: Sequelize.TEXT,
      },
      oem_address: {
        type: Sequelize.TEXT,
      }, 
      Operational_purview: {
        type: Sequelize.STRING(100),  
      },
      onboarding: {
        type: Sequelize.ENUM('OEM', 'Zone', 'Region','DealerShip'),
      },
      onboarding_name: {
        type: Sequelize.STRING(100),
      },
      oem_status: {
        type: Sequelize.ENUM('Active', 'Inactive', 'Pending'),
        defaultValue: 'Active',
      }
    });
  
    return OEM;
  };
  