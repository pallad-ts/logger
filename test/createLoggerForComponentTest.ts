import {createLogger, format, Logger, transports} from 'winston';
import * as sinon from 'sinon';
import {createLoggerForComponent} from "@src/createLoggerForComponent";

describe('createLoggerForComponent', () => {
    let logger: Logger;
    let stub: sinon.SinonStub;

    beforeEach(() => {
        stub = sinon.stub().returns(false);

        logger = createLogger({
            format: format(stub)(),
            transports: [
                new transports.Console()
            ]
        });
    });

    function assertLogWithComponent(component: string) {
        sinon.assert.calledWith(
            stub,
            sinon.match.has('component', sinon.match(component))
        );
    }

    function assertLogWithoutComponent() {
        sinon.assert.calledWith(
            stub,
            sinon.match(value => {
                return !('component' in value)
            }, "without component")
        );
    }

    describe('for component', () => {
        it('simple', () => {
            const newLogger = createLoggerForComponent(logger, 'a');
            newLogger.info('foo');

            assertLogWithComponent('a');
        });

        it('sub component', () => {
            const newLogger = createLoggerForComponent(createLoggerForComponent(logger, 'a'), 'b');
            newLogger.info('foo');

            assertLogWithComponent('a.b');
        });

        it('sub sub component', () => {
            const newLogger = createLoggerForComponent(createLoggerForComponent(logger, 'a'), 'b.c');

            newLogger.info('foo');
            assertLogWithComponent('a.b.c');
        });

        it('does not modify original logger', () => {
            createLoggerForComponent(logger, 'c');

            logger.info('foo');

            assertLogWithoutComponent();
        });
    });
});