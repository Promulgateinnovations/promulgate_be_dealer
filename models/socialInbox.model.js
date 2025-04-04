module.exports = (sequelize, Sequelize) => {
    const SocialInbox = sequelize.define('socialInbox', {
        socialInboxID: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        primaryKey: true,
      },
      channelName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      channelId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      postID: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      messageType: {
        type: Sequelize.ENUM,
        defaultValue: 'INCOMING',
        values: ['INCOMING', 'OUTGOING'],
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      isRead: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      sentTo: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      orgId: {
        type: Sequelize.STRING,
        allowNull: true,
      }
    });
  
    return SocialInbox;
  };
  