import type { Execution } from '../execution';
import { ensure, isLookupObject, lookupOwnValue, UNSAFE_KEYS } from '../../utils';
const hIf = (a: any) => Boolean(a);
const hTypeof = (a: any) => typeof a;
const hWith = (a: any) => [a];
const hReturn = function(this: Execution): '' {
    this.halt();
    return '' as const;
};

function object(this: Execution, ...params: any[]): object {
    ensure(params.length === 0, 'object only accepts named parameters');
    return this.namedParams;
}

function pick(value: any, key: string): any {
    ensure(typeof key === 'string', 'pick second argument must be a string');

    if (Array.isArray(value)) {
        throw new Error('pick expects an object as first argument, received array; use itemAt for array indexing');
    }

    ensure(isLookupObject(value), 'pick expects an object as first argument');

    if (UNSAFE_KEYS.has(key)) {
        throw new Error(`pick does not allow access to unsafe key "${key}"`);
    }

    return lookupOwnValue(value, key);
}

export const codeHelpers = Object.assign(Object.create(null), {
    if: hIf, typeof: hTypeof, with: hWith, return: hReturn, pick, object,
});
