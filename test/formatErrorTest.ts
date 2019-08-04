import {createLogger, Logger, transports, format as f} from "winston";
import {common} from "@src/format";
import {extractDataFromError, formatError} from "@src/formatError";
import * as sinon from 'sinon';
import extractStack = require("extract-stack");

describe('formatError', () => {
    let logger: Logger;
    let stub: sinon.SinonStub;

    function getLog() {
        return stub.getCall(0).args[0];
    }

    beforeEach(() => {
        stub = sinon.stub().returns(false);

        logger = createLogger({
            format: f.combine(
                common,
                f(stub)()
            ),
            transports: [
                new transports.Console()
            ]
        })
    });

    describe('simple error', () => {
        const error = new Error('test');
        it('formatting', () => {
            logger.error('Some error', {error});
            const log = getLog();

            expect(log.metadata)
                .toEqual({
                    error: extractDataFromError(error)
                });
        });

        it('extracting data', () => {
            expect(extractDataFromError(error))
                .toEqual({
                    message: error.message,
                    name: error.name,
                    stack: extractStack.lines(error)
                });
        });
    });

    describe('custom error with extra data', () => {
        class CustomError extends Error {
            code: string;

            constructor(readonly data: any) {
                super('Some error');
                this.name = 'CustomError';
                this.code = 'A_001';
            }
        }

        const error = new CustomError({extra: 'data'});

        it('formatting', () => {
            logger.error('Some error', {error});
            const log = getLog();

            expect(log.metadata)
                .toEqual({
                    error: extractDataFromError(error)
                });
        });

        it('extracting data', () => {
            expect(extractDataFromError(error))
                .toEqual({
                    message: error.message,
                    code: error.code,
                    data: error.data,
                    name: error.name,
                    stack: extractStack.lines(error)
                });
        });
    });
});