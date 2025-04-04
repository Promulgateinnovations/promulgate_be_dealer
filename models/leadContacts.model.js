module.exports = (sequelize, Sequelize) => {
    const LeadContact = sequelize.define('leadContact', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        primaryKey: true,
      },
      lead_id:{
        type:Sequelize.UUID,
        allowNull:false,
      },
      first_name:{
        type: Sequelize.STRING,
        allowNull:false
      },
      last_name:{
        type: Sequelize.STRING,
        allowNull:false
      },
      phone_number:{
        type: Sequelize.STRING,
        allowNull:false
      },
      email:{
        type: Sequelize.STRING,
        allowNull:false
      },
      orgId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status:{
        type:Sequelize.INTEGER,
        defaultValue:0,
      },
      is_duplicate:{
        type:Sequelize.INTEGER,
        defaultValue:0,
        allowNull:true
      },
      createdAt:{
        type:Sequelize.DATE,
        defaultValue:Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt:{
        type:Sequelize.DATE,
        defaultValue:Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
    return LeadContact;
  };
  