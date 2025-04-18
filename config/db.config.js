module.exports = {
  HOST: '127.0.0.1',
  USER: 'root',
  PASSWORD: 'devAB143!',
  DB: 'promulgateVersion2',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
