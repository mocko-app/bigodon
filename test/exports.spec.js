const Lab = require('@hapi/lab');
const Code = require('@hapi/code');

const Bigodon = require('../dist').default;
const { Execution } = require('../dist');

const { describe, it } = exports.lab = Lab.script();
const { expect } = Code;

describe('exports', () => {
    it('should export the Execution class helpers are bound to', async () => {
        const bigodon = new Bigodon();
        let boundThis = null;
        bigodon.addHelper('capture', function () {
            boundThis = this;
            return '';
        });

        await bigodon.compile('{{capture}}')();
        expect(boundThis).to.be.an.instanceof(Execution);
    });
});
