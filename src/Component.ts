import * as is from 'predicates';
import minimatch = require('minimatch');

const isValidPart = is.all(
    is.notBlank,
    is.match(/^[a-z0-9_\-]$/i)
);

function assertPart(part: string) {
    if (!isValidPart(part)) {
        throw new Error(`Invalid component name part: ${part}. Cannot be blank, only alphanumeric characters, "_" and "-" allowed.`);
    }
}

export class Component {
    constructor(readonly parts: string[]) {
        parts.forEach(assertPart);
        Object.freeze(this);
    }

    join(component: Component): Component {
        return new Component([...this.parts, ...component.parts]);
    }

    get name() {
        return this.toString();
    }

    toString() {
        return this.parts.join('.');
    }

    matches(pattern: string) {
        return minimatch(this.name, pattern, {nocase: true});
    }

    static parse(input: string) {
        const parts = input.split('.');

        parts.forEach(x => {
            assertPart(x);
            return x;
        });

        return new Component(parts);
    }
}