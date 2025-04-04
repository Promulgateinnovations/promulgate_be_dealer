module.exports = (sequelize, Sequelize) => {
  const WhatsappBroadcastContnent = sequelize.define(
    'whatsappBroadcastContnent',
    {
      whatsappBroadcastContnentID: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        primaryKey: true,
      },
      wa_template_lang: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      wp_template: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      wa_campaign: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      file_url: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      selected_leads: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM,
        defaultValue: 'NEW',
        values: ['NEW', 'COMPLETED', 'LIVE'],
      },
      orgId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    }
  );

  return WhatsappBroadcastContnent;
};
