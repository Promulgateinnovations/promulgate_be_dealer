module.exports = (sequelize, Sequelize) => {
    const socialAnalytics = sequelize.define('socialAnalytics', {
      analyticsId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      campaignId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      pageLikes: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      pageFollows: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      totalLikes: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      totalComments: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      totalVideos: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      totalViews: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      totalSubscribers: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      instTotalLikes: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      instTotalComments: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      postIdsUsed: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    });
  
    return socialAnalytics;
  };
  