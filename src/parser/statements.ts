export type Location = {
    start: number;
    end: number;
};

export type TextStatement = {
    type: 'TEXT';
    loc: Location;
    value: string;
};

export type CommentStatement = {
    type: 'COMMENT';
    loc: Location;
    value: string;
};

export type ValueStatement = ExpressionStatement | LiteralStatement | VariableStatement;

export type NamedParam = {
    name: string;
    value: ValueStatement;
};

export type ExpressionStatement = {
    type: 'EXPRESSION';
    loc: Location;
    path: string;
    params: ValueStatement[];
    namedParams?: NamedParam[];
};

export type MustacheStatement = {
    type: 'MUSTACHE';
    loc: Location;
    expression: ValueStatement;
};

export type BlockStatement = {
    type: 'BLOCK';
    loc: Location;
    isNegated: boolean;
    isNested?: boolean;
    expression: ExpressionStatement;
    statements: Statement[];
    elseStatements?: Statement[];
};

export type TemplateStatement = {
    type: 'TEMPLATE';
    loc: Location;
    version: number;
    statements: Statement[];
};

export type LiteralStatement = {
    type: 'LITERAL';
    loc: Location;
    value: string | number | boolean | null | undefined;
};

export type VariableStatement = {
    type: 'VARIABLE';
    loc: Location;
    name: string;
};

export type AssignmentStatement = {
    type: 'ASSIGNMENT';
    loc: Location;
    variable: VariableStatement;
    expression: ValueStatement;
};

export type Statement =
    | TextStatement
    | LiteralStatement
    | CommentStatement
    | BlockStatement
    | ExpressionStatement
    | MustacheStatement
    | TemplateStatement
    | VariableStatement
    | AssignmentStatement;
