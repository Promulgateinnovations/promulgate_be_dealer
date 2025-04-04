module.exports = (sequelize, Sequelize) => {
    const TempWpToken = sequelize.define('tempWpToken', {
        waBroadcastLogID: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        primaryKey: true,
      },
      token: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      expiry: {
        type: Sequelize.STRING,
        allowNull: true,
      }
    });
  
    return TempWpToken;
  };
  