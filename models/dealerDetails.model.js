// models/dealerDetails.model.js
module.exports = (sequelize, Sequelize) => {
    const DealerDetails = sequelize.define('dealerDetails', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      dealerName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      dealerCode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      dealerDescription: {
        type: Sequelize.STRING,
      },
      admin_name: {
        type: Sequelize.STRING,
      },
      admin_email: {
        type: Sequelize.STRING,
      },
      admin_phone: {
        type: Sequelize.STRING, // Use STRING to avoid number formatting issues
      },
      channeltype: {
        type: Sequelize.STRING,
      },
      channeltypestatus: {
        type: Sequelize.STRING,
      },
      channelList: {
        type: Sequelize.STRING, // Or TEXT if large
      }
    });
  
    return DealerDetails;
  };
  