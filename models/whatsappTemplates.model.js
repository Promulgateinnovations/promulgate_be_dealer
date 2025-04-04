module.exports = (sequelize, Sequelize) => {
    const WhatsappTemplates = sequelize.define('whatsappTemplates', {
        whatsappTemplatesID: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        primaryKey: true,
      },
      wp_template_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      file_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      body: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      footer: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM,
        defaultValue: 'PENDING',
        values: ['PENDING', 'PUBLISHED', 'REJECTED'],
      }
    });
  
    return WhatsappTemplates;
  };
  