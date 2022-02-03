## fast-unset

🪄 Efficiently remove, replace, set or default object properties.

[![build package and run tests](https://github.com/lucagoslar/fast-unset/actions/workflows/main.yml/badge.svg)](https://github.com/lucagoslar/fast-unset/actions/workflows/main.yml)

### Index

- [fast-unset](#fast-unset)
	- [Index](#index)
- [Usage](#usage)
	- [Deleting properties](#deleting-properties)
	- [Setting values](#setting-values)
	- [Modifiers](#modifiers)
		- [rule](#rule)
		- [value](#value)
	- [Flags](#flags)
		- [deep](#deep)
		- [default](#default)
		- [direct](#direct)
	- [Working with arrays](#working-with-arrays)
	- [Known limitattions](#known-limitattions)
- [Example](#example)
- [Benchmarking](#benchmarking)
- [Tests](#tests)
- [API Reference](#api-reference)
- [Contribute](#contribute)
	- [Getting started](#getting-started)

## Usage

_Generally speaking_ - mimic the structure of the object to be mutated.

To [remove a property](#deleting-properties), set its value to null or pass an object containing the property `rule` set to null. \
To [set a property](#setting-values), pass it an object containing a `value` property set to your desired value.

### Deleting properties

```js
funset(object, { prop: { nestedprop: null } }); // Short for …
funset(object, {
	prop: { rule: { nestedprop: { rule: null } } },
});
```

### Setting values

```js
funset(object, {
	prop: { value: new Date() },
});
```

### Modifiers

#### rule

`rule` accepts either an array of objects, an object or `null`. \
When passing `null`, the property will get removed. Otherwise, the object or the array passed will get treated as a path to an object.

#### value

`value` holds what will get set to the property.

### Flags

The value of a property may contain flags, such as `deep` or `default`, and the available modifies `rule` and `value`.

#### deep

Applies your rule globally while only looking into the object of the property it got defined in.

_Example:_

```js
funset(object, { prop: { deep: true, rule: null } });
```

**The passed object** will get searched for occurrences of property `prop`. Findings will get removed - nested ones included. \
The `deep` flag may get used in combination with the `default` flag.

#### default

Only sets the value if the property did not occur at the position of your property.

```js
funset(object, { prop: { default: true, value: null } });
```

#### direct

Treats the values of your property as if they were in a `rule` modifier.

Passing the `direct` flag **will only be neccessary** in the case of a nested property called `value` or `rule`. Otherwise, it is not required.

```js
funset(object, { prop: { direct: true, value: null } });
```

The property `value` of `prop` will get removed.

The same behaviour can get achieved with the following.

```js
funset(object, { prop: { rule: { value: null } } });
```

### Working with arrays

```js
let object = { value: [[{ prop: 1 }]] };

funset(object, { value: { rule: { prop: null } } });
```

As seen in this example, brackets must not necessarily get set.

### Known limitattions

You cannot access the properties "direct" and "value" or "rule" in combination if nested. Alternatively, wrap them in a `rule` modifier.

_Example:_

```js
funset(
	{ value: 1, rule: 1, direct: 1 }, // Object
	{ value: null, rule: null, direct: null } // Modifier
); // No action required

funset(
	{ prop: { value: 1, rule: 1, direct: 1 } }, // Object
	{ prop: { rule: { value: null, rule: null, direct: null } } } // Modifier
); // See the modifier "rule" containing another set of modifiers
```

## Example

Find further examples at [/src/\_\_tests\_\_/](/src/__tests__/) or jump to section [Usage](#usage).

```js
import funset from 'fast-unset';
// const funset = require('fast-unset');

let object = {
	secret: 'shhh',
	morning: false,
	child: [
		[
			{
				morning: false,
				secret: 'shhh',
				child: {
					morning: false,
				},
			},
		],
	],
	nested: {
		pin: 1234,
		nested: {
			anothersecret: 'shh',
		},
	},
};

let mofifier = {
	secret: { deep: true, rule: null }, // Will remove all occurrences of property "secret"
	child: { morning: { deep: true, rule: null } }, // Will remove all occurrences of property "morning" starting at property "child"

	nested: {
		pin: { value: null }, // Removes property "pin" of property "nested"
		nested: { anothersecret: null }, // Will remove nested property "anothersecret"
	},

	// nested: {
	// 	rule: [
	// 		{ pin: { value: null } },
	// 		{ nested: { rule: { anothersecret: { rule: null } } } },
	// 	],
	// }, //! Also valid, though not recommended due to performance impact
};
let settings = {
	clone: false, // Instead, working on a deep clone of the object
}; // Optional though

funset(object, mofifier, settings);

console.log(object);

/* Outputs the following …

  {
		morning: false,
		child: [
			[
				{
					child: {},
				},
			],
		],
		nested: {
			pin: null,
			nested: {},
		},
	}

*/
```

## [Benchmarking](/src/benchmark/index.ts)

⚠️ **Note** that results may differ on different devices, runs and use cases.

| library           | deep clone | result                   | runs sampled | performance |
| :---------------- | :--------: | :----------------------- | :----------- | :---------- |
| fast-redact       |   false    | 983,100 ops/sec ±0.59%   | 94           | 20,4%       |
| unset-value       |   false    | 2,242,176 ops/sec ±0.46% | 98           | 46,6%       |
| fast-unset        |    true    | 2,456,323 ops/sec ±0.41% | 95           | 51%         |
| fast-unset        |   false    | 4,771,697 ops/sec ±0.45% | 94           | 99,2%       |
| fast-unset (bare) |   false    | 4,812,490 ops/sec ±0.50% | 92           | 100%        |

## [Tests](/src/__tests__/)

The [tests](/src/__tests__/) provided may not cover all edge cases. Feel free to suggest new ones or report missing ones.

## API Reference

```js
import funset from 'fast-unset';
// const funset = require("fast-unset");

funset(object, modifier, settings) => Object
```

The function provided is constrained to the following arguments while always returning an object or throwing errors:

- `object`
  - required
  - type: object or an array of objects
- `modifier`
  - required
  - type: object or an array of objects
- `settings`
  - optional
  - type: object
  - valid options
    - `clone`
      - defaults to false
      - type: boolean
      - description: creates a deep clone of `object` before continuing with the process

## Contribute

New ideas, as well as thoughts on this project and pull requests, are very welcome.
Please make sure all tests pass before creating a pull request.

### Getting started

After forking, install all (dev-)dependencies by running the following.

```zsh
npm i
```

Make sure [husky](https://github.com/typicode/husky) is being installed too.

```zsh
npm run prepare
```

\
_And off we go …_

Build this project with the following.

```zsh
npm run build
```

Eventually, run your tests.

```zsh
npm run test
npm run test:watch
```
