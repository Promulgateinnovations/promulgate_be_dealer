const dbConfig = require('../config/db.config.js');

const Sequelize = require('sequelize');
const { disabled } = require('../app.js');
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  dialectOptions: {
    //socketPath: '/cloudsql/promulgate-386418:us-central1:promulgate',
    options: {
      useUTC: false, // for reading from database
    },
  },
  operatorsAliases: false,
  port: 3306,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.agency = require('./agency.model.js')(sequelize, Sequelize);
db.organization = require('./organization.model.js')(sequelize, Sequelize);
db.role = require('./role.model.js')(sequelize, Sequelize);
db.user = require('./user.model.js')(sequelize, Sequelize);
db.team = require('./team.model.js')(sequelize, Sequelize);
db.campaignDefinition = require('./campaignDefinition.model')(
  sequelize,
  Sequelize
);
db.whatsappBroadcastContnent = require('./whatsappBroadcastContnent.model')(
  sequelize,
  Sequelize
);
db.whatsappContentPost = require('./whatsappContentPost.model')(
  sequelize,
  Sequelize
);
db.whatsappTemplates = require('./whatsappTemplates.model')(
  sequelize,
  Sequelize
);
db.tempWpToken = require('./tempWpToken.model')(
  sequelize,
  Sequelize
);
db.waBroadcastLog = require('./waBroadcastLog.model')(
  sequelize,
  Sequelize
);
db.campaignViewer = require('./campaignViewer.model')(sequelize, Sequelize);
db.socialMediaConnection = require('./socialMediaConnection.model')(
  sequelize,
  Sequelize
);
db.socialMediaPage = require('./socialMediaPage.model')(
  sequelize,
  Sequelize
);

db.campaignSelectionChannel = require('./campaignSelectionChannel.model')(
  sequelize,
  Sequelize
);
db.campaignContent = require('./campaignContent.model')(sequelize, Sequelize);
db.campaignContentPost = require('./campaignContentPost.model')(
  sequelize,
  Sequelize
);
db.campaignComments = require('./campaignComment.model')(sequelize, Sequelize);
db.business = require('./business.model')(sequelize, Sequelize);
db.hub = require('./hub.model')(sequelize, Sequelize);
db.asset = require("./asset.model")(sequelize, Sequelize)
db.analytics= require("./analytics.model")(sequelize, Sequelize)
db.subscription= require("./subscription.model")(sequelize, Sequelize)
db.lead = require("./lead.model.js")(sequelize,Sequelize)
db.leadContact = require("./leadContacts.model.js")(sequelize,Sequelize)
db.socialPresence= require("./socialPresence.model")(sequelize, Sequelize)
db.whatsappStatistics= require("./whatsappStatistics.model")(sequelize, Sequelize)
db.youtubeAnalytics= require("./youtubeAnalytics.model")(sequelize, Sequelize)
// db.whatsappLeadFollowup= require("./whatsappLeadFollowup.model.js")(sequelize, Sequelize)
// db.whatsappLeads= require("./whatsappLeads.model")(sequelize, Sequelize)
db.socialInbox= require("./socialInbox.model")(sequelize, Sequelize)
db.socialAnalytics= require("./socialAnalytics.model")(sequelize, Sequelize)


// db.whatsappLeadFollowup.hasMany(db.whatsappLeads, { 
//   foreignKey: { allowNull: true },
//   constraints: false
// });

db.organization.hasMany(db.team, {
  foreignKey: { allowNull: true },
  constraints: false
});

db.agency.hasMany(db.organization, {
  foreignKey: { allowNull: true },
  constraints: false
})
db.user.belongsTo(db.agency, { 
  foreignKey: { allowNull: true },
  constraints: false
});

db.user.belongsTo(db.organization, {
  foreignKey: { allowNull: true },
  constraints: false
});

db.organization.hasMany(db.campaignDefinition, {
  foreignKey: { allowNull: false },
  onDelete: 'CASCADE',
});

db.team.belongsTo(db.role, {
  foreignKey: { allowNull: false },
  constraints: false
});
db.team.belongsTo(db.agency, {
  foreignKey: { allowNull: false },
  constraints: false
});

db.business.belongsTo(db.asset, {
  foreignKey: { allowNull: true },
  constraints: false
});

db.team.belongsTo(db.organization, {
  foreignKey: { allowNull: false },
  constraints: false
});

db.team.belongsTo(db.user, {
  foreignKey: { allowNull: false },
  constraints: false
});

db.campaignDefinition.belongsTo(db.organization, {
  foreignKey: { allowNull: false },
  onDelete: 'CASCADE',
});
db.organization.hasMany(db.socialMediaConnection, {
  foreignKey: { allowNull: false },
  onDelete: 'CASCADE',
});

db.socialMediaConnection.hasOne(db.socialMediaPage, {
  foreignKey: { allowNull: false },
  onDelete: 'CASCADE',
});

db.organization.hasOne(db.business, {
  foreignKey: { allowNull: false },
  onDelete: 'CASCADE',
});

db.business.belongsTo(db.hub, {
  foreignKey: { allowNull: true },
  constraints: false
});

// db.user.belongsTo(db.role, {
//   foreignKey: { allowNull: true },
//   constraints: false
// });
db.campaignDefinition.belongsTo(db.user, {
  foreignKey: { allowNull: false },
  onDelete: 'CASCADE',
});
db.campaignDefinition.hasOne(db.campaignViewer, {
  foreignKey: { allowNull: false },
  onDelete: 'CASCADE',
});
db.campaignDefinition.hasMany(db.campaignComments, {
  foreignKey: { allowNull: false },
  onDelete: 'CASCADE',
});

db.campaignDefinition.hasMany(db.campaignSelectionChannel, {
  foreignKey: { allowNull: false },
  onDelete: 'CASCADE',
});

db.campaignSelectionChannel.belongsTo(db.campaignDefinition, {
  foreignKey: { allowNull: false },
  onDelete: 'CASCADE',
})

db.campaignComments.belongsTo(db.user, {
  foreignKey: { allowNull: false },
  onDelete: 'CASCADE',
});

db.campaignSelectionChannel.hasMany(db.campaignContent, {
  foreignKey: { allowNull: false },
  onDelete: 'CASCADE',
});

db.campaignSelectionChannel.belongsTo(db.socialMediaConnection, {
  foreignKey: { allowNull: false },
  onDelete: 'CASCADE',
});
db.campaignContent.belongsTo(db.campaignSelectionChannel, {
  foreignKey: { allowNull: false },
  onDelete: 'CASCADE',
});
db.campaignContent.hasMany(db.campaignContentPost, {
  foreignKey: { allowNull: false },
  onDelete: 'CASCADE',
});
db.campaignContentPost.belongsTo(db.campaignContent, {
  foreignKey: { allowNull: false },
  onDelete: 'CASCADE',
});
db.whatsappContentPost.belongsTo(db.whatsappBroadcastContnent, {
  foreignKey: { allowNull: false },
  onDelete: 'CASCADE',
});
db.waBroadcastLog.belongsTo(db.whatsappBroadcastContnent, {
  foreignKey: { allowNull: false },
  onDelete: 'CASCADE',
});
db.whatsappStatistics.belongsTo(db.whatsappBroadcastContnent, {
  foreignKey: { allowNull: false },
  onDelete: 'CASCADE',
});
// db.youtubeAnalytics.belongsTo(db.campaignDefinition, {
//   foreignKey: { allowNull: false },
//   onDelete: 'CASCADE',
// });
// db.user.belongsTo(db.organization, {
//   as: 'organizations',
//   foreignKey: 'org_id',
// });

module.exports = db;
