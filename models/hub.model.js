module.exports = (sequelize, Sequelize) => {
  const Hub = sequelize.define('hub', {
    hubId: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
      primaryKey: true,
    },
    type: {
      type: Sequelize.ENUM,
      values: ['YOUTUBE', 'E-COMMERCE', 'WEBSITE'],
    },
    url: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    credentials: {
      type: Sequelize.STRING(5000),
      allowNull: true
    }
  });


  return Hub;
};
