import {format as f} from 'winston';
import {formatError} from "./formatError";

export const common = f.combine(
    f.timestamp(),
    f.metadata({
        fillExcept: ['component', 'level', 'message', 'timestamp']
    }),
    formatError()
);

export const humanReadable = f.combine(
    common,
    f(info => {
        if (info.metadata) {
            if (Object.keys(info.metadata).length > 0) {
                info.metadata = ' ' + JSON.stringify(info.metadata);
            } else {
                info.metadata = '';
            }
        }
        return info;
    })(),
    f.printf(({level, message, component, metadata, timestamp}) => {
        return `${timestamp} ${level.toUpperCase()} [${component || 'none'}] ${message}${metadata}`;
    })
);

export const json = f.combine(
    common,
    f(info => {
        info.level = info.level.toUpperCase();
        info.component = info.component || 'none';
        return info;
    })(),
    f.json()
);

