module.exports = (sequelize, Sequelize) => {
  const CampaignDefinition = sequelize.define('campaignDefinition', {
    campaignDefinitionId: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    objective: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    topic: {
      type: Sequelize.STRING,
    },
    videoUrl: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    influencers: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    startAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    endAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    totalAudience: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM,
      defaultValue: 'NEW',
      values: ['NEW', 'IN_REVIEW', 'APPROVED', 'LIVE', 'COMPLETED'],
    },
    campaignTypes: {
      type: Sequelize.ENUM,
      values: ['Acquisitions', 'Behaviour', 'Conversions'],
    },
    captiveMembers: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    tags: {
      type: Sequelize.STRING(1000),
      allowNull: true
    },
    fbLeadsAmount: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    whatsAppLeadsAmount: {
      type: Sequelize.INTEGER,
      allowNull: true
    }
  });

  return CampaignDefinition;
};
