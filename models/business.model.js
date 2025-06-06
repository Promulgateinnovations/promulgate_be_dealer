module.exports = (sequelize, Sequelize) => {
  const Business = sequelize.define('business', {
    businessId: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
      primaryKey: true,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    tagLine: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    competitor1: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    competitor2: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    descriptionTags: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM,
      values: ['ACTIVE', 'INACTIVE'],
      defaultValue: 'ACTIVE',
    },
    standardPageTags: {
      type: Sequelize.STRING,
      allowNull: true,
    },  
  });

  return Business;
};
