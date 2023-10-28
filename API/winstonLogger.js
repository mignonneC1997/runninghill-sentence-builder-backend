/* eslint-disable no-undef */
const winston = require('winston');

const { format, transports } = winston;
const path = require('path');

const serverPath = path.join('Logs', 'serverLogger.log');
const frontendPath = path.join('Logs', 'frontendLogger.log');
const logFormat = format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`);

frontendLogger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: format.combine(
        format.label({ label: path.basename(process.mainModule.filename) }),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        // Format the metadata object
        format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),
    ),
    transports: [
        new transports.File({
        filename: frontendPath,
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
