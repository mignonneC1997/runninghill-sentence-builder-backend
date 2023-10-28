/* eslint-disable no-undef */
const winston = require('winston');

const { format, transports } = winston;
const path = require('path');

const serverPath = path.join('Logs', 'serverLogger.log');
const frontendMobilePath = path.join('Logs', 'frontendLogger.log');
const logFormat = format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`);

frontendMobileLogger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: format.combine(
        format.label({ label: path.basename(process.mainModule.filename) }),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        // Format the metadata object
        format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),
    ),
    transports: [
        new transports.File({
        filename: frontendMobilePath,
        format: format.combine(
            logFormat,
        ),
        }),
    ],
    exitOnError: false,
});

serverLogger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: format.combine(
        format.label({ label: path.basename(process.mainModule.filename) }),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        // Format the metadata object
        format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),
    ),
    transports: [
        new transports.File({
        filename: serverPath,
        format: format.combine(
            logFormat,
        ),
        }),
    ],
    exitOnError: false,
});


module.exports = {
    serverLogger,
    frontendLogger
};
