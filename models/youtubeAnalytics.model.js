module.exports = (sequelize, Sequelize) => {
    const YoutubeAnalytics = sequelize.define('youtubeAnalytics', {
        youtubeAnalyticsId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        primaryKey: true,
      },
      channelId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      views: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      whatch_time: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      videos_published: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      total_likes: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      playlists: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      audience_retention: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      recent_videos: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      audience_by_countries: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      audience_by_demographics: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      traffic_source: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      external_source: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      audience: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      addedBy: {
        type: Sequelize.STRING,
        allowNull: true,
      }
    });
    return YoutubeAnalytics;
  };
  