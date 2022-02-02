## fast-unset

🪄 Efficiently remove, replace, set or default object properties.

[![build package and run tests](https://github.com/lucagoslar/fast-unset/actions/workflows/main.yml/badge.svg)](https://github.com/lucagoslar/fast-unset/actions/workflows/main.yml)

### Example

Find further examples at [/src/\_\_tests\_\_/](/src/__tests__/).

```js
import funset from 'fast-unset';

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
	// }, //! Also valid syntax, though not recommended due to performance impact
};
let settings = {
	clone: false, // Instead, working on a deep clone of the object
}; // Optional

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

### Usage

_Generally speaking_ - mimic the structure of the object to be mutated.
\
To remove a property, you can set its value to null. You can also set the property to an object that contains another property called `rule` valuing null.
To set a value, pass the property an object that contains a `value` property.

#### Behaviour

A property may contain flags, such as `deep` or `default`, and the available modifies `rule` and `value`.

#### Flags

##### `deep`

The `deep` flag applies the passed value of the property globally.

Example:

```js
funset(object, { prop: { deep: true, rule: null } });
```

The passed object will get searched for occurrences of the property `prop`. Findings will be removed - including nested ones. If specified, you can also set values. \
The `deep` flag may get used in combination with the `default` flag.

---

##### `default`

```js
funset(object, { prop: { default: true, value: null } });
```

The property `value` of the property `prop` will only get set if the object passed does not contain `prop`.

---

##### `direct`

```js
funset(object, { prop: { direct: true, value: null } });
```

The property `value` of `prop` will get removed. \
Note that this flag is only required if either of the properties `value` and `rule` are present in the object.

The equivalent, not using the flag `direct` would be the following.
Using the `rule` modifier will be slower and more challenging to read in a complex environment.

```js
funset(object, { prop: { rule: { value: null } } });
```

---

#### Deleting properties

```js
funset(object, { prop: { nestedprop: null } }); // Short for …
funset(object, {
	prop: { rule: { nestedprop: { rule: null } } },
});
```

#### Setting values

```js
funset(object, {
	prop: { value: new Date() },
});
```

#### Known limitattions

You cannot access the properties "direct" and "value" or "rule" in combination if nested. Alternatively, you can place these in the `rule` flag.

##### Such special cases

```js
funset(
	{ value: 1, rule: 1, direct: 1 }, // Object
	{ value: null, rule: null, direct: null } // Modifier
); // No action required

funset(
	{ prop: { value: 1, rule: 1, direct: 1 } }, // Object
	{ prop: { rule: { value: null, rule: null, direct: null } } } // Modifier
); // See the flag "rule" containing another filter
```

##### Special case: array

```js
funset(
	{ value: [[{ prop: 1 }]] }, // Object
	{ value: { rule: { prop: null } } } // Modifier
);
```

As seen in this example, brackets must not be set but are helpful if you want to split up rules for better readability.

## [Benchmarking](/src/benchmark/index.ts)

**Note** that results may differ on different devices and runs.

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
