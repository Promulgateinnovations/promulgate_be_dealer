module.exports = (sequelize, Sequelize) => {
  const SocialMediaConnection = sequelize.define('socialMediaConnection', {
    socalMediaConnectionId: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    socialMediaType: {
      type: Sequelize.ENUM,
      values: ['ORGANIC', 'OTHER', 'DIRECT', 'PAID'],
      allowNull: false,
    },
    socialMediaHandle: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING(5000),
      allowNull: false,
    },
    tokenExpiry: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM,
      values: ['Active', 'InActive'],
      allowNull: false,
    },
    isConfigured: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    }
  });

  return SocialMediaConnection;
};
