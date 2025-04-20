// models/region.model.js
module.exports = (sequelize, Sequelize) => {
    const Region = sequelize.define('region', {
      region_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      zone_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'zones',
          key: 'zone_id',
        },
        onDelete: 'CASCADE',
      },
      region_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      region_code: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      admin_email: {
        type: Sequelize.STRING(255),
        allowNull: false,
      }
    });
  
    return Region;
  };
  