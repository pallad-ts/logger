import * as _format from './format';
import {createLogger} from "winston";

export const format = _format;
export const logger = createLogger({
    format: process.env.PALLAD_LOGGER_FORMAT === 'json' ? format.json : format.humanReadable
});

export * from './setupProcess';
export * from './createLoggerForComponent';