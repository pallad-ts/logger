import {humanReadable, json} from '@src/format';

const LEVEL = Symbol.for('level');
const MESSAGE: any = Symbol.for('message');

function createLog(level: string, message: string, otherData?: any) {
    return {
        [LEVEL]: level,
        level,
        message,
        ...(otherData || {})
    };
}

function assertTransformResult(info: any): info is { [key: string]: string } {
    if (MESSAGE in info) {
        return true;
    }
    throw new Error('Log transformation result is no an object')
}


describe('humanReadable', () => {
    it.each([
        [
            'simple',
            createLog('info', 'Some message'),
            'INFO [none] Some message'
        ],
        [
            'with metadata',
            createLog('debug', 'Message', {error: 'test', stack: ['val1', 'val2']}),
            'DEBUG [none] Message {"error":"test","stack":["val1","val2"]}'
        ],
        [
            'with component and meta',
            createLog('warn', 'Message', {component: 'repository.test', extra: 'value'}),
            'WARN [repository.test] Message {"extra":"value"}'
        ]
    ])('Log: %s', (_, log, expected) => {
        const result = humanReadable.transform(log);
        if (assertTransformResult(result)) {
            expect(result[MESSAGE]).toEqual(
                `${result.timestamp} ${expected}`
            );
        }
    })
});

describe('json', () => {
    it.each([
        [
            'simple',
            createLog('info', 'Some message'),
            {
                level: 'INFO',
                message: 'Some message',
                component: 'none',
                metadata: {}
            }
        ],
        [
            'with metadata',
            createLog('debug', 'Message', {error: 'test', stack: ['val1', 'val2']}),
            {
                level: 'DEBUG',
                message: 'Message',
                component: 'none',
                metadata: {error: 'test', stack: ['val1', 'val2']}
            }
        ],
        [
            'with component and meta',
            createLog('warn', 'Message', {component: 'repository.test', extra: 'value'}),
            {
                level: 'WARN',
                message: 'Message',
                component: 'repository.test',
                metadata: {extra: 'value'}
            }
        ]
    ])
    ('Log: %s', (_, log, expected) => {
        const result = json.transform(log);
        if (assertTransformResult(result)) {
            expect(JSON.parse(result[MESSAGE]))
                .toEqual(
                    {
                        timestamp: result.timestamp,
                        ...expected
                    }
                );
        }
    });
});