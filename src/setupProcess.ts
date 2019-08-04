import {Logger} from "winston";

export function setupProcess(logger: Logger) {
    process.on('uncaughtException', (error: Error) => {
        logger.error(error);
    });
}