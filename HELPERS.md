# Bigodon Helpers

When writing your Bigodon template, you can use helper functions to perform common tasks. These are the categories of helpers:

- [array](#Array-Helpers) ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/array.ts); [tests](https://github.com/mocko-app/bigodon/blob/main/test/array-helpers.spec.js))
- [comparison](#Comparison-Helpers) ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/comparison.ts); [tests](https://github.com/mocko-app/bigodon/blob/main/test/comparison-helpers.spec.js))
- [date](#Date-Helpers) ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/date.ts); [tests](https://github.com/mocko-app/bigodon/blob/main/test/helpers/date.spec.js))
- [string](#String-Helpers) ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/string.ts); [tests](https://github.com/mocko-app/bigodon/blob/main/test/string-helpers.spec.js))

## Array Helpers

- [each](#each): Iterates over each item of an array. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/array.ts#L89-L95); [tests](https://github.com/mocko-app/bigodon/blob/main/test/array-helpers.spec.js#L225-L236))
- [forEach](#forEach): Iterates over each item of an array with some context (isFirst, isLast, index, total). ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/array.ts#L97-L110); [tests](https://github.com/mocko-app/bigodon/blob/main/test/array-helpers.spec.js#L237-L258))
- [itemAt](#itemAt): Returns the item at the given index. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/array.ts#L19-L28); [tests](https://github.com/mocko-app/bigodon/blob/main/test/array-helpers.spec.js#L48-L75))
- [first](#first): Returns the first item of an array. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/array.ts#L3-L9); [tests](https://github.com/mocko-app/bigodon/blob/main/test/array-helpers.spec.js#L12-L28))
- [last](#last): Returns the last item of an array. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/array.ts#L11-L17); [tests](https://github.com/mocko-app/bigodon/blob/main/test/array-helpers.spec.js#L30-L46))
- [length](#length): Returns the length of an array. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/array.ts#L30-L36); [tests](https://github.com/mocko-app/bigodon/blob/main/test/array-helpers.spec.js#L77-L97))
- [slice](#slice): Returns a slice of an array. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/array.ts#L60-L71); [tests](https://github.com/mocko-app/bigodon/blob/main/test/array-helpers.spec.js#L143-L174))
- [after](#after): Returns the items after the given index. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/array.ts#L38-L47); [tests](https://github.com/mocko-app/bigodon/blob/main/test/array-helpers.spec.js#L99-L124))
- [before](#before): Returns the items before the given index. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/array.ts#L49-L58); [tests](https://github.com/mocko-app/bigodon/blob/main/test/array-helpers.spec.js#L126-L141))
- [includes](#includes): Returns true if the given item is in the array. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/array.ts#L73-L83); [tests](https://github.com/mocko-app/bigodon/blob/main/test/array-helpers.spec.js#L176-L210))
- [contains](#contains): Alias of [includes](#includes).
- [isArray](#isArray): Returns true if the given item is an array. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/array.ts#L85-L87); [tests](https://github.com/mocko-app/bigodon/blob/main/test/array-helpers.spec.js#L212-L223))
- [join](#join): Joins an array of items into a string with a separator. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/array.ts#L112-L118); [tests](https://github.com/mocko-app/bigodon/blob/main/test/array-helpers.spec.js#L260-L279))
- [merge](#merge): Merges multiple arrays into one. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/array.ts#L120-L128); [tests](https://github.com/mocko-app/bigodon/blob/main/test/array-helpers.spec.js#L281-L293))
- [reverse](#reverse): Reverses an array. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/array.ts#L130-L140); [tests](https://github.com/mocko-app/bigodon/blob/main/test/array-helpers.spec.js#L295-L314))
- [pluck](#pluck): Returns an array of the given property from each item in the original one. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/array.ts#L142-L154); [tests](https://github.com/mocko-app/bigodon/blob/main/test/array-helpers.spec.js#L316-L336))
- [unique](#unique): Returns an array of unique items from the original one. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/array.ts#L156-L162); [tests](https://github.com/mocko-app/bigodon/blob/main/test/array-helpers.spec.js#L338-L352))
- [splice](#splice): Returns a splice of an array. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/array.ts#L173-L181); [tests](https://github.com/mocko-app/bigodon/blob/main/test/array-helpers.spec.js#L364-L391))
- [sort](#sort): Sorts a numeric or string(based on the first letter of the word) array([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/array.ts#L194-L210); [tests](https://github.com/mocko-app/bigodon/blob/main/test/array-helpers.spec.js#L393-L436))

From [string helpers](#String-Helpers):
- [split](#split): Splits a string into an array of strings on each separator. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/string.ts#L6); [tests](https://github.com/mocko-app/bigodon/blob/main/test/string-helpers.spec.js#L89-L95))

## Code Helpers

- [if](#if): Runs a block if the parameter is truthy without changing context. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/code.ts#L2); [tests](https://github.com/mocko-app/bigodon/blob/main/test/code-helpers.spec.js#L11-L27))
- [typeof](#typeof): Returns the type of the argument. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/code.ts#L3); [tests](https://github.com/mocko-app/bigodon/blob/main/test/code-helpers.spec.js#L29-L38))
- [with](#with): Runs a block with the given context. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/code.ts#L4); [tests](https://github.com/mocko-app/bigodon/blob/main/test/code-helpers.spec.js#L40-L74))
- [return](#return): Halts the execution and the template will return what has already been rendered. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/code.ts#L5-L8); [tests](https://github.com/mocko-app/bigodon/blob/main/test/code-helpers.spec.js#L76-L97))
- [pick](#pick): Returns a property from an object using a string key.


## Comparison Helpers

- [unless](#unless): Runs a block if the parameter is falsy without changing context. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/comparison.ts#L10); [tests](https://github.com/mocko-app/bigodon/blob/main/test/comparison-helpers.spec.js#L166-L172))
- [and](#and): Returns true if all arguments are truthy. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/comparison.ts#L1); [tests](https://github.com/mocko-app/bigodon/blob/main/test/comparison-helpers.spec.js#L39-L64))
- [or](#or): Returns true if any argument is truthy. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/comparison.ts#L2); [tests](https://github.com/mocko-app/bigodon/blob/main/test/comparison-helpers.spec.js#L66-L91))
- [not](#not): Returns true if the argument is falsy. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/comparison.ts#L3); [tests](https://github.com/mocko-app/bigodon/blob/main/test/comparison-helpers.spec.js#L93-L99))
- [eq](#eq): Returns true if the arguments are strictly equal (===). ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/comparison.ts#L4); [tests](https://github.com/mocko-app/bigodon/blob/main/test/comparison-helpers.spec.js#L11-L23))
- [is](#is): Returns true if the arguments are loosely equal (==). ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/comparison.ts#L5); [tests](https://github.com/mocko-app/bigodon/blob/main/test/comparison-helpers.spec.js#L25-L37))
- [gt](#gt): Returns true if the first argument is greater than the second. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/comparison.ts#L6); [tests](https://github.com/mocko-app/bigodon/blob/main/test/comparison-helpers.spec.js#L101-L115))
- [gte](#gte): Returns true if the first argument is greater than or equal to the second. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/comparison.ts#L7); [tests](https://github.com/mocko-app/bigodon/blob/main/test/comparison-helpers.spec.js#L117-L131))
- [lt](#lt): Returns true if the first argument is less than the second. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/comparison.ts#L8); [tests](https://github.com/mocko-app/bigodon/blob/main/test/comparison-helpers.spec.js#L133-L148))
- [lte](#lte): Returns true if the first argument is less than or equal to the second. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/comparison.ts#L9); [tests](https://github.com/mocko-app/bigodon/blob/main/test/comparison-helpers.spec.js#L150-L164))
- [default](#default): Returns the first argument that is not undefined or null. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/comparison.ts#L11); [tests](https://github.com/mocko-app/bigodon/blob/main/test/comparison-helpers.spec.js#L174-L199))
- [coalesce](#coalesce): Alias of [default](#default).
- [firstNonNull](#firstNonNull): Alias of [default](#default).

From [array helpers](#Array-Helpers):
- [includes](#includes): Returns true if the given item is in the array or if a substring is in a string. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/array.ts#L73-L83); [tests](https://github.com/mocko-app/bigodon/blob/main/test/array-helpers.spec.js#L176-L210))
- [contains](#contains): Alias of [includes](#includes).
- [isArray](#isArray): Returns true if the given item is an array. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/array.ts#L85-L87); [tests](https://github.com/mocko-app/bigodon/blob/main/test/array-helpers.spec.js#L212-L223))

From [string helpers](#String-Helpers):
- [startsWith](#startsWith): Returns true if the string starts with the given value. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/string.ts#L7); [tests](https://github.com/mocko-app/bigodon/blob/main/test/string-helpers.spec.js#L97-L127))
- [endsWith](#endsWith): Returns true if the string ends with the given value. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/string.ts#L8); [tests](https://github.com/mocko-app/bigodon/blob/main/test/string-helpers.spec.js#L129-L159))


## String Helpers

- [append](#append): Appends several strings into one. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/string.ts#L3); [tests](https://github.com/mocko-app/bigodon/blob/main/test/string-helpers.spec.js#L11-L29))
- [uppercase](#uppercase): Returns the string in uppercase. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/string.ts#L4); [tests](https://github.com/mocko-app/bigodon/blob/main/test/string-helpers.spec.js#L31-L55))
- [upper](#upper): Alias of [uppercase](#uppercase).
- [upcase](#upcase): Alias of [uppercase](#uppercase).
- [lowercase](#lowercase): Returns the string in lowercase. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/string.ts#L5); [tests](https://github.com/mocko-app/bigodon/blob/main/test/string-helpers.spec.js#L57-L87))
- [lower](#lower): Alias of [lowercase](#lowercase).
- [lowcase](#lowcase): Alias of [lowercase](#lowercase).
- [downcase](#downcase): Alias of [lowercase](#lowercase).
- [down](#down): Alias of [lowercase](#lowercase).
- [capitalize](#capitalize): Capitalizes the first letter of the string. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/string.ts#L15-L18); [tests](https://github.com/mocko-app/bigodon/blob/main/test/string-helpers.spec.js#L223-L241))
- [capitalizeFirst](#capitalizeFirst): Alias of [capitalize](#capitalize).
- [capitalizeAll](#capitalizeAll): Capitalizes the first letter of each word in a string. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/string.ts#L19-L22); [tests](https://github.com/mocko-app/bigodon/blob/main/test/string-helpers.spec.js#L243-L261))
- [capitalizeWords](#capitalizeWords): Alias of [capitalizeAll](#capitalizeAll).
- [startsWith](#startsWith): Returns true if the string starts with the given value. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/string.ts#L7); [tests](https://github.com/mocko-app/bigodon/blob/main/test/string-helpers.spec.js#L97-L127))
- [endsWith](#endsWith): Returns true if the string ends with the given value. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/string.ts#L8); [tests](https://github.com/mocko-app/bigodon/blob/main/test/string-helpers.spec.js#L129-L159))
- [toString](#toString): Returns the string representation of the given value. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/string.ts#L12); [tests](https://github.com/mocko-app/bigodon/blob/main/test/string-helpers.spec.js#L215-L221))
- [split](#split): Splits a string into an array of strings on each separator. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/string.ts#L6); [tests](https://github.com/mocko-app/bigodon/blob/main/test/string-helpers.spec.js#L89-L95))
- [replace](#replace): Replaces all occurrences of the given value with the given replacement. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/string.ts#L13); [tests](https://github.com/mocko-app/bigodon/blob/main/test/string-helpers.spec.js#L263-L281))
- [substring](#substring): Returns a substring of the given string. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/string.ts#L23-L27); [tests](https://github.com/mocko-app/bigodon/blob/main/test/string-helpers.spec.js#L283-L301))
- [json](#json): Returns the json string of an object.
- [JSONstringify](#jsonstringify): Alias of [json](#json).
- [trim](#trim): Removes whitespace around a string. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/string.ts#L9); [tests](https://github.com/mocko-app/bigodon/blob/main/test/string-helpers.spec.js#L161-L173))
- [trimLeft](#trimLeft): Removes whitespace from the left side of a string. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/string.ts#L10); [tests](https://github.com/mocko-app/bigodon/blob/main/test/string-helpers.spec.js#L175-L193))
- [trimStart](#trimStart): Alias of [trimLeft](#trimLeft).
- [trimRight](#trimRight): Removes whitespace from the right side of a string. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/string.ts#L11); [tests](https://github.com/mocko-app/bigodon/blob/main/test/string-helpers.spec.js#L195-L213))
- [trimEnd](#trimEnd): Alias of [trimRight](#trimRight).
- [padRight](#padRight): Pads the string with the given value to the right until it reaches the given length. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/string.ts#L35-L41); [tests](https://github.com/mocko-app/bigodon/blob/main/test/string-helpers.spec.js#L329-L353))
- [padEnd](#padEnd): Alias of [padRight](#padRight).
- [padLeft](#padLeft): Pads the string with the given value to the left until it reaches the given length. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/string.ts#L28-L34); [tests](https://github.com/mocko-app/bigodon/blob/main/test/string-helpers.spec.js#L303-L327))
- [padStart](#padStart): Alias of [padLeft](#padLeft).
- [uuid](#uuid): Generates a random UUID v4.

From [array helpers](#Array-Helpers):
- [length](#length): Returns the length of a string. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/array.ts#L30-L36); [tests](https://github.com/mocko-app/bigodon/blob/main/test/array-helpers.spec.js#L77-L97))
- [includes](#includes): Returns true if the given substring is in the string. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/array.ts#L73-L83); [tests](https://github.com/mocko-app/bigodon/blob/main/test/array-helpers.spec.js#L176-L210))
- [contains](#contains): Alias of [includes](#includes).
- [reverse](#reverse): Reverses a string. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/array.ts#L130-L140); [tests](https://github.com/mocko-app/bigodon/blob/main/test/array-helpers.spec.js#L295-L314))
- [join](#join): Joins an array of items into a string with a separator. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/array.ts#L112-L118); [tests](https://github.com/mocko-app/bigodon/blob/main/test/array-helpers.spec.js#L260-L279))

From [comparison helpers](#Comparison-Helpers):
- [default](#default): Returns the first argument that is not undefined or null. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/comparison.ts#L11); [tests](https://github.com/mocko-app/bigodon/blob/main/test/comparison-helpers.spec.js#L174-L199))
- [coalesce](#coalesce): Alias of [default](#default).
- [firstNonNull](#firstNonNull): Alias of [default](#default).

From [code helpers](#Code-Helpers):
- [typeof](#typeof): Returns the type of the argument. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/code.ts#L3); [tests](https://github.com/mocko-app/bigodon/blob/main/test/code-helpers.spec.js#L29-L38))

## Date Helpers

- [date](#date): Creates a date from a timestamp number, Date object, or ISO string with explicit time. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/date.ts); [tests](https://github.com/mocko-app/bigodon/blob/main/test/helpers/date.spec.js))
- [now](#now): Returns the current date/time as a Date object. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/date.ts); [tests](https://github.com/mocko-app/bigodon/blob/main/test/helpers/date.spec.js))
- [dateAdd](#dateadd): Adds time and returns a new date. Supports ms, s, min, h, day, week, month and year units (with aliases). ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/date.ts); [tests](https://github.com/mocko-app/bigodon/blob/main/test/helpers/date.spec.js))
- [dateSub](#datesub): Subtracts time and returns a new date. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/date.ts); [tests](https://github.com/mocko-app/bigodon/blob/main/test/helpers/date.spec.js))
- [dateIso](#dateiso): Returns the date in ISO format. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/date.ts); [tests](https://github.com/mocko-app/bigodon/blob/main/test/helpers/date.spec.js))
- [dateTimestamp](#datetimestamp): Returns unix timestamp in milliseconds. ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/date.ts); [tests](https://github.com/mocko-app/bigodon/blob/main/test/helpers/date.spec.js))
- [dateDiff](#datediff): Returns date difference with ms as default unit (supports up to week granularity). ([code](https://github.com/mocko-app/bigodon/blob/main/src/runner/helpers/date.ts); [tests](https://github.com/mocko-app/bigodon/blob/main/test/helpers/date.spec.js))

From [date helpers](#Date-Helpers):
- Date strings must include explicit time component, so `2024-01-01` is rejected while `2024-01-01T00:00:00.000Z` is accepted.

## Examples

### **each**

`each` runs a block N times for the given array items as context. If provided with a non-array, it runs the block once with it as context.

#### Examples:

```hbs
Keywords:
{{#each keywords}}
- {{ $this }}
{{/each}}
```

<details>
<summary>Context and output</summary>

With context `{"keywords": ["lorem", "ipsum", "dolor"]}` the output would be:
```
Keywords:
- lorem
- ipsum
- dolor
```

With context `{"keywords": "foo"}` the output would be:
```
Keywords:
- lorem
```

With context `{"keywords": []}` the output would be:
```
Keywords:
```

With context `{"keywords": null}` the output would be:
```
Keywords:
- null
```

</details>

```hbs
{{name}}, you got {{length comments }} comments:

{{#each comments}}
    From {{author}} to {{$parent.name}}:
    {{comment}}
{{/each}}
```

<details>
<summary>Context and output</summary>

### Context
```json
{
    "name": "George",
    "comments": [{
        "author": "Alice",
        "comment": "Nice presentation"
    }, {
        "author": "Bob",
        "comment": "Thanks for the feedbacks"
    }]
}
```

### Generated output
```
George, you got 2 comments:


    From Alice to George:
    Nice presentation

    From Bob to George:
    Thanks for the feedbacks
```

</details>

### **itemAt**

`itemAt` returns the item at the given index from an array.

#### Example:
```hbs
First item: {{itemAt fruits 0}}
Second item: {{itemAt fruits 1}}
Item at position {{pos}}: {{itemAt fruits pos}}
```

<details>
<summary>Context and output</summary>

### Context
```json
{
    "fruits": ["apple", "banana", "orange"],
    "pos": 2
}
```

### Generated output
```
First item: apple
Second item: banana
Item at position 2: orange
```

</details>

---

### **slice**

`slice` returns a slice of an array from the specified index(es). When given one argument, it returns items from that index to the end. When given two arguments, it returns items from the first index up to (but not including) the second index.

#### Examples:
```hbs
Last two items:
{{#slice fruits 1}}
- {{$this}}
{{/slice}}
```

```hbs
Middle items:
{{#slice fruits 1 3}}
- {{$this}}
{{/slice}}
```

<details>
<summary>Context and output</summary>

### Context
```json
{
    "fruits": ["apple", "banana", "orange", "grape"]
}
```

### Generated output (first example)
```
Last two items:
- banana
- orange
- grape
```

### Generated output (second example)
```
Middle items:
- banana
- orange
```

</details>

---

### **includes**

`includes` returns true if the given item is in an array or if a substring is found in a string.

#### Examples with arrays:
```hbs
{{#if (includes fruits "banana")}}
  We have bananas!
{{else}}
  No bananas available.
{{/if}}
```

#### Examples with strings:
```hbs
{{#if (includes message "error")}}
  This is an error message.
{{/if}}
```

<details>
<summary>Context and output</summary>

### Context (array example)
```json
{
    "fruits": ["apple", "banana", "orange"]
}
```

### Generated output (array example)
```
  We have bananas!
```

### Context (string example)
```json
{
    "message": "An error occurred while processing"
}
```

### Generated output (string example)
```
  This is an error message.
```

</details>

---

### **pluck**

`pluck` extracts a specific property from each object in an array, returning an array of those property values.

#### Example:
```hbs
User names: {{join (pluck users "name") ", "}}
User IDs: {{join (pluck users "id") ", "}}
```

<details>
<summary>Context and output</summary>

### Context
```json
{
    "users": [
        {"id": 1, "name": "Alice", "age": 30},
        {"id": 2, "name": "Bob", "age": 25},
        {"id": 3, "age": 35}
    ]
}
```

### Generated output
```
User names: Alice, Bob
User IDs: 1, 2
```

</details>

---

### **splice**

`splice` removes elements from an array starting at the specified index and returns the removed elements. Takes a start index and optionally a delete count.

#### Example:
```hbs
Removed items:
{{#splice items 1 2}}
- {{$this}}
{{/splice}}
```

<details>
<summary>Context and output</summary>

### Context
```json
{
    "items": ["first", "second", "third", "fourth", "fifth"]
}
```

### Generated output
```
Removed items:
- second
- third
```

</details>

---

### **sort**

`sort` sorts an array of numbers or strings. Numbers are sorted numerically, strings are sorted alphabetically (case-insensitive). An optional second parameter can be set to true for descending order.

#### Examples:
```hbs
Numbers (ascending): {{join (sort numbers) ", "}}
Numbers (descending): {{join (sort numbers true) ", "}}
Words (ascending): {{join (sort words) ", "}}
Words (descending): {{join (sort words true) ", "}}
```

<details>
<summary>Context and output</summary>

### Context
```json
{
    "numbers": [100, 14, 78, 90, -100],
    "words": ["banana", "Orange", "apple", "Mango"]
}
```

### Generated output
```
Numbers (ascending): -100, 14, 78, 90, 100
Numbers (descending): 100, 90, 78, 14, -100
Words (ascending): apple, banana, Mango, Orange
Words (descending): Orange, Mango, banana, apple
```

</details>

---

### **forEach**

`forEach` runs a block N times with information about the current item as context. The context will have:
- `item`: The current item.
- `index`: The current index.
- `total`: The length of the array.
- `isFirst`: True if the current item is the first one.
- `isLast`: True if the current item is the last one.

#### Example:
```hbs
{{#forEach items}}
    {{index}}: {{item}}{{^isLast}};{{else}}.{{/isLast}}
{{/forEach}}
```

<details>
<summary>Context and output</summary>

### Context
```json
{
    "items": ["potato", "carrot", "onion"]
}
```

### Generated output
```
0: potato;
1: carrot;
2: onion.
```

</details>

### **with**

`with` runs a block with the given value as the new context. This allows you to access properties of an object or work with a specific value without needing to reference the full path.

#### Example:
```hbs
{{#with user}}
  Name: {{name}}
  Email: {{email}}
  {{#with address}}
    City: {{city}}
    Country: {{country}}
  {{/with}}
{{/with}}
```

<details>
<summary>Context and output</summary>

### Context
```json
{
    "user": {
        "name": "Alice",
        "email": "alice@example.com",
        "address": {
            "city": "New York",
            "country": "USA"
        }
    }
}
```

### Generated output
```
  Name: Alice
  Email: alice@example.com
    City: New York
    Country: USA
```

</details>

---

### **pick**

`pick` returns a property from an object using a string key.

#### Example:
```hbs
Name: {{pick user "name"}}
Literal dotted key: {{pick $this "foo.bar"}}
```

<details>
<summary>Context and output</summary>

### Context
```json
{
    "user": {
        "name": "Alice"
    },
    "foo.bar": "baz"
}
```

### Generated output
```
Name: Alice
Literal dotted key: baz
```

</details>

---

### **return**

`return` halts template execution immediately and returns what has already been rendered up to that point. This is useful for conditional early termination.

#### Example:
```hbs
Processing started...
{{#if shouldStop}}
{{return}}
{{/if}}
This will only show if shouldStop is false.
Processing completed.
```

<details>
<summary>Context and output</summary>

### Context (with shouldStop: true)
```json
{
    "shouldStop": true
}
```

### Generated output (with shouldStop: true)
```
Processing started...
```

### Context (with shouldStop: false)
```json
{
    "shouldStop": false
}
```

### Generated output (with shouldStop: false)
```
Processing started...
This will only show if shouldStop is false.
Processing completed.
```

</details>

---

### **json**

`json` returns the json string of an object.

#### Example:
```hbs
Compact: {{json user}}
Pretty:
{{json user true}}
Indented:
{{json user 4}}
```

<details>
<summary>Context and output</summary>

### Context
```json
{
    "user": {
        "name": "Alice",
        "age": 30
    }
}
```

### Generated output
```
Compact: {"name":"Alice","age":30}
Pretty:
{
  "name": "Alice",
  "age": 30
}
Indented:
{
    "name": "Alice",
    "age": 30
}
```

</details>

---

### **JSONstringify**

`JSONstringify` is an alias of [`json`](#json).

### **or**

`or` returns true if any of the given arguments are truthy.

#### Example:
```hbs
{{#or (eq food "apple") (eq food "banana") (eq food "orange")}}
    {{upper food}} is a fruit.
{{else}}
    {{upper food}} is not a fruit.
{{/or}}
```
<details>
<summary>Context and output</summary>

### Context
```json
{
    "food": "banana"
}
```

### Generated output
```
BANANA is a fruit
```

</details>

---

### **startsWith**

`startsWith` returns true if a string starts with the given prefix. Works with both strings and numbers.

#### Example:
```hbs
{{#startsWith filename "temp_"}}
  This is a temporary file.
{{/startsWith}}

{{#startsWith phone "555"}}
  This is a 555 number.
{{/startsWith}}
```

<details>
<summary>Context and output</summary>

### Context
```json
{
    "filename": "temp_data.txt",
    "phone": "5551234567"
}
```

### Generated output
```
  This is a temporary file.

  This is a 555 number.
```

</details>

---

### **endsWith**

`endsWith` returns true if a string ends with the given suffix. Works with both strings and numbers.

#### Example:
```hbs
{{#endsWith filename ".pdf"}}
  This is a PDF file.
{{/endsWith}}

{{#endsWith id "00"}}
  This ID ends with 00.
{{/endsWith}}
```

<details>
<summary>Context and output</summary>

### Context
```json
{
    "filename": "document.pdf",
    "id": "12300"
}
```

### Generated output
```
  This is a PDF file.

  This ID ends with 00.
```

</details>

---

### **append**

`append` concatenates multiple strings together into one string.

#### Example:
```hbs
Full name: {{append firstName " " lastName}}
File path: {{append baseDir "/" filename ".txt"}}
```

<details>
<summary>Context and output</summary>

### Context
```json
{
    "firstName": "John",
    "lastName": "Doe",
    "baseDir": "/home/user",
    "filename": "document"
}
```

### Generated output
```
Full name: John Doe
File path: /home/user/document.txt
```

</details>

---

### **capitalize**

`capitalize` capitalizes the first letter of a string while keeping the rest unchanged.

#### Example:
```hbs
Greeting: {{capitalize greeting}}
```

<details>
<summary>Context and output</summary>

### Context
```json
{
    "greeting": "hello world"
}
```

### Generated output
```
Greeting: Hello world
```

</details>

---

### **capitalizeAll**

`capitalizeAll` capitalizes the first letter of each word in a string.

#### Example:
```hbs
Title: {{capitalizeAll title}}
```

<details>
<summary>Context and output</summary>

### Context
```json
{
    "title": "the quick brown fox"
}
```

### Generated output
```
Title: The Quick Brown Fox
```

</details>

---

### **split**

`split` divides a string into an array of substrings using a separator. Often used with the `each` helper to iterate over the parts.

#### Examples:
```hbs
{{#each (split tags ",")}}
- {{trim $this}}
{{/each}}
```

```hbs
Path segments:
{{#each (split path "/")}}
  {{#if $this}}Segment: {{$this}}{{/if}}
{{/each}}
```

<details>
<summary>Context and output</summary>

### Context (first example)
```json
{
    "tags": "javascript,react,node,web"
}
```

### Generated output (first example)
```
- javascript
- react
- node
- web
```

### Context (second example)
```json
{
    "path": "/home/user/documents/file.txt"
}
```

### Generated output (second example)
```
Path segments:
  Segment: home
  Segment: user
  Segment: documents
  Segment: file.txt
```

</details>

---

### **date helpers**

Date helpers parse explicit timestamps, create dates, add/subtract time, format ISO strings, return timestamps, and compute differences.

#### Parse and format a stored timestamp:
```hbs
Created: {{dateIso (date createdAt)}}
Created timestamp: {{dateTimestamp (date createdAt)}}
```

<details>
<summary>Context and output</summary>

### Context
```json
{
    "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Generated output
```text
Created: 2024-01-01T00:00:00.000Z
Created timestamp: 1704067200000
```

</details>

---

#### Simulate a monthly subscription renewal:
```hbs
Renewal date: {{dateIso (dateAdd (now) 1 "month")}}
```

<details>
<summary>Context and output</summary>

### Context
```json
{}
```

### Generated output
```text
Renewal date: <one month after the current date/time, in ISO format>
```

</details>

---

#### Compare a stored timestamp with the current time:
```hbs
Age in days: {{dateDiff (now) (date createdAt) "day"}}
```

<details>
<summary>Context and output</summary>

### Context
```json
{
    "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Generated output
```text
Age in days: <depends on current time>
```

</details>

---
