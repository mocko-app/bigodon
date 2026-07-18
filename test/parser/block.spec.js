const Lab = require('@hapi/lab');
const Code = require('@hapi/code');

const { parse, compile } = require('../../dist');
const { VERSION } = require('../../dist/parser');

const { describe, it } = exports.lab = Lab.script();
const { expect } = Code;

function removeLoc(obj, stringMapper = v => v) {
  if(typeof obj === 'string') {
    return stringMapper(obj);
  }

  if(typeof obj !== 'object') {
    return obj;
  }

  if(Array.isArray(obj)) {
    return obj.map(o => removeLoc(o, stringMapper));
  }

  const out = {};
  for(const key in obj) {
    if(key === 'loc') {
      continue;
    }

    out[key] = removeLoc(obj[key], stringMapper);
  }

  return out;
}

describe('parser', () => {
    describe('blocks', () => {
        it('should parse path parameters', () => {
            const result = parse('{{#foo}}{{/foo}}');
            expect(result).to.equal({
                "type": "TEMPLATE",
                "loc": { start: 0, end: 16 },
                "version": VERSION,
                "statements": [
                  {
                    "type": "BLOCK",
                    "loc": { start: 0, end: 16 },
                    "isNegated": false,
                    "expression": {
                      "type": "EXPRESSION",
                      "loc": { start: 3, end: 6 },
                      "path": "foo",
                      "params": []
                    },
                    "statements": []
                  }
                ]
              });
        });

        it('should parse content inside', () => {
            const result = parse('{{#foo}}a{{bar}}b{{/foo}}');
            expect(result).to.equal({
                "type": "TEMPLATE",
                "loc": { start: 0, end: 25 },
                "version": VERSION,
                "statements": [
                  {
                    "type": "BLOCK",
                    "loc": { start: 0, end: 25 },
                    "isNegated": false,
                    "expression": {
                      "type": "EXPRESSION",
                      "loc": { start: 3, end: 6 },
                      "path": "foo",
                      "params": []
                    },
                    "statements": [
                      {
                        "type": "TEXT",
                        "loc": { start: 8, end: 9 },
                        "value": "a"
                      },
                      {
                        "type": "MUSTACHE",
                        "loc": { start: 9, end: 16 },
                        "expression": {
                          "type": "EXPRESSION",
                          "loc": { start: 11, end: 14 },
                          "path": "bar",
                          "params": []
                        }
                      },
                      {
                        "type": "TEXT",
                        "loc": { start: 16, end: 17 },
                        "value": "b"
                      }
                    ]
                  }
                ]
              });
        });

        it('should parse helpers', () => {
            const result = parse('{{#foo bar}}{{/foo}}');
            expect(result).to.equal({
                "type": "TEMPLATE",
                "loc": { start: 0, end: 20 },
                "version": VERSION,
                "statements": [
                  {
                    "type": "BLOCK",
                    "loc": { start: 0, end: 20 },
                    "isNegated": false,
                    "expression": {
                      "type": "EXPRESSION",
                      "loc": { start: 3, end: 10 },
                      "path": "foo",
                      "params": [
                        {
                          "type": "EXPRESSION",
                          "loc": { start: 7, end: 10 },
                          "path": "bar",
                          "params": []
                        }
                      ]
                    },
                    "statements": []
                  }
                ]
              });
        });

        it('should parse nested blocks', () => {
            const result = parse('{{#foo}}{{#bar}}oy{{/bar}}{{/foo}}');
            expect(result).to.equal({
                "type": "TEMPLATE",
                "loc": { start: 0, end: 34 },
                "version": VERSION,
                "statements": [
                  {
                    "type": "BLOCK",
                    "loc": { start: 0, end: 34 },
                    "isNegated": false,
                    "expression": {
                      "type": "EXPRESSION",
                      "loc": { start: 3, end: 6 },
                      "path": "foo",
                      "params": []
                    },
                    "statements": [
                      {
                        "type": "BLOCK",
                        "loc": { start: 8, end: 26 },
                        "isNegated": false,
                        "expression": {
                          "type": "EXPRESSION",
                          "loc": { start: 11, end: 14 },
                          "path": "bar",
                          "params": []
                        },
                        "statements": [
                          {
                            "type": "TEXT",
                            "loc": { start: 16, end: 18 },
                            "value": "oy"
                          }
                        ]
                      }
                    ]
                  }
                ]
              });
        });

        it('should parse negated blocks', () => {
            const result = parse('{{^foo}}{{/foo}}');
            expect(result).to.equal({
                "type": "TEMPLATE",
                "loc": { start: 0, end: 16 },
                "version": VERSION,
                "statements": [
                  {
                    "type": "BLOCK",
                    "loc": { start: 0, end: 16 },
                    "isNegated": true,
                    "expression": {
                      "type": "EXPRESSION",
                      "loc": { start: 3, end: 6 },
                      "path": "foo",
                      "params": []
                    },
                    "statements": []
                  }
                ]
              });
        });

        it('should parse else blocks', () => {
          const result = parse('{{#foo}}first{{else}}second{{/foo}}');
          expect(result).to.equal({
              "type": "TEMPLATE",
              "loc": { start: 0, end: 35 },
              "version": VERSION,
              "statements": [
                {
                  "type": "BLOCK",
                  "loc": { start: 0, end: 35 },
                  "isNegated": false,
                  "expression": {
                    "type": "EXPRESSION",
                    "loc": { start: 3, end: 6 },
                    "path": "foo",
                    "params": []
                  },
                  "statements": [{
                    "type": "TEXT",
                    "loc": { start: 8, end: 13 },
                    "value": "first"
                  }],
                  "elseStatements": [{
                    "type": "TEXT",
                    "loc": { start: 21, end: 27 },
                    "value": "second"
                  }]
                }
              ]
            });
        });

        it('should parse negated else blocks', () => {
          const result = parse('{{^foo}}first{{else}}second{{/foo}}');
          expect(result).to.equal({
              "type": "TEMPLATE",
              "loc": { start: 0, end: 35 },
              "version": VERSION,
              "statements": [
                {
                  "type": "BLOCK",
                  "loc": { start: 0, end: 35 },
                  "isNegated": true,
                  "expression": {
                    "type": "EXPRESSION",
                    "loc": { start: 3, end: 6 },
                    "path": "foo",
                    "params": []
                  },
                  "statements": [{
                    "type": "TEXT",
                    "loc": { start: 8, end: 13 },
                    "value": "first"
                  }],
                  "elseStatements": [{
                    "type": "TEXT",
                    "loc": { start: 21, end: 27 },
                    "value": "second"
                  }]
                }
              ]
            });
        });

        it('should parse else blocks with params', () => {
            const result = parse('{{#outer}}first{{else inner}}second{{/outer}}');
            expect(result).to.equal({
              "type": "TEMPLATE",
              "loc": { start: 0, end: 45 },
              "version": VERSION,
              "statements": [
                {
                  "type": "BLOCK",
                  "loc": { start: 0, end: 45 },
                  "isNegated": false,
                  "expression": {
                    "type": "EXPRESSION",
                    "loc": { start: 3, end: 8 },
                    "path": "outer",
                    "params": []
                  },
                  "statements": [
                    {
                      "type": "TEXT",
                      "loc": { start: 10, end: 15 },
                      "value": "first"
                    }
                  ],
                  "elseStatements": [
                    {
                      "type": "BLOCK",
                      "loc": { start: 15, end: 45 },
                      "isNegated": false,
                      "expression": {
                        "type": "EXPRESSION",
                        "loc": { start: 22, end: 27 },
                        "path": "inner",
                        "params": []
                      },
                      "statements": [
                        {
                          "type": "TEXT",
                          "loc": { start: 29, end: 35 },
                          "value": "second"
                        }
                      ],
                      "isNested": true
                    }
                  ]
                }
              ]
            });
        });

        it('should accept params on nested blocks', () => {
            const result = parse('{{#outer}}first{{else inner "param"}}second{{/outer}}');
            expect(result).to.equal({
              "type": "TEMPLATE",
              "loc": { start: 0, end: 53 },
              "version": VERSION,
              "statements": [
                {
                  "type": "BLOCK",
                  "loc": { start: 0, end: 53 },
                  "isNegated": false,
                  "expression": {
                    "type": "EXPRESSION",
                    "loc": { start: 3, end: 8 },
                    "path": "outer",
                    "params": []
                  },
                  "statements": [
                    {
                      "type": "TEXT",
                      "loc": { start: 10, end: 15 },
                      "value": "first"
                    }
                  ],
                  "elseStatements": [
                    {
                      "type": "BLOCK",
                      "loc": { start: 15, end: 53 },
                      "isNegated": false,
                      "expression": {
                        "type": "EXPRESSION",
                        "loc": { start: 22, end: 35 },
                        "path": "inner",
                        "params": [
                          {
                            "type": "LITERAL",
                            "loc": { start: 28, end: 35 },
                            "value": "param"
                          }
                        ]
                      },
                      "statements": [
                        {
                          "type": "TEXT",
                          "loc": { start: 37, end: 43 },
                          "value": "second"
                        }
                      ],
                      "isNested": true
                    }
                  ]
                }
              ]
            });
        });

        it('should allow spaces around else nested blocks', () => {
          const result = parse('{{#outer}}first{{   else    inner   }}second{{/outer}}');
          expect(result).to.equal({
            "type": "TEMPLATE",
            "loc": { start: 0, end: 54 },
            "version": VERSION,
            "statements": [
              {
                "type": "BLOCK",
                "loc": { start: 0, end: 54 },
                "isNegated": false,
                "expression": {
                  "type": "EXPRESSION",
                  "loc": { start: 3, end: 8 },
                  "path": "outer",
                  "params": []
                },
                "statements": [
                  {
                    "type": "TEXT",
                    "loc": { start: 10, end: 15 },
                    "value": "first"
                  }
                ],
                "elseStatements": [
                  {
                    "type": "BLOCK",
                    "loc": { start: 15, end: 54 },
                    "isNegated": false,
                    "expression": {
                      "type": "EXPRESSION",
                      "loc": { start: 25, end: 36 },
                      "path": "inner",
                      "params": []
                    },
                    "statements": [
                      {
                        "type": "TEXT",
                        "loc": { start: 38, end: 44 },
                        "value": "second"
                      }
                    ],
                    "isNested": true
                  }
                ]
              }
            ]
          });
        });

        it('should allow spaces around else simple blocks', () => {
          const result = parse('{{#outer}}first{{   else   }}second{{/outer}}');
          expect(result).to.equal({
            "type": "TEMPLATE",
            "loc": { start: 0, end: 45 },
            "version": VERSION,
            "statements": [
              {
                "type": "BLOCK",
                "loc": { start: 0, end: 45 },
                "isNegated": false,
                "expression": {
                  "type": "EXPRESSION",
                  "loc": { start: 3, end: 8 },
                  "path": "outer",
                  "params": []
                },
                "statements": [
                  {
                    "type": "TEXT",
                    "loc": { start: 10, end: 15 },
                    "value": "first"
                  }
                ],
                "elseStatements": [
                  {
                    "type": "TEXT",
                    "loc": { start: 29, end: 35 },
                    "value": "second"
                  }
                ]
              }
            ]
          });
        });

        it('should allow path expressions starting with else', () => {
          const baseline = parse('{{#outer}}first{{elzemar}}second{{/outer}}');
          const noSpaces = parse('{{#outer}}first{{elsemar}}second{{/outer}}');
          const spaces = parse('{{#outer}}first{{ elsemar  }}second{{/outer}}');

          const baselineNoLoc = removeLoc(baseline, s => s === 'elzemar' ? 'elsemar' : s);

          expect(removeLoc(noSpaces)).to.equal(baselineNoLoc);
          expect(removeLoc(spaces)).to.equal(baselineNoLoc);
        });

        it('should allow path expressions with parameters starting with else', () => {
          const baseline = parse('{{#outer}}first{{elzemar true}}second{{/outer}}');
          const elseExpression = parse('{{#outer}}first{{elsemar true}}second{{/outer}}');

          const baselineNoLoc = removeLoc(baseline, s => s === 'elzemar' ? 'elsemar' : s);

          expect(removeLoc(elseExpression)).to.equal(baselineNoLoc);
        });

        it('should allow as many nesting levels as needed', async () => {
          const template = compile(`
{{#is $this.value 'one'}}
first
{{else is $this.value 'two'}}
second
{{else is $this.value 'three'}}
third
{{else is $this.value 'four'}}
fourth
{{else is $this.value 'five'}}
fifth
{{/is}}
          `.trim());

          expect((await template({ value: 'one' })).trim()).to.equal('first');
          expect((await template({ value: 'two' })).trim()).to.equal('second');
          expect((await template({ value: 'three' })).trim()).to.equal('third');
          expect((await template({ value: 'four' })).trim()).to.equal('fourth');
          expect((await template({ value: 'five' })).trim()).to.equal('fifth');
        });

        it('should allow a simple else after nesting elses', async () => {
          const template = compile(`
{{#is $this.value 'one'}}
first
{{else is $this.value 'two'}}
second
{{else}}
nth
{{/is}}
          `.trim());

          expect((await template({ value: 'one' })).trim()).to.equal('first');
          expect((await template({ value: 'two' })).trim()).to.equal('second');
          expect((await template({ value: 'three' })).trim()).to.equal('nth');
          expect((await template({ value: 'four' })).trim()).to.equal('nth');
        });

        it('should not parse literals', () => {
            expect(() => parse('{{#"foo"}}')).to.throw(/literal blocks are not allowed/i);
            expect(() => parse('{{/"foo"}}')).to.throw(/literal blocks are not allowed/i);
        });

        it('should not parse unclosed blocks', () => {
            expect(() => parse('{{#foo}}')).to.throw(/make sure this block was closed/i);
        });

        it('should not parse block mismatch', () => {
            expect(() => parse('{{#foo}}{{/bar}}')).to.throw(/this block was opened as/i);
        });

        it('should not parse closing blocks with parameters', () => {
            expect(() => parse('{{#foo}}{{/foo bar}}')).to.throw(/closing blocks cannot have parameters/i);
            expect(() => parse('{{#foo}}{{/foo bar=1}}')).to.throw(/closing blocks cannot have parameters/i);
        });

        it('should not parse else blocks outside blocks', () => {
          expect(() => parse('{{else}}')).to.throw(/\{\{else\}\} can only exist inside blocks/i);
        });

        it('should not parse more than one else blocks', () => {
          expect(() => parse('{{#foo}}{{else}}{{else}}{{/foo}}')).to.throw(/an \{\{else\}\} block was already defined/i);
        });

        it('should not parse else blocks with parameters', () => {
          expect(() => parse('{{#foo}}{{else "bar"}}{{/foo}}')).to.throw(/\{\{else\}\} blocks cannot have parameters/i);
        });
    });
});
