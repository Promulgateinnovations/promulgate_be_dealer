module.exports = (sequelize, Sequelize) => {
  const Organization = sequelize.define('organization', {
    orgId: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    aliasName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    orgUrl: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    orgStatus: {
      type: Sequelize.ENUM,
      values: ['NEW', 'ACTIVE', 'INACTIVE'],
    },
    orgSmPolicy: {
      type: Sequelize.STRING(1234),
    },
  });

  return Organization;
};
