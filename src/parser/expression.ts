import Pr, { Parser } from 'pierrejs';
import { $literal } from './literal';
import { ExpressionStatement, Location, NamedParam, Statement, ValueStatement } from './statements';
import { optionalSpaces } from './utils';
import { $variable } from './variables';
import { ensure, UNSAFE_KEYS } from '../utils';

/* $lab:coverage:off$ */
enum State {
    _START,
    GOT_LITERAL,
    GOT_PATH,
}
/* $lab:coverage:on$ */

type NamedParamItem = { namedParam: NamedParam };
type FrameItem = ValueStatement | NamedParamItem;
type Frame = FrameItem[] & { hasNamed?: boolean; pendingName?: string };

const isNamedParamItem = (item: FrameItem): item is NamedParamItem => 'namedParam' in item;

const topOfStack = <T>(stack: T[]): T => stack[stack.length - 1];

const peekEnd = Pr.lookAhead(Pr.string('}}'));
export const path: Parser<ExpressionStatement> = Pr.regex('context path', /^[a-zA-Z0-9\-_$\.]+/).map((path, loc) => ({
    type: 'EXPRESSION',
    loc,
    path,
    params: [],
}));

const namedParamName = Pr.regex('named parameter', /^[a-zA-Z_][a-zA-Z0-9_]*=/);

