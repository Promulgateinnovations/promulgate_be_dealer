module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('user', {
    userId: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
      primaryKey: true,
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lastName: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    userName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING.BINARY,
      allowNull: false,
    },
    userStatus: {
      type: Sequelize.ENUM,
      values: ['NEW', 'ACTIVE', 'INACTIVE'],
    },
    oemId: {
      type: Sequelize.UUID
      
    },
    regionId: {
      type: Sequelize.UUID
      
    },
    zoneId: {
      type: Sequelize.UUID
      
    },
    userType: {
       type: Sequelize.STRING
      
    },
  });

  return User;
};
