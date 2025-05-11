// models/index.js

const dbConfig = require('../config/db.config.js');
const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  port: 3306,
  pool: dbConfig.pool,
  dialectOptions: {
    options: {
      useUTC: false,
    },
  },
  operatorsAliases: false,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Dynamically load all models from the models directory
fs.readdirSync(__dirname)
  .filter(file => file !== 'index.js' && file.endsWith('.js'))
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize);
    db[model.name] = model;
  });

// Set up relationships
db.OEM.hasMany(db.Zone, { foreignKey: 'oem_id', as: 'zones' });
db.Zone.belongsTo(db.OEM, { foreignKey: 'oem_id', as: 'oem' });

db.Zone.hasMany(db.Region, { foreignKey: 'zone_id', as: 'regions' });
db.Region.belongsTo(db.Zone, { foreignKey: 'zone_id', as: 'zone' });

db.OEM.hasMany(db.Region, { foreignKey: 'oem_id', as: 'regions' });
db.Region.belongsTo(db.OEM, { foreignKey: 'oem_id', as: 'oem' });

db.OEM.hasMany(db.DealerDetails, { foreignKey: 'oem_id', as: 'dealers' });
db.DealerDetails.belongsTo(db.OEM, { foreignKey: 'oem_id', as: 'oem' });

db.OEM.hasOne(db.BusinessDetails, { foreignKey: 'oem_id', as: 'businessDetails' });
db.BusinessDetails.belongsTo(db.OEM, { foreignKey: 'oem_id', as: 'oem' });

module.exports = db;
