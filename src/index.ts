import { $template } from './parser';
import { $expression } from './parser/expression';
import { TemplateStatement, ValueStatement } from './parser/statements';
import { LiteralValue, run as _run, runStatement } from './runner';
import { Execution } from './runner/execution';
import { BigodonOptions } from './runner/options';
import { ensure } from './utils';

/**
 * @param {object?} context Context to be used when evaluating the template.
 * @param {BigodonOptions?} options Options to be used.
 * @return {Promise<string>} Promise that resolves to the rendered template.
 */
export type TemplateRunner =
    (context?: object, options?: BigodonOptions) => Promise<string>;

/**
 * Bigodon class, used if you need custom settings or helpers
 * not present in the default functions.
 */
class Bigodon {
    private readonly helpers: Map<string, Function> = new Map();

    /**
     * Parses a template and returns an AST representing it.
     * This can be persisted as JSON for later usage.
     *
     * @param {string} template Bigodon template to be parsed
     * @return {TemplateStatement} AST representing input template
     */
    parse = (template: string): TemplateStatement => {
        ensure(typeof template === 'string', 'Template must be a string');
        return $template.parse(template);
    };

    /**
     * Parses a bigodon expression into its AST representation.
     * This can be persisted as JSON for later usage.
     *
     * @param {string} expression Bigodon expression to be parsed
     * @return {ValueStatement} AST representing input expression
     */
    parseExpression = (expression: string): ValueStatement => {
        ensure(typeof expression === 'string', 'Expression must be a string');
        return $expression.parse(expression);
    };

    /**
     * Runs an AST returned by the {@link Bigodon#parse} method.
     *
     * @param {TemplateStatement} ast AST returned by {@link Bigodon#parse}.
     * @param {object?} context Context to be used when evaluating the template.
     * @param {BigodonOptions?} options Options to be used.
     * @return {Promise<string>} Promise that resolves to the rendered template.
     */
    run = async (ast: TemplateStatement,
                 context?: object,
                 options?: BigodonOptions): Promise<string> => {
        return await _run(ast, context, this.helpers, options);
    };

    /**
     * Runs an AST returned by the {@link Bigodon#parseExpression} method.
     *
     * @param {ValueStatement} statement AST returned by {@link Bigodon#parseExpression}.
     * @param {object?} context Context to be used when evaluating the expression.
     * @param {BigodonOptions?} options Options to be used.
     * @return {Promise<LiteralValue>} Promise that resolves to the rendered expression.
     */
    runExpression = async (statement: ValueStatement, context?: object, options?: BigodonOptions): Promise<LiteralValue> => {
        const execution = Execution.of(context, this.helpers, options);
        return await runStatement(execution, statement);
    };

    /**
     * Compiles a template and returns a function that, when called, executes it
     *
     * @param {string} template Bigodon template to be parsed
     * @return {TemplateRunner} Function that executes the template
     */
    compile = (template: string): TemplateRunner => {
        const ast = this.parse(template);
        return (context?: object, options?: BigodonOptions) =>
            this.run(ast, context, options);
    };

    /**
     * Compiles an expression and returns a function that, when called, executes it
     *
     * @param {string} expression Bigodon expression to be parsed
     * @return {TemplateRunner} Function that executes the template
     */
    compileExpression = (expression: string): ((context?: object, options?: BigodonOptions) => Promise<LiteralValue>) => {
        const ast = this.parseExpression(expression);
        return (context?: object, options?: BigodonOptions) => this.runExpression(ast, context, options);
    };

    /**
     * Adds a helper to the Bigodon instance.
     *
     * @param {string} name Name of the helper when used in templates
     * @param {Function} helper Function to be executed when helper is called
     * @return {Bigodon} Returns the Bigodon instance for chaining
     */
    addHelper = (name: string, helper: Function): Bigodon => {
        ensure(typeof name === 'string', 'name must be a string');
        ensure(typeof helper === 'function', 'helper must be a function');

        this.helpers.set(name, helper);
        return this;
    };
}

const defaultBigodon = new Bigodon();

/**
 * Parses a template and returns an AST representing it.
 * This can be persisted as JSON for later usage.
 *
 * @param {string} template Bigodon template to be parsed
 * @return {TemplateStatement} AST representing input template
 */
export const { parse, parseExpression } = defaultBigodon;

/**
 * Runs an AST returned by the {@link parse} method.
 *
 * @param {TemplateStatement} ast AST returned by {@link parse}.
 * @param {object?} context Context to be used when evaluating the template.
 * @param {BigodonOptions?} options Options to be used.
 * @return {Promise<string>} Promise that resolves to the rendered template.
 */
export const { run, runExpression } = defaultBigodon;

/**
 * Compiles a template and returns a function that, when called, executes it
 *
 * @param {string} template Bigodon template to be parsed
 * @return {TemplateRunner} Function that executes the template
 */
export const { compile, compileExpression } = defaultBigodon;

export { ParseError } from 'pierrejs';
export { TemplateStatement } from './parser/statements';
export { BigodonOptions } from './runner/options';
export { Execution } from './runner/execution';
export default Bigodon;
