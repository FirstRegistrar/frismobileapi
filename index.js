require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const winston = require('winston');
const winstonRotate = require('winston-daily-rotate-file');
const cors = require('cors');  // Importing cors
const { db1, db2 } = require('./config/db');




// Set up Winston logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        
        // Rotate the log files daily and maintain logs for 7 days
        new winstonRotate({
            filename: 'logs/combined-%DATE%.log',  // Log file format
            datePattern: 'YYYY-MM-DD',  // Date format in the filename
            maxFiles: '7d',  // Keep logs for 7 days
            level: 'info',  // Log all info-level messages
        }),
        new winstonRotate({
            filename: 'logs/error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '7d',
            level: 'error',  // Only error logs for the error file
        })
    ]
});

// Test connections
(async () => {
    try {
        await db1.authenticate();
        console.log('Connection to the first database has been established successfully.');
        
        await db2.authenticate();
        console.log('Connection to the second database (fris_mobile_db) has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

const authenticate = require('./utils/authentication');
const verifyEmailRoute = require('./routes/verifyEmail');
const verifyMobileRoute = require('./routes/verifyMobile');
const fetchAccountsRoute = require('./routes/fetchAccounts');
const fetchStockAccountsRoute = require('./routes/fetchStockAccounts');
const fetchStockBalanceRoute = require('./routes/fetchStockBalance');
const fetchDividendRoute = require('./routes/fetchDividend');
const fetchSubscriptionRoute = require('./routes/fetchSubscription');
const addSubscriptionRoute = require('./routes/addSubscription');
const submitShareholdersFormRoute = require('./routes/submitShareholdersForm');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());  // This allows cross-origin requests

// Middleware
app.use(bodyParser.json());

// Log every request with Winston
app.use((req, res, next) => {
    logger.info(`Received ${req.method} request for ${req.url}`);
    next();
});

// Authentication Middleware
app.use((req, res, next) => {
    if (!authenticate(req)) {
        logger.warn(`Unauthorized access attempt on ${req.path}`);
        return res.status(401).json({ error: 'Invalid API Key, Version 1.1.7' });
    }
    next();
});

// Routes
app.use('/verifyEmail', verifyEmailRoute);
app.use('/verifyMobile', verifyMobileRoute);
app.use('/fetchAccounts', fetchAccountsRoute);
app.use('/fetchStockAccounts', fetchStockAccountsRoute);
app.use('/fetchStockBalance', fetchStockBalanceRoute);
app.use('/fetchDividend', fetchDividendRoute);
app.use('/fetchSubscription', fetchSubscriptionRoute);
app.use('/addSubscription', addSubscriptionRoute);
app.use('/submitShareholdersForm', submitShareholdersFormRoute);


// Default Route
app.get('/', (req, res) => {
    res.send('Welcome to the Estock Backend API 1.1.7');
});

// Error Handling for Undefined Routes
app.use((req, res) => {
    logger.error(`Route not found: ${req.method} ${req.url}`);
    res.status(404).json({ error: 'Route not found' });
});

// General Error Handling Middleware
app.use((err, req, res, next) => {
    logger.error(`Unexpected error: ${err.message}`, { stack: err.stack });
    res.status(500).json({ error: 'Fatal Error' });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
    logger.info(`Server is running on port ${PORT}`);
});
