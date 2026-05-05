const { Sequelize } = require('sequelize');

const commonOptions = {
  dialect: 'mssql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 1433),
  dialectOptions: {
    options: {
      encrypt: false,
      trustServerCertificate: true,
      requestTimeout: 260000,
      connectTimeout: 30000,
    },
  },
  logging: false,
};

// First Database
const db1 = new Sequelize({
  ...commonOptions,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// Second Database
const db2 = new Sequelize({
  ...commonOptions,
  username: process.env.DB2_USER,
  password: process.env.DB2_PASS,
  database: process.env.DB2_NAME,
});

module.exports = { db1, db2 };