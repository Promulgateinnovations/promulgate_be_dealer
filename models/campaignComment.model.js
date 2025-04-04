module.exports = (sequelize, Sequelize) => {
  const campaignComments = sequelize.define('campaignComments', {
    campaignCommentId: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      unique: true,
      primaryKey: true,
    },
    comments: {
      type: Sequelize.STRING,
    },
  });

  return campaignComments;
};
