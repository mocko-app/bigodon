import { LiteralValue, runStatement } from './index';
import { ExpressionStatement } from '../parser/statements';
import { helpers } from './helpers';
import { UNSAFE_KEYS } from '../utils';
import { Execution } from './execution';

async function runHelper(execution: Execution, expression: ExpressionStatement): Promise<LiteralValue> {
    const helperName = expression.path;
    if (UNSAFE_KEYS.has(helperName)) {
        throw new Error(`Helper ${helperName} not allowed`);
    }

    const fn = execution.extraHelpers.get(helperName) || helpers[helperName];
    if (!fn) {
        throw new Error(`Helper ${helperName} not found`);
    }

    const params = [];
    for (const param of expression.params) {
        params.push(await runStatement(execution, param));
    }

    const namedParams = Object.create(null);
    for (const { name, value } of expression.namedParams || []) {
        namedParams[name] = await runStatement(execution, value);
    }

    execution.namedParams = namedParams;
    const result = await fn.apply(execution, params);
    return result;
}

export async function runHelperExpression(execution: Execution, expression: ExpressionStatement): Promise<LiteralValue> {
    try {
        return await runHelper(execution, expression);
    } catch (e) {
        if (expression.loc) {
            e.message = `Error at helper ${expression.path}, position ${expression.loc.start}: ${e.message}`;
        } else {
            e.message = `Error at helper ${expression.path}: ${e.message}`;
        }
        throw e;
    }
}
