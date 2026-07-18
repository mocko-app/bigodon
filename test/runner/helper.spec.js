const Lab = require('@hapi/lab');
const Code = require('@hapi/code');

const { compile, default: Bigodon } = require('../../dist');

const { describe, it } = exports.lab = Lab.script();
const { expect } = Code;

describe('runner', () => {
    describe('helper', () => {
        it('should execute helpers', async () => {
            const templ = compile('Hello, {{upper name }} {{upper "Schmidt" }}!');
            const result = await templ({ name: 'George' });
            expect(result).to.equal('Hello, GEORGE SCHMIDT!');
        });

        it('should execute nested helpers', async () => {
            const templ = compile('Hello, {{upper (append name " schmidt") }}!');
            const result = await templ({ name: 'George' });
            expect(result).to.equal('Hello, GEORGE SCHMIDT!');
        });

        it('should execute parameterless helpers', async () => {
            const templ = compile('{{if}}');
            const result = await templ({ 'if': 'wrong' });
            expect(result).to.equal('false');
        });

        it('should execute parameterless extra helpers', async () => {
            const bigodon = new Bigodon();
            bigodon.addHelper('foo', () => 'bar');
            const templ = bigodon.compile('{{foo}}');
            const result = await templ({ foo: 'wrong' });
            expect(result).to.equal('bar');
        });

        it('should not execute non existing helpers', async () => {
            const templ = compile('Hello, {{non-existing name }}!');
            const result = templ({ name: 'George' });
            await expect(result).to.reject(/helper non-existing not found/i);
        });

        it('should not allow unsafe keys as helper names', async () => {
            const templ = compile('Hello, {{__proto__ "Schmidt" }}!');
            await expect(templ()).to.reject(/helper __proto__ not allowed/i);
        });

        it('should run extra helpers', async () => {
            const bigodon = new Bigodon();
            bigodon.addHelper('add', (a, b) => a + b);
            const templ = bigodon.compile('{{add 1 2}}');
            const result = await templ(bigodon);
            expect(result).to.equal('3');
        });

        it('should prioritize extra helpers', async () => {
            const bigodon = new Bigodon();
            bigodon.addHelper('upper', () => 5);
            const templ = bigodon.compile('{{upper "hello"}}');
            const result = await templ(bigodon);
            expect(result).to.equal('5');
        });

        it('should preserve helper response types', async () => {
            const bigodon = new Bigodon();
            bigodon.addHelper('add', (a, b) => a + b);
            const templ = bigodon.compile('{{add (add 1 2) 4}}');
            const result = await templ(bigodon);
            expect(result).to.equal('7');
        });

        it('should run async helpers in series', async () => {
            const bigodon = new Bigodon();
            bigodon.addHelper('wait', time => new Promise(resolve => setTimeout(resolve, time)));
            const templ = bigodon.compile('{{wait 200}}{{wait 300}}');
            const start = Date.now();
            await templ(bigodon);
            const deltaT = Date.now() - start;
            expect(deltaT).to.be.at.least(490);
            expect(deltaT).to.be.at.most(590);
        });

        it('should pass execution to helpers', async () => {
            const bigodon = new Bigodon();
            bigodon.addHelper('setTitle', function (title) {
                this.data.title = title;
            });

            const templ = bigodon.compile('{{setTitle "Hello"}}');

            const data = {};
            await templ(bigodon, { data });
            expect(data.title).to.equal('Hello');
        });

        it('should pass named parameters to helpers', async () => {
            const bigodon = new Bigodon();
            bigodon.addHelper('greet', function (name) {
                return `${this.namedParams.greeting || 'Hello'}, ${name}`;
            });

            const templ = bigodon.compile('{{greet "George" greeting="Hi"}}');
            expect(await templ()).to.equal('Hi, George');
        });

        it('should treat expressions with only named parameters as helper calls', async () => {
            const bigodon = new Bigodon();
            bigodon.addHelper('greet', function () {
                return `Hello, ${this.namedParams.name}`;
            });

            const templ = bigodon.compile('{{greet name="George"}}');
            const result = await templ({ greet: 'wrong' });
            expect(result).to.equal('Hello, George');
        });

        it('should not resolve paths when named parameters are present', async () => {
            const templ = compile('{{missing a=1}}');
            await expect(templ({ missing: 'value' })).to.reject(/helper missing not found/i);
        });

        it('should give helpers an empty null-prototype namedParams when none are passed', async () => {
            const bigodon = new Bigodon();
            bigodon.addHelper('inspect', function () {
                return `${Object.keys(this.namedParams).length}:${Object.getPrototypeOf(this.namedParams)}`;
            });

            const templ = bigodon.compile('{{inspect "a"}}');
            expect(await templ()).to.equal('0:null');
        });

        it('should silently drop named parameters on helpers that do not use them', async () => {
            const templ = compile('{{upper "hi" mode="x"}}');
            expect(await templ()).to.equal('HI');
        });

        it('should evaluate positional and named parameters in source order', async () => {
            const bigodon = new Bigodon();
            const order = [];
            bigodon.addHelper('track', async v => { order.push(v); return v; });
            bigodon.addHelper('use', () => '');

            const templ = bigodon.compile('{{use (track 1) a=(track 2) b=(track 3)}}');
            await templ();
            expect(order).to.equal([1, 2, 3]);
        });

        it('should scope namedParams to each helper call', async () => {
            const bigodon = new Bigodon();
            bigodon.addHelper('inner', function () { return this.namedParams.x; });
            bigodon.addHelper('outer', function (v) { return `${v}:${this.namedParams.x}`; });

            const templ = bigodon.compile('{{outer (inner x=1) x=2}}');
            expect(await templ()).to.equal('1:2');
        });

        it('should keep namedParams stable across async helper boundaries', async () => {
            const bigodon = new Bigodon();
            bigodon.addHelper('slowEcho', async function () {
                await new Promise(resolve => setTimeout(resolve, 20));
                return this.namedParams.v;
            });

            const templ = bigodon.compile('{{append (slowEcho v=1) (slowEcho v=2)}}');
            expect(await templ()).to.equal('12');
        });

        it('should pass named parameters to block helpers', async () => {
            const bigodon = new Bigodon();
            bigodon.addHelper('firstN', function (arr) { return arr.slice(0, this.namedParams.n); });

            const templ = bigodon.compile('{{#firstN items n=2}}{{$this}},{{/firstN}}');
            expect(await templ({ items: [1, 2, 3] })).to.equal('1,2,');
        });

        it('should log helper and location on error', async () => {
            const bigodon = new Bigodon();
            bigodon.addHelper('fail', () => { throw new Error('fail'); });

            const templ = bigodon.compile('{{fail}}');
            await expect(templ(bigodon)).to.reject('Error at helper fail, position 2: fail');
        });

        it('should log helper when no location on error', async () => {
            const bigodon = new Bigodon();
            bigodon.addHelper('fail', () => { throw new Error('fail'); });

            const ast = {
                type: 'TEMPLATE',
                version: 2,
                statements: [{
                    type: 'MUSTACHE',
                    expression: {
                        type: 'EXPRESSION',
                        path: 'fail',
                        params: [],
                    },
                }],
            };

            await expect(bigodon.run(ast, bigodon)).to.reject('Error at helper fail: fail');
        });
    });
});
