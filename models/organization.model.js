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
    outlet_address: {
      type: Sequelize.STRING(1234),
    },
    parent_company_name: {
      type: Sequelize.STRING(1234),
    },
    outlet_code: {
      type: Sequelize.STRING(1234),
    },
    franchise_type: {
      type: Sequelize.STRING(1234),
    },
    billing_responsibility: {
      type: Sequelize.STRING(1234),
    },
    marketing_budget_allocation: {
      type: Sequelize.STRING(1234),
    },
    region_served: {
      type: Sequelize.STRING(1234),
    },

  });

  return Organization;
};