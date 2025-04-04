module.exports = (sequelize, Sequelize) => {
  const CampaignContent = sequelize.define('campaignContent', {
    campaignContentID: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
      primaryKey: true,
    },
    descritption: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    url: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    tags: {
      type: Sequelize.STRING(1000),
      allowNull: true
    },
    subject: {
      type: Sequelize.STRING(5000),
      allowNull:true
    },
    toEmail:{
      type: Sequelize.STRING(5000),
      allowNull:true
    },
    publishVideoAs:{
      type: Sequelize.STRING(1000),
      allowNull:false
    }
  });

  return CampaignContent;
};
