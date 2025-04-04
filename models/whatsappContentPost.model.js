module.exports = (sequelize, Sequelize) => {
    const WhatsappContentPost = sequelize.define('whatsappContentPost', {
        whatsappContentPostID: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        primaryKey: true,
      },
      postAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      postId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      accessToken: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      postStatus: {
        type: Sequelize.ENUM,
        defaultValue: 'WAITING',
        values: ['WAITING', 'SUCCESS', 'FAILED'],
      },
      orgID: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      whatsAppId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    });
    return WhatsappContentPost;
  };
  