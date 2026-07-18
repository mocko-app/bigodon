import Pr, { Parser } from 'pierrejs';
import { $expression } from './expression';
import {
    BlockStatement, CommentStatement, ExpressionStatement,
    Location, MustacheStatement, Statement,
    TemplateStatement, TextStatement, ValueStatement,
} from './statements';
import {
    atPos, closeMustache, openMustache,
    optionalSpaces, peek, text, char,
} from './utils';
import { $assignment } from './variables';

const topOfStack = <T>(stack: T[]): T => stack[stack.length - 1];
const topOfStackStmts = (stack: (Omit<TemplateStatement, 'loc'> | BlockStatement)[]): Statement[] => {
    const top = stack[stack.length - 1];
    if ('elseStatements' in top) {
        return top.elseStatements;
    }
    return top.statements;
};

const buildBlock = (loc: Location,
                    expression: ExpressionStatement,
                    isNegated: boolean,
                    isNested = false): BlockStatement => {
    const block: BlockStatement = {
        type: 'BLOCK',
        loc,
        isNegated,
        expression,
        statements: [],
    };

    if (isNested) {
        block.isNested = isNested;
    }

    return block;
};

export const VERSION = 4;

export const $text: Parser<Statement> = text
    .map((value, loc): TextStatement => ({ type: 'TEXT', loc, value }))
    .withName('text');

export const $comment: Parser<Statement> = Pr.all(char, text)
    .map(atPos(1))
    .map((value, { start, end }): CommentStatement => ({ type: 'COMMENT', loc: { start: start - 2, end: end + 2 }, value }))
    .withName('comment');

const $mustache: Parser<Statement> = $expression.map((expression, { start, end }) => ({
    type: 'MUSTACHE',
    loc: { start: start - 2, end: end + 2 },
    expression,
}));

