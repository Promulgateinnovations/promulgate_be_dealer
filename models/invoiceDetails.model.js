// models/invoiceDetails.model.js
module.exports = (sequelize, Sequelize) => {
    const InvoiceDetails = sequelize.define('invoiceDetails', {
      invoice_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        primaryKey: true,
      },
      budget_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'budgets',
          key: 'budget_id',
        },
        onDelete: 'CASCADE',
      },
      gstin: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      state: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM,
        values: ['ACTIVE', 'INACTIVE'],
        defaultValue: 'ACTIVE',
      },
      business_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      business_phone: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
    });
  
    return InvoiceDetails;
  };
  