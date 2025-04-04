module.exports = (sequelize, Sequelize) => {
  const Subscription = sequelize.define('subscription', {
    subscriptionId: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
      primaryKey: true,
    },
    orgId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    facebookSubscription: {
      type: Sequelize.STRING(5000),
      allowNull: true
    },
    instagramSubscription: {
      type: Sequelize.STRING(5000),
      allowNull: true
    },
    linkendinSubscription: {
      type: Sequelize.STRING(5000),
      allowNull: true
    },
    youtubeSubscription:{
      type: Sequelize.STRING(1000),
      allowNull: true
    }
  });

  return Subscription;
};
