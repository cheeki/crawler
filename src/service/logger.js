import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

winston.transports.DailyRotateFile = DailyRotateFile;

export var logger = new winston.Logger({
    transports: [
        new winston.transports.DailyRotateFile({
            name: 'info-log',
            level: 'info',
            filename: './log/all-logs.log',
            datePattern: 'yyyyMMdd.',
            prepend: true,
            handleExceptions: true,
            json: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false
        }),
        new winston.transports.DailyRotateFile({
            name: 'error-log',
            level: 'error',
            filename: './log/error-logs.log',
            datePattern: 'yyyyMMdd.',
            prepend: true,
            handleExceptions: true,
            json: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false
        }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false,
    exceptionHandlers: [
        new winston.transports.File({ filename: './log/exceptions.log' })
    ]
});

logger.stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};
