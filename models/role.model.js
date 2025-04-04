module.exports = (sequelize, Sequelize) => {
  const Role = sequelize.define('role', {
    roleId: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      unique: true,
      primaryKey: true,
    },
    roleName: {
      type: Sequelize.STRING,
    },
    level: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return Role;
};
