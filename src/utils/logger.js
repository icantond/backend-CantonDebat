import winston, { debug } from "winston";
import 'winston-daily-rotate-file';
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
        error: 'magenta',
        warn: 'yellow',
        info: 'green',
        http: 'cyan',
        debug: 'blue'
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
    const fileTransporter = new winston.transports.DailyRotateFile({
        filename: 'application-%DATE%.log',
        datePattern: 'YYYY-MM-DD-HH-mm',
        dirname: '/log',
        zippedArchive: true,
        maxSize: '1m',
        maxFiles: 3,
        frequency: '1m', //Si queremos generar un archivo diario, cambiamos frecuencia a un día
        level: 'debug',

        })
    // logger = winston.createLogger({
    //     transports: [
    //         new winston.transports.File({
    //             level: 'info',
    //             filename: 'log/production.log'
    //         })
    //     ]
    // })
};

export const addLogger = (req, res, next) => {
    req.logger = logger;
    req.logger.info(`Peticion ${req.method} a la ruta: ${req.url} - ${new Date().toISOString()}`);
    next();
}