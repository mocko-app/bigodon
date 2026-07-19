const Lab = require('@hapi/lab');
const Code = require('@hapi/code');

const { compile, compileExpression, run, default: Bigodon } = require('../../dist');
const { VERSION } = require('../../dist/parser/index');
const { Execution } = require('../../dist/runner/execution');

const { describe, it } = exports.lab = Lab.script();
const { expect } = Code;

describe('runner', () => {
    describe('Execution', () => {
        it('should use default values in of()', () => {
            const execution = Execution.of({});
            expect(execution.extraHelpers).to.be.an.instanceof(Map);
            expect(execution.extraHelpers.size).to.equal(0);
            expect(execution.maxExecutionMillis).to.equal(Infinity);
            expect(execution.allowDefaultHelpers).to.equal(true);
        });

        it('should handle explicit undefined values for all options', () => {
            const execution = Execution.of({}, undefined, {
                data: undefined,
                maxExecutionMillis: undefined,
                allowDefaultHelpers: undefined
            });
            expect(execution.maxExecutionMillis).to.equal(Infinity);
            expect(execution.allowDefaultHelpers).to.equal(true);
        });

        it('should handle zero maxExecutionMillis', () => {
            const execution = Execution.of({}, new Map(), { maxExecutionMillis: 0 });
            expect(execution.maxExecutionMillis).to.equal(Infinity);
        });

        it('should handle null maxExecutionMillis', () => {
            const execution = Execution.of({}, new Map(), { maxExecutionMillis: null });
            expect(execution.maxExecutionMillis).to.equal(Infinity);
        });

        it('should handle null allowDefaultHelpers', () => {
            const execution = Execution.of({}, new Map(), { allowDefaultHelpers: null });
            expect(execution.allowDefaultHelpers).to.equal(true);
        });

        it('should handle explicit true/false allowDefaultHelpers', () => {
            const e1 = Execution.of({}, new Map(), { allowDefaultHelpers: true });
            expect(e1.allowDefaultHelpers).to.equal(true);
            const e2 = Execution.of({}, new Map(), { allowDefaultHelpers: false });
            expect(e2.allowDefaultHelpers).to.equal(false);
        });
    });

    it('should not run unsupported versions', async () => {
        await expect(run({
            type: 'TEMPLATE',
            version: -1,
            statements: [],
        })).to.reject();

        await expect(run({
            type: 'TEMPLATE',
            version: 1e9,
            statements: [],
        })).to.reject();
    });

    it('should return text statements', async () => {
        const templ = compile('Lorem ipsum');
        expect(await templ()).to.equal('Lorem ipsum');
    });

    it('should ignore comments', async () => {
        const templ = compile('Lorem {{! ipsum }} dolor');
        expect(await templ()).to.equal('Lorem  dolor');
    });

    describe('mustache', () => {
        it('should return literal path expressions', async () => {
            const templ = compile('Hello, {{ "George" }}!');
            expect(await templ()).to.equal('Hello, George!');
        });

        it('should return simple path expressions', async () => {
            const templ = compile('Hello, {{ name }}!');
            expect(await templ({ name: 'George' })).to.equal('Hello, George!');
            expect(await templ()).to.equal('Hello, !');
            expect(await templ({})).to.equal('Hello, !');
            expect(await templ({ name: null })).to.equal('Hello, !');
            expect(await templ({ name: 5 })).to.equal('Hello, 5!');
            expect(await templ({ name: false })).to.equal('Hello, false!');
        });

        it('should return empty for function-valued simple path expressions', async () => {
            const templ = compile('Hello, {{ foo }}!');
            expect(await templ({ foo: () => {} })).to.equal('Hello, !');
        });

        it('should return deep path expressions', async () => {
            const templ = compile('Hello, {{ name.first }} {{ name.last }}!');
            expect(await templ({ name: { first: 'George', last: 'Schmidt' } })).to.equal('Hello, George Schmidt!');
            expect(await templ()).to.equal('Hello,  !');
            expect(await templ({})).to.equal('Hello,  !');
            expect(await templ({ name: null })).to.equal('Hello,  !');
            expect(await templ({ name: 5 })).to.equal('Hello,  !');
            expect(await templ({ name: false })).to.equal('Hello,  !');
        });

        it('should return empty for function-valued deep path expressions', async () => {
            const templ = compile('Hello, {{ foo.bar }}!');
            expect(await templ({ foo: () => {} })).to.equal('Hello, !');
        });

        it('should return empty for function-valued own properties', async () => {
            const templ = compile('{{ obj.fn }}');
            expect(await templ({ obj: { fn() { return 'x'; } } })).to.equal('');
        });

        it('should allow $this for helper-path disambiguisation', async () => {
            const bigodon = new Bigodon();
            bigodon.addHelper('foo', () => 'wrong');
            const templ = bigodon.compile('{{ $this.foo }} {{ $this.obj.deep }}');
            expect(await templ({ foo: 'bar', obj: { deep: 'baz' } })).to.equal('bar baz');
        });

        it('should return context values converted to string', async () => {
            const templ = compile('{{ obj }} {{ arr }} {{ str }} {{ num }} {{ bTrue }} {{ bFalse }} {{ nil }} {{ undef }}');
            expect(await templ({
                obj: {},
                arr: [],
                str: 'foo',
                num: 0,
                bTrue: true,
                bFalse: false,
                nil: null,
                undef: void 0,
            })).to.equal('[object Object] [object Array] foo 0 true false  ');
        });

        it('should ignore unsafe keys', async () => {
            const templ = compile('Hello, {{ name.constructor }} {{ name.__proto__ }}!');
            expect(await templ({ name: {
                __proto__: 'foo',
                constructor: 'bar',
            } })).to.equal('Hello,  !');
        });

        it('should not return Object prototype keys', async () => {
            const templ = compile('{{ hasOwnProperty }}{{ obj.toString }}{{ obj.hasOwnProperty }}');
            expect(await templ({ obj: {} })).to.equal('');
        });

        it('should not return Array prototype keys', async () => {
            const templ = compile('{{ arr.length }}{{ arr.toString }}');
            expect(await templ({ arr: [] })).to.equal('');
        });

        it('should not return String prototype keys', async () => {
            const templ = compile('{{ str.length }}{{ str.toString }}');
            expect(await templ({ str: 'yada' })).to.equal('');
        });

        it('should not return Number prototype keys', async () => {
            const templ = compile('{{ num.toString }}{{ num.toFixed }}');
            expect(await templ({ num: 1 })).to.equal('');
        });

        it('should ignore unknown statements', async () => {
            const result = await run({
                type: 'TEMPLATE',
                version: VERSION,
                statements: [{
                    type: 'TEXT',
                    value: 'foo',
                }, {
                    type: 'ABLUEBLUE',
                    value: 'noope',
                }, {
                    type: 'TEXT',
                    value: 'bar',
                }]
            });

            expect(result).to.equal('foobar');
        });
    });

    describe('expressions', () => {
        it('should return undefined with literal with no value', async () => {
            const templ = compileExpression('foo');
            expect(await templ()).to.equal(undefined);
        });

        it('should return literal value', async () => {
            const templ = compileExpression('foo');
            expect(await templ({ foo: 'bar' })).to.equal('bar');
        });

        it('should return undefined for function-valued expression results', async () => {
            const templ = compileExpression('foo');
            expect(await templ({ foo: () => {} })).to.equal(undefined);
        });

        it('should return undefined for function-valued expression traversal', async () => {
            const templ = compileExpression('foo.bar');
            expect(await templ({ foo: () => {} })).to.equal(undefined);
        });

        it('should evaluate expression as true', async () => {
            const templ = compileExpression('eq foo "bar"');
            expect(await templ({ foo: 'bar' })).to.equal(true);
        });

        it('should evaluate expression as false', async () => {
            const templ = compileExpression('eq foo "bar"');
            expect(await templ({ foo: 'barz' })).to.equal(false);
        });

        it('should evaluate more complex expression as true', async () => {
            const templ = compileExpression('and (startsWith foo "b") (eq fruit "apple")');
            expect(await templ({ foo: 'bar', fruit: 'apple' })).to.equal(true);
        });
    });

    describe('time limit', () => {
        const bigArray = new Array(1e6).fill(1);
        const source = `{{#each bigArray}}"foo"{{/each}}`;
        const templ = compile(source);

        it('should interrupt execution after limit', async () => {
            // Dry running first so code is cached in memory
            await templ({ bigArray }, { maxExecutionMillis: 5 }).catch(() => {});

            // Creating execution before awaiting so this time isn't included
            const promise = templ({ bigArray }, {
                maxExecutionMillis: 50,
            }).catch(() => {});


            const start = Date.now();
            await promise;
            const elapsed = Date.now() - start;

            expect(elapsed).to.be.below(55);
            expect(elapsed).to.be.above(49);
        });

        it('should interrupt execution with error', async () => {
            const promise = templ({ bigArray }, { maxExecutionMillis: 5 });
            await expect(promise).to.reject('Execution time limit exceeded');
        });

        it('should not interrupt when execution takes less than limit', async () => {
            const template = compile('Hello, {{foo}}');
            expect(await template({ foo: 'bar' }, { maxExecutionMillis: 50 })).to.equal('Hello, bar');
        });
    });
});
