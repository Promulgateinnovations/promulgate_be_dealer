module.exports = (sequelize, Sequelize) => {
    const Asset = sequelize.define('asset', {
      assetId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      expiry: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      credentials: {
        type: Sequelize.STRING(5000),
        allowNull: true
      }
    });
  
  
    return Asset;
  };