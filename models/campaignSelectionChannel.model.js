module.exports = (sequelize, Sequelize) => {
  const CampaignSelectionChannel = sequelize.define(
    'campaignSelectionChannel',
    {
      campaignSelectionId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        primaryKey: true,
      },
    }
  );

  return CampaignSelectionChannel;
};
