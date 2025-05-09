// models/dealerDetails.model.js
module.exports = (sequelize, Sequelize) => {
  const DealerDetails = sequelize.define('dealerDetails', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
      primaryKey: true,
    },
    oem_id: {
      type: Sequelize.UUID,
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
