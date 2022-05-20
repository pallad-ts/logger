import {createLogger, transports} from "winston";
import {format} from "./index";

function getFormat() {
    const loggerFormat = (process.env.PALLAD_LOGGER_FORMAT || '').toLowerCase();
    if (loggerFormat === 'json') {
        return 'json';
    }

    if (loggerFormat === 'human' || loggerFormat === 'human-readable') {
        return 'human';
    }

    if (process.env.NODE_ENV === 'production') {
        return 'json';
    }

    return 'human';
}


export const logger = createLogger({
    level: process.env.PALLAD_LOGGER_LEVEL || 'info',
    format: getFormat() === 'json' ? format.json : format.humanReadable,
    transports: [
        new transports.Console()
    ]
});

export const globalLogger = logger;
