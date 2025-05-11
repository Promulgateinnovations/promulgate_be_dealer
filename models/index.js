// models/index.js

const dbConfig = require('../config/db.config.js');
const Sequelize = require('sequelize');

// Initialize Sequelize
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  port: 3306,
  pool: dbConfig.pool,
  dialectOptions: {
    options: {
      useUTC: false, // for reading from database
    },
  },
  operatorsAliases: false,
});

// Initialize DB Object
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import All Models
db.OEM = require('./oem.model.js')(sequelize, Sequelize);
db.Zone = require('./zone.model.js')(sequelize, Sequelize);
db.Region = require('./region.model.js')(sequelize, Sequelize);
db.BusinessDetails = require('./businessDetails.model.js')(sequelize, Sequelize);
db.DealerDetails = require('./dealerDetails.model.js')(sequelize, Sequelize);

// 🗂️ Import Other Models
db.agency = require('./agency.model.js')(sequelize, Sequelize);
db.organization = require('./organization.model.js')(sequelize, Sequelize);
db.role = require('./role.model.js')(sequelize, Sequelize);
db.user = require('./user.model.js')(sequelize, Sequelize);
db.team = require('./team.model.js')(sequelize, Sequelize);
db.campaignDefinition = require('./campaignDefinition.model.js')(sequelize, Sequelize);
db.campaignStrategyTemplate = require('./campaignStrategyTemplate.model.js')(sequelize, Sequelize);
db.invoiceDetails = require('./invoiceDetails.model.js')(sequelize, Sequelize);
db.budget = require('./budget.model.js')(sequelize, Sequelize);
db.business = require('./business.model.js')(sequelize, Sequelize);
db.asset = require('./asset.model.js')(sequelize, Sequelize);
db.analytics = require('./analytics.model.js')(sequelize, Sequelize);
db.subscription = require('./subscription.model.js')(sequelize, Sequelize);
db.lead = require('./lead.model.js')(sequelize, Sequelize);
db.socialPresence = require('./socialPresence.model.js')(sequelize, Sequelize);

// 🔗 Define Associations

// **OEM Associations**
db.OEM.hasMany(db.Zone, { foreignKey: 'oem_id', as: 'zones' });
db.OEM.hasMany(db.Region, { foreignKey: 'oem_id', as: 'regions' });
db.OEM.hasMany(db.DealerDetails, { foreignKey: 'oem_id', as: 'dealers' });
db.OEM.hasOne(db.BusinessDetails, { foreignKey: 'oem_id', as: 'businessDetails' });

// **Zone Associations**
db.Zone.belongsTo(db.OEM, { foreignKey: 'oem_id', as: 'oem' });
db.Zone.hasMany(db.Region, { foreignKey: 'zone_id', as: 'regions' });

// **Region Associations**
db.Region.belongsTo(db.Zone, { foreignKey: 'zone_id', as: 'zone' });
db.Region.belongsTo(db.OEM, { foreignKey: 'oem_id', as: 'oem' });

// **Dealer Associations**
db.DealerDetails.belongsTo(db.OEM, { foreignKey: 'oem_id', as: 'oem' });

// **Business Details Associations**
db.BusinessDetails.belongsTo(db.OEM, { foreignKey: 'oem_id', as: 'oem' });

// **Budget Associations**
db.OEM.hasMany(db.budget, { foreignKey: 'oem_id', as: 'budgets' });
db.budget.belongsTo(db.OEM, { foreignKey: 'oem_id', as: 'oem' });
db.budget.hasOne(db.invoiceDetails, { foreignKey: 'budget_id', as: 'invoiceDetails' });

// **Campaign Associations**
db.OEM.hasMany(db.campaignDefinition, { foreignKey: 'oem_id', as: 'campaigns' });
db.campaignDefinition.belongsTo(db.OEM, { foreignKey: 'oem_id', as: 'oem' });
db.campaignDefinition.hasMany(db.analytics, { foreignKey: 'campaign_id', as: 'analytics' });

// **User and Team Associations**
db.organization.hasMany(db.team, { foreignKey: 'organization_id', as: 'teams' });
db.team.belongsTo(db.organization, { foreignKey: 'organization_id', as: 'organization' });
db.user.belongsTo(db.organization, { foreignKey: 'organization_id', as: 'organization' });
db.user.belongsTo(db.agency, { foreignKey: 'agency_id', as: 'agency' });
db.team.belongsTo(db.user, { foreignKey: 'user_id', as: 'user' });

module.exports = db;
