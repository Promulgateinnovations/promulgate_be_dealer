module.exports = (sequelize, Sequelize) => {
  const Team = sequelize.define('team', {
    teamId: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
      primaryKey: true,
    },
  });
  return Team;
};
