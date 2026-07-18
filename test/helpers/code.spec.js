const Lab = require('@hapi/lab');
const Code = require('@hapi/code');

const { compile } = require('../../dist');
const { codeHelpers } = require('../../dist/runner/helpers/code');

const { describe, it } = exports.lab = Lab.script();
const { expect } = Code;

describe('helpers', () => { describe('code', () => {

    describe('if', () => {
        it('should evaluate on true, only', async () => {
            const templ = compile('{{#if foo}}yes{{else}}no{{/if}}');
            expect(await templ({ foo: 'foo' })).to.equal('yes');
            expect(await templ({ foo: '' })).to.equal('no');
        });

        it('should not change context', async () => {
            const templ = compile('{{#if foo}}{{name}}{{else}}no{{/if}}');
            expect(await templ({ foo: { name: 'wrong' }, name: 'foo' })).to.equal('foo');
        });

        it('should run only once', async () => {
            const templ = compile('{{#if foo}}yes{{else}}no{{/if}}');
            expect(await templ({ foo: [1, 2, 3] })).to.equal('yes');
        });
    });

    describe('object', () => {
        it('should build an object from named parameters', async () => {
            const templ = compile('{{json (object a=1 b="x" c=flag)}}');
            expect(await templ({ flag: true })).to.equal('{"a":1,"b":"x","c":true}');
        });

        it('should build nested objects', async () => {
            const templ = compile('{{json (object user=(object name=name))}}');
            expect(await templ({ name: 'George' })).to.equal('{"user":{"name":"George"}}');
        });

        it('should build an empty object without parameters', async () => {
            const templ = compile('{{json (object)}}');
            expect(await templ()).to.equal('{}');
        });

        it('should not accept positional parameters', async () => {
            const templ = compile('{{object 1 a=2}}');
            await expect(templ()).to.reject(/object only accepts named parameters/i);
        });

        it('should be usable as a block context', async () => {
            const templ = compile('{{#with (object a=1)}}{{a}}{{/with}}');
            expect(await templ()).to.equal('1');
        });
    });

    describe('typeof', () => {
        it('should return typeof', async () => {
            const templ = compile('{{typeof foo}}');
            expect(await templ({ foo: 'foo' })).to.equal('string');
            expect(await templ({ foo: 1 })).to.equal('number');
            expect(await templ({ foo: true })).to.equal('boolean');
            expect(await templ({ foo: undefined })).to.equal('undefined');
            expect(await templ({ foo: {} })).to.equal('object');
        });
    });

    describe('with', () => {
        it('should evaluate with the given context of string, number and boolean', async () => {
            const templ = compile('{{#with foo}}{{$this}}{{/with}}');
            expect(await templ({ foo: 'foo' })).to.equal('foo');
            expect(await templ({ foo: 5 })).to.equal('5');
            expect(await templ({ foo: true })).to.equal('true');
        });

        it('should evaluate with the given context of object', async () => {
            const templ = compile('{{#with foo}}{{bar}}{{/with}}');
            expect(await templ({ foo: { bar: 'baz' } })).to.equal('baz');
        });

        it('should evaluate with the given context of array', async () => {
            const templ = compile('{{#with foo}}{{#each $this}}{{$this}}{{/each}}{{/with}}');
            expect(await templ({ foo: ['bar', 'baz'] })).to.equal('barbaz');
        });

        it('should change context', async () => {
            const templ = compile('{{#with foo}}{{bar}}{{/with}}');
            expect(await templ({ foo: {}, bar: 'wrong' })).to.equal('');
            expect(await templ({ foo: [], bar: 'wrong' })).to.equal('');
            expect(await templ({ foo: 'foo', bar: 'wrong' })).to.equal('');
            expect(await templ({ foo: 5, bar: 'wrong' })).to.equal('');
            expect(await templ({ foo: true, bar: 'wrong' })).to.equal('');
            expect(await templ({ foo: false, bar: 'wrong' })).to.equal('');
            expect(await templ({ foo: null, bar: 'wrong' })).to.equal('');
            expect(await templ({ foo: undefined, bar: 'wrong' })).to.equal('');
        });

        it('should run only once for arrays', async () => {
            const templ = compile('{{#with foo}}bar{{/with}}');
            expect(await templ({ foo: [1, 2, 3] })).to.equal('bar');
        });
    });

    describe('return', () => {
        it('should return early', async () => {
            const templ = compile('foo{{return}}bar');
            expect(await templ()).to.equal('foo');
        });

        it('should work from inside conditional blocks', async () => {
            const templ = compile('foo{{#if bar}}{{return}}{{/if}}baz');
            expect(await templ({ bar: true })).to.equal('foo');
            expect(await templ({ bar: false })).to.equal('foobaz');
        });

        it('should halt from inside loop blocks', async () => {
            const templ = compile('0{{#each items}}{{#is $this 4}}{{return}}{{/is}}{{$this}}{{/each}}9');
            expect(await templ({ items: [1, 2, 3, 4, 5] })).to.equal('0123');
        });

        it('should halt from inside context blocks', async () => {
            const templ = compile('A{{#with foo}}B{{#is $this "bar"}}{{return}}{{/is}}C{{/with}}D');
            expect(await templ({ foo: 'bar' })).to.equal('AB');
        });
    });

    describe('pick', () => {
        it('should pick direct properties', async () => {
            const templ = compile('{{pick foo "bar"}}');
            expect(await templ({ foo: { bar: 'baz' } })).to.equal('baz');
        });

        it('should pick literal dotted keys', async () => {
            const templ = compile('{{pick $this "foo.bar"}}');
            expect(await templ({ 'foo.bar': 'baz' })).to.equal('baz');
        });

        it('should return empty for missing keys', async () => {
            const templ = compile('{{pick foo "bar"}}');
            expect(await templ({ foo: {} })).to.equal('');
        });

        it('should reject null and primitive first arguments', async () => {
            await expect(compile('{{pick foo "bar"}}')({ foo: null })).to.reject(/pick expects an object as first argument/i);
            await expect(compile('{{pick foo "bar"}}')({ foo: 1 })).to.reject(/pick expects an object as first argument/i);
            await expect(compile('{{pick foo "bar"}}')({ foo: 'bar' })).to.reject(/pick expects an object as first argument/i);
            await expect(compile('{{pick foo "bar"}}')({ foo: true })).to.reject(/pick expects an object as first argument/i);
        });

        it('should reject array first arguments and hint itemAt', async () => {
            const templ = compile('{{pick arr "length"}}');
            await expect(templ({ arr: [1, 2, 3] })).to.reject(/use itemAt for array indexing/i);
        });

        it('should reject unsafe keys', async () => {
            const templ = compile('{{pick foo key}}');
            await expect(templ({ foo: { bar: 'baz' }, key: '__proto__' }))
                .to.reject(/pick does not allow access to unsafe key "__proto__"/i);
        });

        it('should return empty for function-valued properties', async () => {
            const templ = compile('{{pick foo "fn"}}');
            expect(await templ({ foo: { fn: function hello() { return 'x'; } } })).to.equal('');
        });

        it('should only use own properties', async () => {
            const base = { bar: 'baz' };
            const foo = Object.create(base);
            const templ = compile('{{pick foo "bar"}}');
            expect(await templ({ foo })).to.equal('');
        });

        it('should reject unsafe keys from helper directly', () => {
            expect(() => codeHelpers.pick({}, '__proto__'))
                .to.throw(/pick does not allow access to unsafe key "__proto__"/i);
        });
    });

}); });
