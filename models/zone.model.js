// models/zone.model.js
module.exports = (sequelize, Sequelize) => {
    const Zone = sequelize.define('zone', {
      zone_id: {
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
      zone_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      zone_code: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      admin_email: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      zoneDescription:{
        type: Sequelize.TEXT,
        allowNull: true,
      },
      admin_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      admin_phone: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      zone_status: {
        type: Sequelize.ENUM,
        values: ['ACTIVE', 'INACTIVE'],
        defaultValue: 'ACTIVE',
      },
      zone_addr:{
        type: Sequelize.STRING(255),
        allowNull: true,
      }
    });
  
    return Zone;
  };
  