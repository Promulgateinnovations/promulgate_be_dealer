module.exports = {
  HOST: '34.28.148.208',
  USER: 'root',
  PASSWORD: 'promulgate',
  DB: 'promulgate',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
