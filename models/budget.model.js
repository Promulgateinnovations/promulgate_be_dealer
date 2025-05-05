// models/budget.model.js
module.exports = (sequelize, Sequelize) => {
    const Budget = sequelize.define('budget', {
      budget_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        primaryKey: true,
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
      currency: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      over_budget_approval: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      billing_cycle: {
        type: Sequelize.STRING(100),
        allowNull: false,
      }
    });
  
    return Budget;
  };
  