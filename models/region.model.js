// models/region.model.js
module.exports = (sequelize, Sequelize) => {
    const Region = sequelize.define('region', {
      region_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        primaryKey: true,
      },
      zone_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'zones',
          key: 'zone_id',
        },
        onDelete: 'CASCADE',
      },
      oem_id: {
        type: Sequelize.UUID,
        allowNull: false,
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
      },
      admin_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },  
      admin_phone: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      region_status: {
        type: Sequelize.ENUM,
        values: ['ACTIVE', 'INACTIVE'],
        defaultValue: 'ACTIVE',
      }  
    });
  
    return Region;
  };
  