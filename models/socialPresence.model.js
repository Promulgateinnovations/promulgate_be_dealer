module.exports = (sequelize, Sequelize) => {
  const SocialPresence = sequelize.define('socialPresence', {
    socialPresenceId: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
      primaryKey: true,
    },
    socialName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    totalPosts: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    totalFollowing: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    totalFollowers: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    socalMediaConnectionId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    organizationOrgId: {
      type: Sequelize.STRING,
      allowNull: false,
    }
  });

  return SocialPresence;
};
