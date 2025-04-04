module.exports = (sequelize, Sequelize) => {
  const Analytics = sequelize.define('analytics', {
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
    connections: {
      type: Sequelize.STRING(5000),
      allowNull: true
    },
    reach: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    campaignDefinitionId:{
      type: Sequelize.STRING,
      allowNull: false,
    },
    engagement: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return Analytics;
};
