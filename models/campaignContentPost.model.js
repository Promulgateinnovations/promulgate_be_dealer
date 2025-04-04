module.exports = (sequelize, Sequelize) => {
  const CampaignContentPost = sequelize.define('campaignContentPost', {
    campaignContentPostID: {
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
    postStatus: {
      type: Sequelize.ENUM,
	  defaultValue: 'WAITING',
      values: ['WAITING', 'SUCCESS', 'FAILED'],
    },
    apiResponse: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    apiResponseMessage: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  });

  return CampaignContentPost;
};
