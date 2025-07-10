module.exports = {
  HOST: '127.0.0.1',
  USER: 'root',
  PASSWORD: 'devAB143!',
  DB: 'promulgateVersion2',
  dialect: 'mysql',
  pool: {
    max: 20,
    min: 5,
    acquire: 60000,
    idle: 15000,
  },
  dialectOptions: {
    connectTimeout: 60000
  }
};
