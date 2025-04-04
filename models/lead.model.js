module.exports = (sequelize, Sequelize) => {
  const Lead = sequelize.define(
    'lead',
    {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        primaryKey: true,
      },
      source: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      total_records: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      duplicates: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      response: {
        type: Sequelize.STRING,
        defaultValue: 'temp response',
      },
      file_name: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      orgId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      //   created:{
      //     type:Sequelize.DATE,
      //     defaultValue:Sequelize.literal('CURRENT_TIMESTAMP')
      //   },
      //   updated:{
      //     type:Sequelize.DATE,
      //     defaultValue:'0000-00-00 00:00:00'
      //   },
    },
    {
      timestamps: true,
    }
  );
  return Lead;
};
