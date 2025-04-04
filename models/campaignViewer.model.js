module.exports = (sequelize, Sequelize) => {
  const CampaignViewer = sequelize.define('CampaignViewer', {
    campaignViewerId: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
      primaryKey: true,
    },
    ageMax: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    ageMin: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    psychographic: {
      type: Sequelize.STRING,
    },
    gender: {
      type: Sequelize.STRING
    },
    languages: {
      type: Sequelize.STRING
    },
    state: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    country: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return CampaignViewer;
};
