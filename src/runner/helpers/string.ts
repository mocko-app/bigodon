import { ensure } from '../../utils';
import { randomUUID } from 'node:crypto';

const append = (...args: any[]) => args.map(a => String(a)).join('');
const uppercase = (str: any) => String(str).toUpperCase();
const lowercase = (str: any) => String(str).toLowerCase();
const split = (str: any, separator: any) => String(str).split(String(separator));
const startsWith = (str: any, prefix: any) => String(str).startsWith(String(prefix));
const endsWith = (str: any, suffix: any) => String(str).endsWith(String(suffix));
const trim = (str: any) => String(str).trim();
const trimLeft = (str: any) => String(str).trimLeft();
const trimRight = (str: any) => String(str).trimRight();
const toString = (obj: any) => String(obj);
const replace = (str: any, from: string, to: string): string => String(str).split(String(from)).join(String(to));

function capitalize(str: string): string {
    const strng = String(str);
    return strng.charAt(0).toUpperCase() + strng.slice(1);
}

function capitalizeAll(str: string): string {
    const strng = String(str);
    return strng.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

function substring(str: any, start: number, end?: number): string {
    ensure(typeof start === 'number', 'start must be a number');
    ensure(typeof end === 'number' || typeof end === 'undefined', 'end must be a number or undefined');
    return String(str).substring(start, end);
}

function padLeft(str: any, length: number, char: string): string {
    ensure(typeof length === 'number', 'length must be a number');
    ensure(typeof char === 'undefined' || typeof char === 'string', 'char must be a string or undefined');
    ensure(typeof char === 'undefined' || char.length === 1, 'char must be a single character');

    return String(str).padStart(length, char);
}

function padRight(str: any, length: number, char: string): string {
    ensure(typeof length === 'number', 'length must be a number');
    ensure(typeof char === 'undefined' || typeof char === 'string', 'char must be a string or undefined');
    ensure(typeof char === 'undefined' || char.length === 1, 'char must be a single character');

    return String(str).padEnd(length, char);
}

function json(obj: any, format?: boolean | number): string {
    ensure(
        typeof format === 'undefined' || typeof format === 'boolean' || typeof format === 'number',
        'json second argument must be a boolean or number',
    );

    let space;
    if (format === true) {
        space = 2;
    } else if (typeof format === 'number') {
        space = format;
    }

    const result = JSON.stringify(obj, null, space);
    return typeof result === 'string' ? result : 'null';
}

export const stringHelpers = Object.assign(Object.create(null), {
    append, upper: uppercase, upcase: uppercase, uppercase,
    lowercase, down: lowercase, lower: lowercase, padRight,
    lowcase: lowercase, downcase: lowercase, capitalize,
    capitalizeAll, padStart: padLeft, padEnd: padRight, trim,
    capitalizeFirst: capitalize, toString, split, startsWith,
    endsWith, trimLeft, trimRight, trimStart: trimLeft,
    trimEnd: trimRight, replace, substring, padLeft,
    capitalizeWords: capitalizeAll, uuid: randomUUID, json,
    JSONstringify: json,
});
