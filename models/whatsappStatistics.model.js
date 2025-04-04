module.exports = (sequelize, Sequelize) => {
    const WhatsappStatistics = sequelize.define('whatsappStatistics', {
        whatsappStatisticsId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        primaryKey: true,
      },
      sent: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      delivered: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      read: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      received: {
        type: Sequelize.STRING,
        allowNull: true,
      }
    });
    return WhatsappStatistics;
  };
  