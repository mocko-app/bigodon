# Bigodon
Secure Handlebars/Mustache templating for user-provided templates with async helpers support and human-friendly parsing errors.


## Features

As well as most Handlebars features like:
- Handlebars dot notation inside mustaches (`{{foo.bar}}`)
- Handlebars literal values (`{{add 5 6}}`)
- Comments (`{{! ... }}`)
- Nested expressions (`{{capitalize (append data.firstName data.secondName)}}`)
- Blocks (`{{#name}}...{{/name}}`)
- Inverted blocks (`{{^name}}...{{/name}}`)
- Else blocks (`{{#name}}...{{else}}...{{/name}}`)
- Parent and current context (`{{#list}}{{$parent.name}} {{$this}}{{/list}}`)
- Named parameters (`{{greet name greeting="Hi"}}`)

Bigodon also supports:
- Async helpers, you can await for requests, database access, file access and so on.
- Safely evaluate user-provided templates. (Templates aren't transpiled to JavaScript, they're interpreted by Bigodon)
- Much better performance.
- Better error reporting.
- Better native helpers.

Bigodon is used in production by [Mocko](https://mocko.dev/).

## Installation

Add the `bigodon` dependency to your project. Types included:
```shell
npm install bigodon
```

## Usage

```javascript
const { compile } = require('bigodon');

async function main() {
    const source = 'Hello, {{name}}!';
    const template = compile(source);

    const result = await template({
        name: 'George'
    });

    console.log(result); // Hello, George!
}

main().catch(console.error);
```

Or, if you want to split parsing from execution between services or cache the parsed AST:
```javascript
const { parse, run } = require('bigodon');

const source = 'Hello, {{name}}!';
const ast = parse(source); // This will return a JSON object that can be persisted for later usage


// In another process or later:
async function main() {
    const result = await run(ast, {
        name: 'George'
    });

    console.log(result); // Hello, George!
}
main().catch(console.error);
```

## Check how to use the lib [here](LIB.md)
## Check how to use the language [here](LANGUAGE.md)

## Check the available helpers [here](HELPERS.md)
