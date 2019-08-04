import {format as f} from "winston";
import extractStack = require('extract-stack');

export const formatError = f(info => {
    if (info.metadata) {
        for (const key of Object.keys(info.metadata)) {
            const value = info.metadata[key];
            if (value instanceof Error) {
                info.metadata[key] = extractDataFromError(value);
            }
        }
    }
    return info;
});

export function extractDataFromError(error: Error) {
    return {
        ...error,
        message: error.message,
        name: error.name,
        stack: extractStack.lines(error)
    }
}