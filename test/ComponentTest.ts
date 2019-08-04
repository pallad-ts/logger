import {Component} from "@src/Component";

describe('Component', () => {
    describe('parsing', () => {
        it.each<[string, Component]>([
            ['a.b.c', new Component(['a', 'b', 'c'])],
            ['a', new Component(['a'])]
        ])('case: %s', (input, expected) => {
            expect(Component.parse(input))
                .toEqual(expected);
        });

        it.each([
            ['empty strings', ''],
            ['invalid part names', 'a.*'],
            ['empty parts', 'a..b']
        ])('invalid component: %s', (_, input) => {
            expect(() => {
                Component.parse(input)
            })
                .toThrowError(/Invalid component name part/);
        });
    });

    it('joining', () => {
        expect(Component.parse('a').join(Component.parse('b.c')))
            .toHaveProperty('name', 'a.b.c');

        expect(Component.parse('a.b').join(Component.parse('c.d')))
            .toHaveProperty('name', 'a.b.c.d');
    });

    describe('matching', () => {
        const component = Component.parse('a.b.c.d.e');
        it.each([
            ['a.*'],
            ['a.*.d.*'],
            ['a.b.c.*'],
            ['a.{b,d}.*']
        ])('valid: %s',input => {
            expect(component.matches(input))
                .toBeTruthy();
        });

        it.each([
            ['a.*.d'],
            ['b.*']
        ])('invalid: %s',input => {
            expect(component.matches(input))
                .toBeFalsy();
        })
    })
});