import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import { createLogger, format, transports } from 'winston';

const options = {
    console: {
        level: 'debug',
    },
    file: {
        filename: 'error.log',
        level: 'error',
    },
};

// for development environment
const developmentLogger = {
    format: format.combine(
        format.timestamp(),
        format.ms(),
        format.errors({ stack: true }),
        nestWinstonModuleUtilities.format.nestLike('App', {
            appName: true,
            colors: true,
            prettyPrint: true,
            processId: true,
        })
    ),
    transports: [new transports.Console(options.console)],
};

// for production environment
const productionLogger = {
    format: format.combine(format.timestamp(), format.errors({ stack: true }), format.json()),
    transports: [
        new transports.File(options.file),
        new transports.File({
            filename: 'combine.log',
            level: 'info',
        }),
    ],
};

// export log instance based on the current environment
const instanceLogger = process.env.NODE_ENV === 'production' ? productionLogger : developmentLogger;

export const winstonLogger = createLogger(instanceLogger);