export const $expression: Parser<ValueStatement> = Pr.context('expression', function* () {
    const stack: Frame[] = [[]];
    let state: State = State._START;

    const expressionFromStack = expr => {
        // Simple statement without parenthesis: variables, literals, path expressions
        if (!Array.isArray(expr)) {
            return expr;
        }

        ensure(expr.length > 0, '[internal bigodon error] expressionFromStack received an empty frame');
        const [stmt, ...rest] = expr;
        const params = rest.filter(item => !isNamedParamItem(item));
        const namedParams = rest.filter(isNamedParamItem).map(item => item.namedParam);

        // Below here, statements inside parentheses, a new frame
        // They can have length 1 like `(path)`, `("str")`, `($var)`
        // Or they can have parameters like `(path param1 param2)`
        // with length 3 in this example

        // Here non-expressions with no parameters (after all they
        // can't have parameters) are returned like if there were
        // no parenthesis, no new frame
        // Ex: `("str")`, `($var)`
        if (stmt.type !== 'EXPRESSION') {
            ensure(rest.length === 0, '[internal bigodon error] expressionFromStack received a non-expression with parameters');
            return stmt;
        }

        // Expressions without parameters (rest.length === 0 && stmt.params.length === 0)
        // or with parameters already filled by a subparser (rest.length === 0 && stmt.params.length > 0)
        if (params.length === 0 && namedParams.length === 0) {
            return stmt;
        }

        // Expressions with parameters to be parsed
        ensure(stmt.params.length === 0 && !stmt.namedParams, '[internal bigodon error] expressionFromStack received an expression with parsed and unparsed parameters');
        stmt.params = params.map(expressionFromStack);
        if (namedParams.length > 0) {
            stmt.namedParams = namedParams;
        }
        return stmt;
    };

    /* $lab:coverage:off$ */
    while (true) {
    /* $lab:coverage:on$ */
        switch (state) {
            case State._START: {
                yield optionalSpaces;

                const l = yield Pr.optional($literal);
                if (l) {
                    topOfStack(stack).push(l);
                    state = State.GOT_LITERAL;
                    break;
                }

                const v = yield Pr.optional($variable);
                if (v) {
                    topOfStack(stack).push(v);
                    state = State.GOT_LITERAL; // Variables behave like literals in terms of parsing
                    break;
                }

                const p = yield Pr.optional(path);
                if (p) {
                    topOfStack(stack).push(p);
                    state = State.GOT_PATH;
                    break;
                }

                const subExpr = yield Pr.optional(Pr.string('('));
                if (subExpr) {
                    stack.push([]);
                    state = State._START;
                    break;
                }

                yield Pr.fail('Expected literal, helper or context path');
            }

            case State.GOT_LITERAL: {
                yield optionalSpaces;

                const end = yield Pr.optional(Pr.oneOf<string|true>(peekEnd, Pr.end()));
                if (end) {
                    if (stack.length > 1) {
                        yield Pr.fail('Expected ")", make sure every parenthesis was closed');
                    }
                    return expressionFromStack(stack[0]);
                }

                const subExprEnd = yield Pr.optional(Pr.string(')'));
                if (subExprEnd) {
                    if (stack.length <= 1) {
                        yield Pr.fail('Unexpected ")", this parenthesis wasn\'t opened');
                    }

                    const expr = stack.pop();
                    const processedExpr = expressionFromStack(expr);
                    const parent = topOfStack(stack);
                    if (expr.pendingName) {
                        parent.push({ namedParam: { name: expr.pendingName, value: processedExpr } });
                        parent.hasNamed = true;
                    } else {
                        parent.push(processedExpr);
                    }
                    state = State.GOT_PATH;
                    break;
                }

                yield Pr.fail('Expected "}}". Literal mustaches cannot have parameters.');
            }

            case State.GOT_PATH: {
                yield optionalSpaces;

                const end = yield Pr.optional(Pr.oneOf<string|true>(peekEnd, Pr.end()));
                if (end) {
                    if (stack.length > 1) {
                        yield Pr.fail('Expected ")", make sure every parenthesis was closed');
                    }
                    return expressionFromStack(stack[0]);
                }

                const named = yield Pr.optional(namedParamName);
                if (named) {
                    const name = named.slice(0, -1);
                    if (UNSAFE_KEYS.has(name)) {
                        yield Pr.fail(`Named parameter "${name}" not allowed`);
                    }

                    const frame = topOfStack(stack);
                    if (frame.some(item => isNamedParamItem(item) && item.namedParam.name === name)) {
                        yield Pr.fail(`Duplicate named parameter "${name}"`);
                    }

                    const value = yield Pr.optional(Pr.either<Statement>($literal, $variable, path));
                    if (value) {
                        frame.push({ namedParam: { name, value } });
                        frame.hasNamed = true;
                        state = State.GOT_PATH;
                        break;
                    }

                    const namedSubExpr = yield Pr.optional(Pr.string('('));
                    if (namedSubExpr) {
                        const child: Frame = [];
                        child.pendingName = name;
                        stack.push(child);
                        state = State._START;
                        break;
                    }

                    yield Pr.fail(`Expected value after named parameter "${name}"`);
                }

                const param = yield Pr.optional(Pr.either<Statement>($literal, $variable, path));
                if (param) {
                    if (topOfStack(stack).hasNamed) {
                        yield Pr.fail('Positional parameters cannot come after named parameters');
                    }
                    topOfStack(stack).push(param);
                    state = State.GOT_PATH;
                    break;
                }

                const subExpr = yield Pr.optional(Pr.string('('));
                if (subExpr) {
                    if (topOfStack(stack).hasNamed) {
                        yield Pr.fail('Positional parameters cannot come after named parameters');
                    }
                    stack.push([]);
                    state = State._START;
                    break;
                }

                const subExprEnd: Location = yield Pr.optional(Pr.string(')')).map((v, loc) => v ? loc : null);
                if (subExprEnd) {
                    if (stack.length <= 1) {
                        yield Pr.fail('Unexpected ")", this parenthesis wasn\'t opened');
                    }

                    const expr = stack.pop();
                    const processedExpr = expressionFromStack(expr);
                    processedExpr.loc.end = subExprEnd.start;
                    const parent = topOfStack(stack);
                    if (expr.pendingName) {
                        parent.push({ namedParam: { name: expr.pendingName, value: processedExpr } });
                        parent.hasNamed = true;
                    } else {
                        parent.push(processedExpr);
                    }
                    state = State.GOT_PATH;
                    break;
                }

                yield Pr.fail('Expected expression parameters or "}}"');
            }

            /* $lab:coverage:off$ */
            default:
                yield Pr.fail(`Unexpected state ${state} at expression parser`);
            /* $lab:coverage:on$ */
        }
    }
}).map(({ type, loc: _, ...v }, loc) => ({ type, loc, ...v }));
