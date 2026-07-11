const Lab = require('@hapi/lab');
const Code = require('@hapi/code');

const { compile, default: Bigodon } = require('../../dist');

const { describe, it } = exports.lab = Lab.script();
const { expect } = Code;

describe('helpers', () => { describe('string', () => {

    describe('append', () => {
        it('should return empty for no params', async () => {
            const templ = compile('{{append}}');
            const result = await templ();
            expect(result).to.equal('');
        });

        it('should return parameter for one param', async () => {
            const templ = compile('{{append "a"}}');
            const result = await templ();
            expect(result).to.equal('a');
        });

        it('should return concatenated params', async () => {
            const templ = compile('{{append "a" "b" "c" "d"}}');
            const result = await templ();
            expect(result).to.equal('abcd');
        });
    });

    describe('upper', () => {
        it('should return upper case string', async () => {
            const templ = compile('{{upper "a"}}');
            const result = await templ();
            expect(result).to.equal('A');
        });

        it('should work with non-strings', async () => {
            const templ = compile('{{upper 1}}');
            const result = await templ();
            expect(result).to.equal('1');
        });

        it('should work as uppercase', async () => {
            const templ = compile('{{uppercase "a"}}');
            const result = await templ();
            expect(result).to.equal('A');
        });

        it('should work as upcase', async () => {
            const templ = compile('{{upcase "a"}}');
            const result = await templ();
            expect(result).to.equal('A');
        });
    });

    describe('lower', () => {
        it('should return lower case string', async () => {
            const templ = compile('{{lower "A"}}');
            const result = await templ();
            expect(result).to.equal('a');
        });

        it('should work with non-strings', async () => {
            const templ = compile('{{lower 1}}');
            const result = await templ();
            expect(result).to.equal('1');
        });

        it('should work as lowercase', async () => {
            const templ = compile('{{lowercase "A"}}');
            const result = await templ();
            expect(result).to.equal('a');
        });

        it('should work as downcase', async () => {
            const templ = compile('{{downcase "A"}}');
            const result = await templ();
            expect(result).to.equal('a');
        });

        it('should work as lowcase', async () => {
            const templ = compile('{{lowcase "A"}}');
            const result = await templ();
            expect(result).to.equal('a');
        });
    });

    describe('split', () => {
        it('should split correctly', async () => {
            const templ = compile('{{#split "foo,bar,baz,qux" ","}}({{$this}}){{/split}}');
            const result = await templ();
            expect(result).to.equal('(foo)(bar)(baz)(qux)');
        });
    });

    describe('startsWith', () => {
        it('should return true for matching string', async () => {
            const templ = compile('{{startsWith "javascript" "java"}}');
            const result = await templ();
            expect(result).to.equal('true');
        });

        it('should return false for non-matching string', async () => {
            const templ = compile('{{startsWith "typescript" "java"}}');
            const result = await templ();
            expect(result).to.equal('false');
        });

        it('should work with non-strings', async () => {
            const templ = compile('{{startsWith 1234 "12"}}');
            const result = await templ();
            expect(result).to.equal('true');
        });

        it('should work with non-string prefix', async () => {
            const templ = compile('{{startsWith "1234" 12}}');
            const result = await templ();
            expect(result).to.equal('true');
        });

        it('should work with non-strings and non-string prefix', async () => {
            const templ = compile('{{startsWith 1234 12}}');
            const result = await templ();
            expect(result).to.equal('true');
        });
    });

    describe('endsWith', () => {
        it('should return true for matching string', async () => {
            const templ = compile('{{endsWith "javascript" "script"}}');
            const result = await templ();
            expect(result).to.equal('true');
        });

        it('should return false for non-matching string', async () => {
            const templ = compile('{{endsWith "javascript" "java"}}');
            const result = await templ();
            expect(result).to.equal('false');
        });

        it('should work with non-strings', async () => {
            const templ = compile('{{endsWith 1234 "34"}}');
            const result = await templ();
            expect(result).to.equal('true');
        });

        it('should work with non-string suffix', async () => {
            const templ = compile('{{endsWith "1234" 34}}');
            const result = await templ();
            expect(result).to.equal('true');
        });

        it('should work with non-strings and non-string suffix', async () => {
            const templ = compile('{{endsWith 1234 34}}');
            const result = await templ();
            expect(result).to.equal('true');
        });
    });

    describe('trim', () => {
        it('should return trimmed string', async () => {
            const templ = compile('{{trim "   javascript   "}}');
            const result = await templ();
            expect(result).to.equal('javascript');
        });

        it('should work with non-strings', async () => {
            const templ = compile('{{trim 1234}}');
            const result = await templ();
            expect(result).to.equal('1234');
        });
    });

    describe('trimLeft', () => {
        it('should return trimmed string', async () => {
            const templ = compile('{{trimLeft "   javascript   "}}');
            const result = await templ();
            expect(result).to.equal('javascript   ');
        });

        it('should work with non-strings', async () => {
            const templ = compile('{{trimLeft 1234}}');
            const result = await templ();
            expect(result).to.equal('1234');
        });

        it('should work as trimStart', async () => {
            const templ = compile('{{trimStart "   javascript   "}}');
            const result = await templ();
            expect(result).to.equal('javascript   ');
        });
    });

    describe('trimRight', () => {
        it('should return trimmed string', async () => {
            const templ = compile('{{trimRight "   javascript   "}}');
            const result = await templ();
            expect(result).to.equal('   javascript');
        });

        it('should work with non-strings', async () => {
            const templ = compile('{{trimRight 1234}}');
            const result = await templ();
            expect(result).to.equal('1234');
        });

        it('should work as trimEnd', async () => {
            const templ = compile('{{trimEnd "   javascript   "}}');
            const result = await templ();
            expect(result).to.equal('   javascript');
        });
    });

    describe('toString', () => {
        it('should convert to string', async () => {
            const templ = compile('{{toString true}}, {{typeof (toString true)}}');
            const result = await templ();
            expect(result).to.equal('true, string');
        });
    });

    describe('capitalize', () => {
        it('should capitalize string', async () => {
            const templ = compile('{{capitalize "lorem ipsum dolor"}}');
            const result = await templ();
            expect(result).to.equal('Lorem ipsum dolor');
        });

        it('should work with non-strings', async () => {
            const templ = compile('{{capitalize 1234}}');
            const result = await templ();
            expect(result).to.equal('1234');
        });

        it('should work as capitalizeFirst', async () => {
            const templ = compile('{{capitalizeFirst "lorem ipsum dolor"}}');
            const result = await templ();
            expect(result).to.equal('Lorem ipsum dolor');
        });
    });

    describe('capitalizeAll', () => {
        it('should capitalize string', async () => {
            const templ = compile('{{capitalizeAll "lorem ipsum dolor"}}');
            const result = await templ();
            expect(result).to.equal('Lorem Ipsum Dolor');
        });

        it('should work with non-strings', async () => {
            const templ = compile('{{capitalizeAll 1234}}');
            const result = await templ();
            expect(result).to.equal('1234');
        });

        it('should work as capitalizeWords', async () => {
            const templ = compile('{{capitalizeWords "lorem ipsum dolor"}}');
            const result = await templ();
            expect(result).to.equal('Lorem Ipsum Dolor');
        });
    });

    describe('replace', () => {
        it('should replace string', async () => {
            const templ = compile('{{replace "lorem ipsum dolor" "lorem" "sit"}}');
            const result = await templ();
            expect(result).to.equal('sit ipsum dolor');
        });

        it('should work with multiple occurences', async () => {
            const templ = compile('{{replace "lorem ipsum dolor lorem" "lorem" "sit"}}');
            const result = await templ();
            expect(result).to.equal('sit ipsum dolor sit');
        });

        it('should work with non-strings', async () => {
            const templ = compile('{{replace 1234 12 56}}');
            const result = await templ();
            expect(result).to.equal('5634');
        });
    });

    describe('json', () => {
        it('should stringify compact by default', async () => {
            const templ = compile('{{json obj}}');
            expect(await templ({ obj: { foo: 'bar', count: 2 } }))
                .to.equal('{"foo":"bar","count":2}');
        });

        it('should stringify compact for false', async () => {
            const templ = compile('{{json obj false}}');
            expect(await templ({ obj: { foo: 'bar', count: 2 } }))
                .to.equal('{"foo":"bar","count":2}');
        });

        it('should stringify pretty for true', async () => {
            const templ = compile('{{json obj true}}');
            expect(await templ({ obj: { foo: 'bar', count: 2 } }))
                .to.equal('{\n  "foo": "bar",\n  "count": 2\n}');
        });

        it('should stringify with numeric indentation', async () => {
            const templ = compile('{{json obj 4}}');
            expect(await templ({ obj: { foo: 'bar', count: 2 } }))
                .to.equal('{\n    "foo": "bar",\n    "count": 2\n}');
        });

        it('should work as JSONstringify', async () => {
            const templ = compile('{{JSONstringify obj}}');
            expect(await templ({ obj: { foo: 'bar' } }))
                .to.equal('{"foo":"bar"}');
        });

        it('should reject invalid format values', async () => {
            await expect(compile('{{json obj "2"}}')({ obj: { foo: 'bar' } }))
                .to.reject(/json second argument must be a boolean or number/i);
            await expect(compile('{{json obj format}}')({ obj: { foo: 'bar' }, format: {} }))
                .to.reject(/json second argument must be a boolean or number/i);
            await expect(compile('{{json obj format}}')({ obj: { foo: 'bar' }, format: [] }))
                .to.reject(/json second argument must be a boolean or number/i);
        });

        it('should stringify undefined as null', async () => {
            expect(await compile('{{json value}}')({ value: undefined }))
                .to.equal('null');
            expect(await compile('{{json missing.path}}')({}))
                .to.equal('null');
        });

        it('should surface native stringify errors like circular references', async () => {
            const bigodon = new Bigodon();
            const value = {};
            value.self = value;
            bigodon.addHelper('makeCircular', () => value);
            const templ = bigodon.compile('{{json (makeCircular)}}');
            await expect(templ()).to.reject(/error at helper json/i);
        });
    });

    describe('substring', () => {
        it('should substring string', async () => {
            const templ = compile('{{substring "lorem ipsum dolor" 0 5}}');
            const result = await templ();
            expect(result).to.equal('lorem');
        });

        it('should work with non-strings', async () => {
            const templ = compile('{{substring 1234 0 2}}');
            const result = await templ();
            expect(result).to.equal('12');
        });

        it('should work with one param', async () => {
            const templ = compile('{{substring "lorem ipsum dolor" 6}}');
            const result = await templ();
            expect(result).to.equal('ipsum dolor');
        });
    });

    describe('padLeft', () => {
        it('should pad string', async () => {
            const templ = compile('{{padLeft "lorem" 10 "0"}}');
            const result = await templ();
            expect(result).to.equal('00000lorem');
        });

        it('should work with non-strings', async () => {
            const templ = compile('{{padLeft 1234 5 "0"}}');
            const result = await templ();
            expect(result).to.equal('01234');
        });

        it('should work with one param', async () => {
            const templ = compile('{{padLeft "lorem" 10}}');
            const result = await templ();
            expect(result).to.equal('     lorem');
        });

        it('should work as padStart', async () => {
            const templ = compile('{{padStart "lorem" 10}}');
            const result = await templ();
            expect(result).to.equal('     lorem');
        });
    });

    describe('padRight', () => {
        it('should pad string', async () => {
            const templ = compile('{{padRight "lorem" 10 "0"}}');
            const result = await templ();
            expect(result).to.equal('lorem00000');
        });

        it('should work with non-strings', async () => {
            const templ = compile('{{padRight 1234 5 "0"}}');
            const result = await templ();
            expect(result).to.equal('12340');
        });

        it('should work with one param', async () => {
            const templ = compile('{{padRight "lorem" 10}}');
            const result = await templ();
            expect(result).to.equal('lorem     ');
        });

        it('should work as padEnd', async () => {
            const templ = compile('{{padEnd "lorem" 10}}');
            const result = await templ();
            expect(result).to.equal('lorem     ');
        });
    });

    describe('uuid', () => {
        it('should generate random valid UUIDs v4', async () => {
            const VALID_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
            const templ = compile('{{uuid}}');
            const result1 = await templ();
            const result2 = await templ();

            expect(result1).to.match(VALID_UUID);
            expect(result2).to.match(VALID_UUID);
            expect(result1).to.not.equal(result2);
        });
    });

}); });
