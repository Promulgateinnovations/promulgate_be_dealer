module.exports = (sequelize, Sequelize) => {
    const WaBroadcastLog = sequelize.define('waBroadcastLog', {
        waBroadcastLogID: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        primaryKey: true,
      },
      wp_template_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      phone_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      postID: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM,
        defaultValue: 'FAILED',
        values: ['SUCCESS', 'FAILED'],
      },
      sent: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      delivered: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      read: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      received: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      replied: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      fromNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      sentDateTime: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      readDateTime: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      deliveredDateTime: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      repliedDateTime: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      repliedMsg: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      leadId: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      wa_campaign: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      wa_campaign_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      error_log: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    });
  
    return WaBroadcastLog;
  };
  