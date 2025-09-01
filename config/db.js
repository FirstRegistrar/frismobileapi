const { Sequelize } = require('sequelize');

// First Database
const db1 = new Sequelize({
    dialect: 'mssql',
    host: process.env.DB_HOST,
    username: process.env.DB2_USER,
    password: process.env.DB2_PASS,
    database: process.env.DB_NAME,
    dialectOptions: {
        encrypt: false,
        requestTimeout: 260000,
    },
    logging: false,
});

// Second Database (fris_mobile_db)
const db2 = new Sequelize({
    dialect: 'mssql',
    host: process.env.DB_HOST,
    username: process.env.DB2_USER,
    password: process.env.DB2_PASS,
    database: process.env.DB2_NAME,
    dialectOptions: {
        encrypt: false,
        requestTimeout: 260000,
    },
    logging: false,
});

module.exports = { db1, db2 };

