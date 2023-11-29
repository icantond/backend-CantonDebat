import winston from "winston";
import configs from '../config/config.js';

let logger;

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warn: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',
        error: 'orange',
        warn: 'yellow',
        info: 'green',
        http: 'blue',
        debug: 'magenta'
    }
}

if (configs.environment === 'development') {
    logger = winston.createLogger({
        levels: customLevelOptions.levels,
        transports:[
            new winston.transports.Console({
                level: 'debug',
                format: winston.format.combine(
                    winston.format.colorize({
                        all: true,
                        colors: customLevelOptions.colors
                    }),
                    winston.format.simple()
                )
            })
        ]
    })
} else {
    logger = winston.createLogger({
        transports: [
            new winston.transports.File({
                level: 'info',
                filename: 'log/production.log'
            })
        ]
    })
};

export const addLogger = (req, res, next) => {
    req.logger = logger;
    req.logger.info(`Peticion ${req.method} a la ruta: ${req.url} - ${new Date().toISOString()}`);
    next();
}