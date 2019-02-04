var winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    timestamp: winston.format.timestamp(),
    format: winston.format.json(),
    transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log`
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
    write: function(message, encoding) {
        // use the 'info' log level so the output will be picked up by both transports (file and console)
        logger.info(message);
    },
};

module.exports = logger;