export const $template = Pr.context('mustache', function* () {
    const stack: [Omit<TemplateStatement, 'loc'>, ...BlockStatement[]] = [{
        type: 'TEMPLATE',
        version: VERSION,
        statements: [],
    }];

    /* $lab:coverage:off$ */
    while (true) {
    /* $lab:coverage:on$ */
        const txt = yield Pr.optional($text);
        if (txt) {
            topOfStackStmts(stack).push(txt);
            // no need to `continue`, two texts in a row aren't possible
        }

        const open = yield Pr.optional(openMustache).map((v, loc) => v ? loc : null);
        if (open) {
            switch (yield peek) {
                case '!': {
                    topOfStackStmts(stack).push(yield $comment);
                    break;
                }

                case '=': {
                    topOfStackStmts(stack).push(yield $assignment);
                    break;
                }

                case '#':
                case '^': {
                    const typeChar = yield char;
                    const expression: ValueStatement = yield $expression;
                    if (expression.type === 'LITERAL') {
                        yield Pr.fail(`Blocks must receive path expressions or helpers. Literal blocks are not allowed.`);
                        // Never happens, just for typescript to know that below here, expression is not LiteralStatement
                        /* $lab:coverage:off$ */
                        return;
                        /* $lab:coverage:on$ */
                    }

                    if (expression.type === 'VARIABLE') {
                        yield Pr.fail(`Variable blocks are not allowed, use '{{#if $var}}' for conditionals or '{{#each $var}}' for loops instead.`);
                        // Never happens, just for typescript to know that below here, expression is not VariableStatement
                        /* $lab:coverage:off$ */
                        return;
                        /* $lab:coverage:on$ */
                    }

                    stack.push(buildBlock(open, expression, typeChar === '^'));
                    break;
                }

                case '/': {
                    yield char; // Consuming '/'
                    const expression: ValueStatement = yield $expression;
                    if (expression.type === 'LITERAL') {
                        yield Pr.fail(`Unexpected {{/${expression.value}}}. Literal blocks are not allowed to be closed.`);
                        // Never happens, just for typescript to know that below here, expression is not LiteralStatement
                        /* $lab:coverage:off$ */
                        return;
                        /* $lab:coverage:on$ */
                    }
                    if (expression.type === 'VARIABLE') {
                        yield Pr.fail(`Unexpected {{/${expression.name}}}. Variable blocks are not allowed.`);
                        // Never happens, just for typescript to know that below here, expression is not VariableStatement
                        /* $lab:coverage:off$ */
                        return;
                        /* $lab:coverage:on$ */
                    }

                    if (expression.params.length > 0 || expression.namedParams) {
                        yield Pr.fail(`Closing blocks cannot have parameters`);
                    }
                    const name = expression.path;
                    if (stack.length <= 1) {
                        yield Pr.fail(`Unexpected {{/${name}}}, this block wasn't opened`);
                    }

                    let block = stack.pop() as BlockStatement;

                    // Nested blocks auto-close when parent is closed
                    while (block.isNested) {
                        block.loc.end = expression.loc.end + 2;
                        topOfStackStmts(stack).push(block);
                        block = stack.pop() as BlockStatement;
                    }

                    // Non nested blocks must close with same expression
                    if (block.expression.path !== name) {
                        yield Pr.fail(`Unexpected {{/${name}}}, this block was opened as {{#${block.expression.path}}}`);
                    }

                    block.loc.end = expression.loc.end + 2;
                    topOfStackStmts(stack).push(block);
                    break;
                }

                default: {
                    const isElseBlock = yield Pr.optional(
                        Pr.all(
                            optionalSpaces,
                            Pr.string('else'),
                            Pr.oneOf(Pr.string(' '), Pr.lookAhead(Pr.string('}}'))),
                        ),
                    );

                    // Normal block
                    if (!isElseBlock) {
                        const stmt: MustacheStatement = yield $mustache;
                        topOfStackStmts(stack).push(stmt);
                        break;
                    }

                    // Else outside blocks
                    if (stack.length <= 1) {
                        yield Pr.fail('{{else}} can only exist inside blocks');
                    }

                    const top = topOfStack(stack) as BlockStatement;

                    // Multiple else blocks
                    if (Array.isArray(top.elseStatements)) {
                        yield Pr.fail(`an {{else}} block was already defined for the block ${top.expression.path}`);
                    }

                    const stmt: MustacheStatement = yield Pr.optional($mustache);

                    // Simple else block (no nesting)
                    if (!stmt) {
                        top.elseStatements = [];
                        break;
                    }

                    // Else followed by literal
                    if (stmt.expression.type === 'LITERAL') {
                        yield Pr.fail('{{else}} blocks cannot have parameters');
                        // Never happens, just for typescript to know that below here, expression is not LiteralStatement
                        /* $lab:coverage:off$ */
                        break;
                        /* $lab:coverage:on$ */
                    }

                    // Else followed by variable
                    if (stmt.expression.type === 'VARIABLE') {
                        yield Pr.fail('{{else}} blocks cannot have variable parameters. Use "{{else if $var}}" instead.');
                        // Never happens, just for typescript to know that below here, expression is not VariableStatement
                        /* $lab:coverage:off$ */
                        break;
                        /* $lab:coverage:on$ */
                    }

                    // Nested block
                    top.elseStatements = [];
                    stack.push(buildBlock(open, stmt.expression, false, true));
                    break;
                }
            }

            yield optionalSpaces;
            yield closeMustache;
            continue;
        }

        const end = yield Pr.optional(Pr.end());
        if (end) {
            break;
        }

        yield Pr.fail('Unexpected end of file');
    }

    if (stack.length > 1) {
        const block = topOfStack(stack) as BlockStatement;
        yield Pr.fail(`Expected {{/${block.expression.path}}}, make sure this block was closed`);
    }

    return stack[0];
}).map(({ type, ...v }, loc) => ({ type, loc, ...v }));
