// models/dealerDetails.model.js
module.exports = (sequelize, Sequelize) => {
  const DealerDetails = sequelize.define('dealerDetails', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    oem_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'oems',
        key: 'oem_id',
      },
      onDelete: 'CASCADE',
    },
    dealerName: Sequelize.STRING,
    dealerCode: Sequelize.STRING,
    dealerDescription: Sequelize.STRING,
    admin_name: Sequelize.STRING,
    admin_email: Sequelize.STRING,
    admin_phone: Sequelize.STRING,
    channeltype: Sequelize.STRING,
    channeltypestatus: Sequelize.STRING,
    channelList: Sequelize.STRING
  });

  return DealerDetails;
};
