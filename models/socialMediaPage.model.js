module.exports = (sequelize, Sequelize) => {
  const SocialMediaPage = sequelize.define('socialMediaPage', {
    socalMediaPageId: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
      primaryKey: true,
    },
    url: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING(5000),
      allowNull: false
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    }
  });

  return SocialMediaPage;
};
